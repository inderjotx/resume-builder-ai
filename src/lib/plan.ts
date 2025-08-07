import { planType, } from "@/server/db/schema";
import { z } from "zod";
import { env } from "@/env";

const plan = z.enum(planType.enumValues);

export interface SubscriptionPlan {
    id: z.infer<typeof plan>;
    name: string;
    description: string;
    monthlyPrice: number;
    yearlyPrice: number;
    credits: number;
    features: string[];
    stripePriceIds: {
        monthly: string | undefined;
        yearly: string | undefined;
    };
    popular: boolean;
}

export const subscriptionPlans: SubscriptionPlan[] = [

    {
        id: "free",
        name: 'Free',
        description: '1 AI Resume Generation Based on Job Description',
        monthlyPrice: 0,
        yearlyPrice: 0,
        credits: 20,
        popular: false,
        features: [
            '2 AI Resume Generation Based on Job Description',
            'Limited Templates',
            'Watermark',
        ],
        stripePriceIds: {
            monthly: 'free_monthly',
            yearly: undefined
        }
    }
    ,
    {
        id: "growth",
        name: 'Growth',
        description: '5 AI Resume Generation Based on Job Description',
        monthlyPrice: 19,
        yearlyPrice: 190,
        credits: 100,
        popular: true,
        features: [
            '10 AI Resume Generation Based on Job Description',
            'Resume from LinkedIn Profile',
            'ATS Compliant',
            'All Templates Available',
            'No watermark',
        ],
        stripePriceIds: {
            monthly: env.NEXT_PUBLIC_STRIPE_GROWTH_MONTHLY,
            yearly: env.NEXT_PUBLIC_STRIPE_GROWTH_YEARLY
        }
    }
    ,

    {
        id: "professional",
        name: 'Professional',
        description: '15 AI Resume Generation Based on Job Description',
        monthlyPrice: 29,
        yearlyPrice: 290,
        credits: 250,
        popular: false,
        features: [
            '25 AI Resume Generation Based on Job Description',
            'Resume from LinkedIn Profile',
            'ATS Compliant',
            'All Templates Available',
            'No watermark',
        ],
        stripePriceIds: {
            monthly: env.NEXT_PUBLIC_STRIPE_PROFESSIONAL_MONTHLY,
            yearly: env.NEXT_PUBLIC_STRIPE_PROFESSIONAL_YEARLY
        }
    }
] as const;