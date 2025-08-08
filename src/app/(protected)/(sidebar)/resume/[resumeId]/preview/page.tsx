import resumeService from "@/services/resume";
import UnauthorizedPage from "@/components/ui/unauthorized";
import { Suspense } from "react";
import { PreviewClient } from "./previewClient";

export default async function PreviewPage({
  params,
}: {
  params: Promise<{ resumeId: string }>;
}) {
  const resumeId = (await params).resumeId;
  const resume = await resumeService.getResume(resumeId);
  if (!resume.success || !resume.data) {
    return <UnauthorizedPage />;
  }
  return (
    <Suspense>
      <PreviewClient resume={resume.data} />
    </Suspense>
  );
}
