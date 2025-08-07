import React from "react";
import { ClassyTemplate } from "@/components/templates/classy";

export default function DisplayContent({
  ref,
}: {
  ref: React.RefObject<HTMLDivElement>;
}) {
  return (
    <div className="flex items-center justify-center py-10">
      <ClassyTemplate ref={ref} />
    </div>
  );
}
