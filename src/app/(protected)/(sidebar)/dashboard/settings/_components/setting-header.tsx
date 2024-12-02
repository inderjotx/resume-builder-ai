import { Settings } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export function SettingsHeader() {
  return (
    <div>
      <div className="space-y-0.5 px-6">
        <div className="flex items-center gap-2">
          <Settings className="h-6 w-6" />
          <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
        </div>
        <p className="text-muted-foreground">
          Manage your account settings and preferences.
        </p>
      </div>
      <Separator className="mt-4" />
    </div>
  );
}
