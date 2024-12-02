"use client";

import { subscriptionPlans } from "@/lib/plan";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useCredits } from "@/hooks/use-credits";

export function SubscriptionSection() {
  const { data, isLoading } = useCredits();

  if (isLoading) {
    return (
      <Card className="max-w-4xl">
        <CardContent className="flex h-[200px] items-center justify-center">
          <p className="text-muted-foreground">
            Loading subscription details...
          </p>
        </CardContent>
      </Card>
    );
  }

  if (!data) return null;
  const currentPlan = subscriptionPlans.find(
    (plan) => plan.id === data.subscription.plan,
  );

  if (!currentPlan) return null;

  const creditsPercentage = (data.credits / currentPlan.credits) * 100;

  return (
    <Card className="max-w-4xl">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Subscription</CardTitle>
            <CardDescription>
              Manage your subscription and usage
            </CardDescription>
          </div>
          <Badge variant="secondary" className="text-sm uppercase">
            {data.subscription.plan}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <div className="mb-2 flex items-center justify-between">
            <p className="text-sm font-medium">Plan expires on</p>
            <p className="text-sm text-muted-foreground">
              {new Date(data.subscription.endDate!).toLocaleDateString()}
            </p>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">Credits remaining</p>
              <p className="text-sm text-muted-foreground">
                {currentPlan.credits - data.credits} of {currentPlan.credits}
              </p>
            </div>
            <Progress value={creditsPercentage} className="h-2" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
