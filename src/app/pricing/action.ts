'use server'
import subscriptionService from "@/lib/subscription"
import { auth } from "@/server/auth";
import { redirect } from "next/navigation";


export async function getCheckoutSession(priceId: string) {
    const session = await auth();
    if (!session?.user?.email) {
        redirect('/sign-in?redirect=/pricing')
    }
    const checkoutSession = await subscriptionService.createCheckoutSession(priceId, session.user.email);
    return checkoutSession;
}


export async function manageSubscription() {
    const session = await auth();
    if (!session?.user?.stripeCustomerId) {
        redirect('/sign-in?redirect=/pricing')
    }
    const subscription = await subscriptionService.createBillingPortalSession(session.user.stripeCustomerId);
    return subscription;
}