"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

export function SubscriptionSection() {
  // This would come from your backend in a real application
  const mockSubscription = {
    plan: "Pro",
    expiresAt: "2024-12-31",
    creditsTotal: 1000,
    creditsUsed: 350,
  };

  const creditsPercentage =
    (mockSubscription.creditsUsed / mockSubscription.creditsTotal) * 100;

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
          <Badge variant="secondary" className="text-sm">
            {mockSubscription.plan}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <div className="mb-2 flex items-center justify-between">
            <p className="text-sm font-medium">Plan expires on</p>
            <p className="text-sm text-muted-foreground">
              {new Date(mockSubscription.expiresAt).toLocaleDateString()}
            </p>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">Credits remaining</p>
              <p className="text-sm text-muted-foreground">
                {mockSubscription.creditsTotal - mockSubscription.creditsUsed}{" "}
                of {mockSubscription.creditsTotal}
              </p>
            </div>
            <Progress value={creditsPercentage} className="h-2" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
