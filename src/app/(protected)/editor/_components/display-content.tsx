import React from "react";
import { ClassyTemplate } from "@/components/templates/classy";
import { resumeData } from "@/components/templates";

export default function DisplayContent() {
  return (
    <div className="flex items-center justify-center py-10">
      <ClassyTemplate resume={resumeData} />
    </div>
  );
}
