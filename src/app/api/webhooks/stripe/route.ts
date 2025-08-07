import { headers } from "next/headers";
import Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import SubscriptionService from "@/lib/subscription";
import { env } from "@/env";

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
    const body = await req.text();
    const headersList = await headers();
    const signature = headersList.get("Stripe-Signature")!;

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            env.STRIPE_WEBHOOK_SECRET
        );
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown Error';
        return new Response(`Webhook Error: ${errorMessage}`, { status: 400 });
    }

    try {
        switch (event.type) {
            case "checkout.session.completed": {
                const session = event.data.object as Stripe.Checkout.Session;
                const subscription = await stripe.subscriptions.retrieve(
                    session.subscription as string
                );
                const customer = subscription.customer as string;
                const priceId = subscription.items.data[0]!.price!.id;
                const endDate = new Date(subscription.current_period_end * 1000);

                console.log("Subscribing user to plan ", { priceId, endDate, customerId: customer, subscriptionId: subscription.id });
                console.log({ subscription });

                await SubscriptionService.subscribeUserToPlan({
                    email: session.customer_details!.email!,
                    priceId,
                    endDate,
                    customerId: customer,
                    subscriptionId: subscription.id
                });
                break;
            }

            case "invoice.payment_succeeded": {

                const invoice = event.data.object as Stripe.Invoice;

                console.log("Invoice payment succeeded", { invoice });
                if (invoice.billing_reason === "subscription_cycle") {

                    console.log('Billing reason is subscription_cycle');

                    const subscription = await stripe.subscriptions.retrieve(
                        invoice.subscription as string
                    );

                    await SubscriptionService.renewSubscription({
                        subscriptionId: subscription.id,
                        endDate: new Date(subscription.current_period_end * 1000)
                    });
                }
                break;
            }

            case "customer.subscription.deleted": {
                const subscription = event.data.object as Stripe.Subscription;
                await SubscriptionService.cancelSubscription(subscription.id);
                break;
            }

        }

        return new Response(null, { status: 200 });
    } catch (error) {
        console.error('Webhook error:', error);
        return new Response(
            `Webhook Error: ${error instanceof Error ? error.message : 'Unknown Error'}`,
            { status: 400 }
        );
    }
}

