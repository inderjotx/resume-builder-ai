import { updateResume } from "@/actions/resume-mutation";
import {
  type ResumeDataStore,
  useResumeStore,
} from "@/store/resume/data-store";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useRef } from "react";

const SAVE_RESUME_DELAY = 5000;

export const useSaveResume = (resumeId: string) => {
  const timeOutId = useRef<NodeJS.Timeout | null>(null);

  const { mutate, isPending, isSuccess } = useMutation({
    mutationFn: async (data: ResumeDataStore) => {
      await updateResume({
        resumeId: resumeId,
        data: data?.data,
        order: data?.order,
        settings: data?.settings,
      });
    },
  });

  // Subscribe to store changes on mount
  useEffect(() => {
    const unsubscribe = useResumeStore.subscribe((state) => {
      if (timeOutId.current) {
        clearTimeout(timeOutId.current);
      }
      timeOutId.current = setTimeout(() => {
        console.log("saving resume");
        mutate(state.getData());
        timeOutId.current = null;
      }, SAVE_RESUME_DELAY);
    });

    return () => {
      unsubscribe();
      if (timeOutId.current) {
        clearTimeout(timeOutId.current);
      }
    };
  }, [mutate, resumeId]);

  return {
    isPending,
    isSuccess,
  };
};
