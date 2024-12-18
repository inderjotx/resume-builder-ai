import { Pricing } from "@/app/(marketing)/pricing/_components/pricing-cards";
import { subscriptionPlans } from "@/lib/plan";

export default function PricingPage() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-4">
      <Pricing plans={subscriptionPlans} />
    </main>
  );
}
