"use client";

import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckIcon } from "lucide-react";
import { useCredits } from "@/hooks/use-credits";
import { useSession } from "next-auth/react";
import { getCheckoutSession, manageSubscription } from "../action";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export interface SubscriptionPlan {
  id: string;
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

interface PricingProps {
  plans: SubscriptionPlan[];
}

export function Pricing({ plans }: PricingProps) {
  const [isYearly, setIsYearly] = useState(false);
  const { data: credits } = useCredits();
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  console.log(credits);
  const handlePlanAction = async (plan: SubscriptionPlan) => {
    setIsLoading(true);
    console.log(session);
    if (!session) {
      router.push("/sign-in?redirect=/pricing");
      return;
    }

    if (plan.id === "free") {
      router.push("/dashboard");
      return;
    }

    if (credits?.subscription?.plan != "free") {
      const toastId = toast.loading("Redirecting to billing portal...");
      const billingUrl = await manageSubscription();
      toast.dismiss(toastId);
      if (!billingUrl) {
        toast.error("Failed to redirect to billing portal");
        return;
      }
      window.location.href = billingUrl;
      return;
    }

    const priceId = isYearly
      ? plan.stripePriceIds.yearly
      : plan.stripePriceIds.monthly;

    if (priceId) {
      const toastId = toast.loading("Redirecting to checkout...");
      const checkoutUrl = await getCheckoutSession(priceId);
      toast.dismiss(toastId);
      if (!checkoutUrl) {
        toast.error("Failed to redirect to checkout");
        return;
      }
      setIsLoading(false);
      window.location.href = checkoutUrl;
    }
  };

  return (
    <div className="container mx-auto px-4 py-28">
      <h2 className="mb-4 text-center text-3xl font-bold">Choose Your Plan</h2>
      <div className="mb-4 flex items-center justify-center">
        <span className="mr-3 text-sm font-medium">Monthly</span>
        <Switch
          checked={isYearly}
          onCheckedChange={setIsYearly}
          aria-label="Toggle yearly pricing"
        />
        <span className="ml-3 text-sm font-medium">Yearly</span>
      </div>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {plans.map((plan) => (
          <Card
            key={plan.id}
            className={`flex flex-col ${plan.popular ? "border-primary" : ""}`}
          >
            <CardHeader>
              <CardTitle>{plan.name}</CardTitle>
              <CardDescription>{plan.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <div className="mb-4">
                <span className="text-3xl font-bold">
                  $
                  {isYearly
                    ? (plan.yearlyPrice / 12).toFixed(2)
                    : plan.monthlyPrice}
                </span>
                <span className="text-muted-foreground">/month</span>
                {isYearly && plan.id !== "free" && (
                  <Badge variant="secondary" className="ml-2">
                    Two Months Free
                  </Badge>
                )}
              </div>
              <p className="mb-4 text-muted-foreground">
                {plan.credits} credits
              </p>
              <ul className="space-y-2">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <CheckIcon className="mr-2 h-5 w-5 text-primary" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button
                disabled={isLoading}
                className="w-full"
                variant={plan.popular ? "default" : "outline"}
                onClick={() => handlePlanAction(plan)}
              >
                {status === "unauthenticated"
                  ? "Sign in"
                  : credits?.subscription?.plan == "growth" ||
                      credits?.subscription?.plan == "professional"
                    ? "Manage Subscription"
                    : plan.id === "free"
                      ? "Get Started"
                      : "Subscribe Now"}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
