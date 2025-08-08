"use client";
import { useEffect, useRef } from "react";
import type { Resume } from "@/server/db/schema";
import { useResumeStore } from "@/store/resume/data-store";
import DisplayContent from "../../../_components/display-content";

export function PreviewClient({ resume }: { resume: Resume }) {
  const updateAll = useResumeStore((s) => s.updateAll);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    updateAll({
      data: resume.data!,
      settings: resume.settings!,
      order: resume.order!,
    });
  }, [resume, updateAll]);

  return (
    <div className="flex min-h-screen w-full items-start justify-center bg-muted p-6">
      <DisplayContent ref={ref as React.RefObject<HTMLDivElement>} />
    </div>
  );
}
