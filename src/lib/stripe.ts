import Stripe from "stripe"
import { env } from "@/env"

export const stripe = new Stripe(env.STRIPE_API_SECRET, {
    apiVersion: "2024-11-20.acacia",
    typescript: true,
})