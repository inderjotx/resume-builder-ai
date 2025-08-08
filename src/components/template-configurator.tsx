"use client";
import { useMemo } from "react";
import { useResumeStore } from "@/store/resume/data-store";
import { getTemplateById } from "@/components/templates/registry";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { HeadlineCapitalization } from "@/server/db/schema";

export function TemplateConfigurator() {
  const settings = useResumeStore((s) => s.settings);
  const updateSettings = useResumeStore((s) => s.updateSettings);
  const selectedTemplateId = useResumeStore((s) => s.selectedTemplateId);

  const template = useMemo(
    () => getTemplateById(selectedTemplateId),
    [selectedTemplateId],
  );
  const supports = template.supports ?? {};

  return (
    <div className="space-y-4 rounded-md border bg-muted/40 p-4">
      <div className="text-sm font-medium">Template Settings</div>
      <Separator />

      {supports.colors && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Primary Color</Label>
            <Input
              type="color"
              value={settings?.color ?? "#0f172a"}
              onChange={(e) => updateSettings({ color: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label>Secondary Color</Label>
            <Input
              type="color"
              value={settings?.secondaryColor ?? "#0b1220"}
              onChange={(e) =>
                updateSettings({ secondaryColor: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <Label>Accent Color</Label>
            <Input
              type="color"
              value={settings?.accentColor ?? "#2563eb"}
              onChange={(e) => updateSettings({ accentColor: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label>Background Color</Label>
            <Input
              type="color"
              value={settings?.background?.color ?? "#ffffff"}
              onChange={(e) =>
                updateSettings({
                  background: {
                    className: settings?.background?.className ?? "bg-white",
                    opacity: settings?.background?.opacity ?? 1,
                    color: e.target.value,
                  },
                })
              }
            />
          </div>
        </div>
      )}

      {(supports.headingFont ?? supports.bodyFont) && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {supports.bodyFont && (
            <div className="space-y-2">
              <Label>Body Font</Label>
              <Input
                placeholder="e.g., Inter"
                value={settings?.fontFace ?? ""}
                onChange={(e) => updateSettings({ fontFace: e.target.value })}
              />
            </div>
          )}
          {supports.headingFont && (
            <div className="space-y-2">
              <Label>Heading Font</Label>
              <Input
                placeholder="e.g., Poppins"
                value={settings?.headingFontFace ?? ""}
                onChange={(e) =>
                  updateSettings({ headingFontFace: e.target.value })
                }
              />
            </div>
          )}
          <div className="space-y-2">
            <Label>Base Font Size</Label>
            <Input
              placeholder="e.g., 14px"
              value={settings?.fontSize ?? "16px"}
              onChange={(e) => updateSettings({ fontSize: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label>Line Height</Label>
            <Input
              placeholder="e.g., 1.5"
              value={settings?.lineHeight ?? "1.5"}
              onChange={(e) => updateSettings({ lineHeight: e.target.value })}
            />
          </div>
        </div>
      )}

      {supports.capitalization && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Heading Capitalization</Label>
            <Select
              value={
                settings?.headlineCapitalization ??
                HeadlineCapitalization.AsTyped
              }
              onValueChange={(v) =>
                updateSettings({
                  headlineCapitalization:
                    v as unknown as HeadlineCapitalization,
                })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={HeadlineCapitalization.AsTyped}>
                  As Typed
                </SelectItem>
                <SelectItem value={HeadlineCapitalization.Uppercase}>
                  Uppercase
                </SelectItem>
                <SelectItem value={HeadlineCapitalization.Lowercase}>
                  Lowercase
                </SelectItem>
                <SelectItem value={HeadlineCapitalization.Capitalize}>
                  Capitalize
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          {supports.iconVariant && (
            <div className="space-y-2">
              <Label>Icon Style</Label>
              <Select
                value={(settings?.iconType ?? "regular") as string}
                onValueChange={(v) =>
                  updateSettings({ iconType: v as unknown as any })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={"regular"}>Regular</SelectItem>
                  <SelectItem value={"bold"}>Bold</SelectItem>
                  <SelectItem value={"light"}>Light</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
