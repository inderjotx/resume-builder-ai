import React, { Suspense } from "react";
import { CreateSection } from "./_components/create-section";
import { ResumeSkeleton } from "./_components/resume-skeleton";
import { ResumeCards } from "./_components/resume-card";

import { getUserResumes } from "@/services/user";

export default function DashboardPage() {
  return (
    <div className="mx-auto flex h-screen w-full flex-col gap-8 px-10 py-8">
      <CreateSection />
      <Suspense fallback={<ResumeSkeleton />}>
        <ResumeSection />
      </Suspense>
    </div>
  );
}

const ResumeSection = async () => {
  const resumes = await getUserResumes();
  return (
    <div className="flex flex-col gap-2">
      <h2 className="text-xl">Resume</h2>
      <ResumeCards resumes={resumes} />
    </div>
  );
};
