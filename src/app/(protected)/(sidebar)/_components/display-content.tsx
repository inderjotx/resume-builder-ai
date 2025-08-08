import React from "react";
import { useResumeStore } from "@/store/resume/data-store";
import { getTemplateById } from "@/components/templates/registry";

export default function DisplayContent({
  ref,
}: {
  ref: React.RefObject<HTMLDivElement>;
}) {
  const selectedTemplateId = useResumeStore((s) => s.selectedTemplateId);
  const Template = getTemplateById(selectedTemplateId).component;
  return (
    <div className="flex items-center justify-center py-10">
      <Template ref={ref} />
    </div>
  );
}
