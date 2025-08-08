"use client";
import { TemplatePicker } from "@/components/template-picker";

export function TemplateBar() {
  return (
    <div className="flex items-center justify-between rounded-md border bg-muted/40 px-3 py-2">
      <div className="text-sm text-muted-foreground">Template</div>
      <TemplatePicker />
    </div>
  );
}
