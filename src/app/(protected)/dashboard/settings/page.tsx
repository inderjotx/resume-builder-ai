import React from "react";
import { SettingsHeader } from "./_components/setting-header";
import { SubscriptionSection } from "./_components/subscription-section";
import { DangerZone } from "./_components/danger-zone";

export default function page() {
  return (
    <div className="flex w-full flex-col gap-8 py-8">
      <SettingsHeader />
      <div className="flex flex-col gap-8 px-4">
        <SubscriptionSection />
        <DangerZone />
      </div>
    </div>
  );
}
