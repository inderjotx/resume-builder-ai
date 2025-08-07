import { Skeleton } from "@/components/ui/skeleton";
export const ResumeSkeleton = () => {
  return (
    <div className="flex flex-col gap-2">
      <h2 className="text-xl">Resume</h2>
      <Skeleton className="h-40 w-full" />
    </div>
  );
};
