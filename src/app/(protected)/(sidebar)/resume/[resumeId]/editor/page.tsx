import EditorDashboard from "@/app/(protected)/(sidebar)/_components/editor-dashboard";
import ResumeService from "@/services/resume";
import UnauthorizedPage from "@/components/ui/unauthorized";

export default async function EditorPage({
  params,
}: {
  params: Promise<{ resumeId: string }>;
}) {
  const resumeId = (await params).resumeId;
  const resume = await ResumeService.getResume(resumeId);

  if (!resume.success) {
    return <UnauthorizedPage />;
  }

  console.log(resume.data);

  return <EditorDashboard resume={resume.data!} />;
}
