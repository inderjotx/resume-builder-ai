"use client";
import type React from "react";
import { ClassyTemplate } from "@/components/templates/classy";
import { SmartTemplate } from "@/components/templates/smart";

export type TemplateDefinition = {
  id: string;
  name: string;
  thumbnail: string; // public path
  component: React.ComponentType<{ ref: React.RefObject<HTMLDivElement> }>;
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
  },
  {
    id: "smart",
    name: "Smart",
    thumbnail: "/resume/smart.png",
    component: SmartTemplate,
  },
];

export function getTemplateById(id: string): TemplateDefinition {
  return TEMPLATES.find((t) => t.id === id) ?? TEMPLATES[0]!;
}


