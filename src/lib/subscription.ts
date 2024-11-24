import { db } from "@/server/db";
import { subscriptionPlans } from "@/lib/plan";
import {
    subscriptions,
    creditLogs,
    users,
    type User,
    subscriptionStatus,
    planType,
    billingInterval,
    creditTransactionType
} from "@/server/db/schema";
import { stripe } from "@/lib/stripe";
import { and, eq, gt } from "drizzle-orm";

// Type definitions to match schema
type Subscription = typeof subscriptions.$inferSelect;
type CreditLog = typeof creditLogs.$inferSelect;

const MONTHLY_SECONDS = 30 * 24 * 60 * 60 * 1000;

export class SubscriptionService {

    private async retryOperation<T>(
        operation: () => Promise<T>,
        maxRetries: number = 3,
        delay: number = 1000
    ): Promise<T> {
        let lastError: Error | undefined;

        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                return await operation();
            } catch (error) {
                lastError = error as Error;
                if (attempt === maxRetries) break;
                await new Promise(resolve => setTimeout(resolve, delay * attempt));
            }
        }
        if (lastError) throw lastError;
    }

    private getPlanFromPriceId(priceId: string) {
        return subscriptionPlans.find(plan =>
            plan.stripePriceIds.monthly === priceId ||
            plan.stripePriceIds.yearly === priceId
        );
    }

    async subscribeUserToPlan({
        email,
        priceId,
        endDate,
        customerId,
        subscriptionId,
    }: {
        email: string;
        priceId: string;
        endDate: Date;
        customerId: string;
        subscriptionId: string;
    }) {
        return this.retryOperation(async () => {
            const plan = this.getPlanFromPriceId(priceId);
            if (!plan) throw new Error("Invalid price ID");

            const interval = plan.stripePriceIds.monthly === priceId
                ? "monthly" as const
                : "yearly" as const;

            const nextCreditRefresh = interval === "yearly"
                ? new Date(Date.now() + MONTHLY_SECONDS)
                : null;

            // Find or create user
            const existingUser = await db.query.users.findFirst({
                where: eq(users.email, email),
            });

            const user = existingUser
                ? await db.update(users)
                    .set({
                        stripeCustomerId: customerId,
                        credits: (existingUser.credits ?? 0) + plan.credits
                    })
                    .where(eq(users.email, email))
                    .returning()
                : await db.insert(users)
                    .values({
                        email,
                        stripeCustomerId: customerId,
                        credits: plan.credits
                    })
                    .returning();

            if (!user?.[0]?.id) throw new Error("User not found");

            // Create subscription
            const subscription = await db.insert(subscriptions)
                .values({
                    userId: user[0].id,
                    stripeCustomerId: customerId,
                    stripePriceId: priceId,
                    stripeSubscriptionId: subscriptionId,
                    status: "active",
                    plan: plan.id.toLowerCase() as keyof typeof planType.enumValues,
                    interval,
                    startDate: new Date(),
                    endDate,
                    lastCreditRefresh: new Date(),
                    nextCreditRefresh
                })
                .returning();

            // Add credit log
            const creditLog = await db.insert(creditLogs)
                .values({
                    userId: user[0].id,
                    amount: plan.credits,
                    type: "subscription_credit",
                    description: `Initial ${plan.name} plan credits`
                })
                .returning();

            return { user: user[0], subscription: subscription[0], creditLog: creditLog[0] };
        });
    }

    async isValidSubscription(userId: string, priceId: string): Promise<boolean> {
        const subscription = await db.query.subscriptions.findFirst({
            where: and(
                eq(subscriptions.userId, userId),
                eq(subscriptions.stripePriceId, priceId),
                eq(subscriptions.status, "active"),
                gt(subscriptions.endDate, new Date())
            ),
        });

        return !!subscription;
    }

    async getCurrentSubscription(userId: string) {
        return await db.query.subscriptions.findFirst({
            where: and(
                eq(subscriptions.userId, userId),
                eq(subscriptions.status, "active"),
                gt(subscriptions.endDate, new Date())
            ),
            orderBy: (subscriptions, { desc }) => [desc(subscriptions.createdAt)]
        });
    }

    async cancelSubscription(subscriptionId: string) {
        return this.retryOperation(async () => {
            const subscription = await db.query.subscriptions.findFirst({
                where: eq(subscriptions.stripeSubscriptionId, subscriptionId),
                with: {
                    user: true
                }
            });

            if (!subscription) throw new Error("Subscription not found");

            // Update subscription status
            await db.update(subscriptions)
                .set({
                    status: "canceled",
                    canceledAt: new Date()
                })
                .where(eq(subscriptions.id, subscription.id));

            // Log remaining credits expiry if user has credits
            if (subscription.user.credits > 0) {
                await db.insert(creditLogs)
                    .values({
                        userId: subscription.userId,
                        amount: -subscription.user.credits,
                        type: "credit_expiry",
                        description: 'Credits expired due to subscription cancellation'
                    });

                // Reset user credits
                await db.update(users)
                    .set({ credits: 0 })
                    .where(eq(users.id, subscription.userId));
            }
        });
    }

    async getUserCredits(userId: string) {
        // return this.retryOperation(async () => {

        const user = await db.query.users.findFirst({
            where: eq(users.id, userId),
            with: {
                subscriptions: {
                    where: {
                        status: "active",
                        endDate: { gt: new Date() }
                    },
                    orderBy: (subscriptions, { desc }) => [desc(subscriptions.createdAt)],
                    take: 1
                }
            }
        });

        if (!user) throw new Error("User not found");

        const activeSubscription = user.subscriptions[0];

        // Check if credits need to be refreshed for yearly subscriptions
        if (activeSubscription?.interval === 'yearly') {
            const shouldRefreshCredits = this.shouldRefreshYearlySubscriptionCredits(activeSubscription);

            if (shouldRefreshCredits) {
                return await this.refreshYearlySubscriptionCredits(user.id, activeSubscription);
            }
        }

        return {
            credits: user.credits,
            subscription: activeSubscription
        };
        // });
    }

    private shouldRefreshYearlySubscriptionCredits(subscription: Subscription): boolean {
        if (!subscription.lastCreditRefresh) return false;

        const nextRefreshDate = new Date(subscription.lastCreditRefresh.getTime() + MONTHLY_SECONDS);
        return new Date() >= nextRefreshDate;
    }

    private async refreshYearlySubscriptionCredits(userId: string, subscription: Subscription) {
        return await db.$transaction(async (tx) => {
            const plan = this.getPlanFromPriceId(subscription.stripePriceId);
            if (!plan) throw new Error("Plan not found");

            // Expire old credits
            const user = await tx.query.users.findFirst({ where: eq(users.id, userId) });
            if (user?.credits && user.credits > 0) {
                await tx.insert(creditLogs)
                    .values({
                        userId: userId,
                        amount: -user.credits,
                        type: "credit_expiry",
                        description: "Monthly credit expiry for yearly subscription"
                    });
            }

            // Add new credits
            await tx.insert(creditLogs)
                .values({
                    userId: userId,
                    amount: plan.credits,
                    type: "subscription_credit",
                    description: `Monthly credit refresh for ${plan.name} plan`
                });

            // Update subscription refresh dates
            await db.update(subscriptions)
                .set({
                    lastCreditRefresh: new Date(),
                    nextCreditRefresh: new Date(Date.now() + MONTHLY_SECONDS)
                })
                .where(eq(subscriptions.id, subscription.id));

            // Update user credits
            const updatedUser = await db.update(users)
                .set({ credits: plan.credits })
                .where(eq(users.id, userId))
                .returning();

            return {
                credits: updatedUser[0].credits,
                subscription
            };
        });
    }

    async deductCredits(userId: string, amount: number, description: string) {
        return this.retryOperation(async () => {
            const user = await db.query.users.findFirst({
                where: eq(users.id, userId)
            });

            if (!user) throw new Error("User not found");
            if (user.credits < amount) throw new Error("Insufficient credits");

            return await db.$transaction(async (tx) => {
                // Log credit usage
                await tx.insert(creditLogs)
                    .values({
                        userId: userId,
                        amount: -amount,
                        type: "ai_resume_generation", // Updated to match schema
                        description
                    });

                // Update user credits
                return await tx.update(users)
                    .set({ credits: user.credits - amount })
                    .where(eq(users.id, userId))
                    .returning();
            });
        });
    }

    async renewSubscription({
        subscriptionId,
        endDate
    }: {
        subscriptionId: string;
        endDate: Date;
    }) {
        return this.retryOperation(async () => {
            const subscription = await db.query.subscriptions.findFirst({
                where: eq(subscriptions.stripeSubscriptionId, subscriptionId),
                with: {
                    user: true
                }
            });

            if (!subscription) throw new Error("Subscription not found");

            await db.$transaction(async (tx) => {
                // Update subscription end date
                await db.update(subscriptions)
                    .set({
                        endDate,
                        lastCreditRefresh: new Date(),
                        nextCreditRefresh: subscription.interval === 'yearly'
                            ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
                            : null
                    })
                    .where(eq(subscriptions.id, subscription.id));

                const plan = this.getPlanFromPriceId(subscription.stripePriceId);
                if (!plan) throw new Error("Plan not found");

                const updatedUser = await db.update(users)
                    .set({ credits: plan.credits })
                    .where(eq(users.id, subscription.userId))
                    .returning();

                const creditLog = await db.insert(creditLogs)
                    .values({
                        userId: subscription.userId,
                        amount: plan.credits,
                        type: "subscription_credit",
                        description: `${plan.name} subscription renewal credit refresh`
                    })
                    .returning();

                console.log("Renewed subscription", { updatedSubscription: subscription, updatedUser: updatedUser[0], creditLog: creditLog[0] });

            });
        });
    }

    async createCheckoutSession(priceId: string, email: string) {
        return this.retryOperation(async () => {
            const session = await stripe.checkout.sessions.create({
                mode: 'subscription',
                payment_method_types: ['card'],
                line_items: [{
                    price: priceId,
                    quantity: 1,
                }],
                success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`,
                cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing`,
                customer_email: email,
                subscription_data: {
                    metadata: {
                        email: email
                    }
                }
            });

            return session.url;
        });
    }

    async createBillingPortalSession(customerId: string) {
        return this.retryOperation(async () => {
            const session = await stripe.billingPortal.sessions.create({
                customer: customerId,
                return_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`,
            });

            return session.url;
        });
    }
}



export default new SubscriptionService();