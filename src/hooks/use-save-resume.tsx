import { updateResume } from "@/actions/resume-mutation";
import {
  type ResumeDataStore,
  useResumeStore,
} from "@/store/resume/data-store";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useRef } from "react";

const SAVE_RESUME_DELAY = 5000;

export const useSaveResume = (resumeId: string) => {
  const data = useResumeStore((state) => state.getData());
  const timeOutId = useRef<NodeJS.Timeout | null>(null);

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: ResumeDataStore) => {
      await updateResume({
        resumeId: resumeId,
        name: "Untitled Resume",
        data: data?.data,
        order: data?.order,
        settings: data?.settings,
      });
    },
  });

  useEffect(() => {
    // Clear any existing timeout
    if (timeOutId.current) {
      clearTimeout(timeOutId.current);
    }

    // Set new timeout with latest data
    timeOutId.current = setTimeout(() => {
      mutate(data);
      timeOutId.current = null; // Reset the ref after execution
    }, SAVE_RESUME_DELAY);

    // Cleanup function to clear timeout on unmount or when effect re-runs
    return () => {
      if (timeOutId.current) {
        clearTimeout(timeOutId.current);
      }
    };
  }, [data, resumeId, mutate]);

  return {
    isPending,
  };
};
