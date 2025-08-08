import React, { forwardRef } from "react";
import { useResumeStore } from "@/store/resume/data-store";
import { getTemplateById } from "@/components/templates/registry";

const DisplayContent = forwardRef<HTMLDivElement, Record<string, never>>(
  function DisplayContent(_, ref) {
    const selectedTemplateId = useResumeStore((s) => s.selectedTemplateId);
    const Template = getTemplateById(selectedTemplateId).component;
    return (
      <div className="flex items-center justify-center py-10">
        <Template ref={ref as React.RefObject<HTMLDivElement>} />
      </div>
    );
  },
);

export default DisplayContent;
