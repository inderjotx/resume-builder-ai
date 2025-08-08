"use client";
import type React from "react";
import { ElegantSidebarTemplate } from "@/components/templates/elegant-sidebar";

export type TemplateDefinition = {
  id: string;
  name: string;
  thumbnail: string; // public path
  component: React.ComponentType<{ ref: React.RefObject<HTMLDivElement> }>;
  // Capability flags; controls which settings are shown and applied
  supports: {
    colors?: boolean; // primary/secondary/accent
    headingFont?: boolean;
    bodyFont?: boolean;
    capitalization?: boolean;
    backgroundColor?: boolean;
    iconVariant?: boolean;
  };
};

// Import additional templates here as they are created
// For now, we'll register Classy and a Simple variant that reuses Classy until
// a distinct layout is added.

export const TEMPLATES: TemplateDefinition[] = [
  {
    id: "elegant-sidebar",
    name: "Elegant Sidebar",
    thumbnail: "/resume/resume2.png",
    component: ElegantSidebarTemplate,
    supports: {
      colors: true,
      headingFont: true,
      bodyFont: true,
      capitalization: true,
      backgroundColor: true,
    },
  },
];

export function getTemplateById(id: string): TemplateDefinition {
  return TEMPLATES.find((t) => t.id === id) ?? TEMPLATES[0]!;
}
