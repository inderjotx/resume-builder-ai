"use client";
import type React from "react";
import { ClassyTemplate } from "@/components/templates/classy";
import { SmartTemplate } from "@/components/templates/smart";
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
    id: "classy",
    name: "Classy",
    thumbnail: "/resume/classy.png",
    component: ClassyTemplate,
    supports: {
      colors: true,
      headingFont: true,
      bodyFont: true,
      capitalization: true,
      backgroundColor: true,
      iconVariant: true,
    },
  },
  {
    id: "smart",
    name: "Smart",
    thumbnail: "/resume/smart.png",
    component: SmartTemplate,
    supports: {
      colors: true,
      headingFont: true,
      bodyFont: true,
      capitalization: true,
      backgroundColor: true,
    },
  },
  {
    id: "postcard",
    name: "Postcard",
    thumbnail: "/resume/postcard.png",
    component: ClassyTemplate,
    supports: { colors: true, headingFont: true, backgroundColor: true },
  },
  {
    id: "sharp",
    name: "Sharp",
    thumbnail: "/resume/sharp.png",
    component: SmartTemplate,
    supports: { colors: true, bodyFont: true },
  },
  {
    id: "soft",
    name: "Soft",
    thumbnail: "/resume/soft.png",
    component: ClassyTemplate,
    supports: { colors: true },
  },
  {
    id: "doodle",
    name: "Doodle",
    thumbnail: "/resume/doodle.png",
    component: SmartTemplate,
    supports: { colors: true, backgroundColor: true },
  },
  {
    id: "gradient",
    name: "Gradient",
    thumbnail: "/resume/gradient.png",
    component: ClassyTemplate,
    supports: { colors: true },
  },
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
