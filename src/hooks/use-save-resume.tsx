import { updateResume } from "@/actions/resume-mutation";
import {
  type ResumeDataStore,
  useResumeStore,
} from "@/store/resume/data-store";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";

// const SAVE_RESUME_DELAY = 5000;

export const useSaveResume = (resumeId: string) => {
  // const timeOutId = useRef<NodeJS.Timeout | null>(null);
  const [isDirty, setIsDirty] = useState(false);

  const { mutate, isPending, isSuccess } = useMutation({
    mutationFn: async (data: ResumeDataStore) => {
      await updateResume({
        resumeId: resumeId,
        data: data?.data,
        order: data?.order,
        settings: data?.settings,
      });
    },
    onSuccess: () => setIsDirty(false),
  });

  // Subscribe to store changes on mount
  // useEffect(() => {
  //   const unsubscribe = useResumeStore.subscribe((state) => {
  //     if (timeOutId.current) {
  //       clearTimeout(timeOutId.current);
  //     }
  //     timeOutId.current = setTimeout(() => {
  //       console.log("saving resume");
  //       mutate(state.getData());
  //       timeOutId.current = null;
  //     }, SAVE_RESUME_DELAY);
  //   });

  //   return () => {
  //     unsubscribe();
  //     if (timeOutId.current) {
  //       clearTimeout(timeOutId.current);
  //     }
  //   };
  // }, [mutate, resumeId]);

  const saveNow = (store: ReturnType<typeof useResumeStore.getState>) => {
    mutate(store.getData());
  };

  // Track dirty state
  useEffect(() => {
    const unsubscribe = useResumeStore.subscribe(() => {
      setIsDirty(true);
    });
    return () => unsubscribe();
  }, []);

  // Warn on navigation if dirty
  useEffect(() => {
    const beforeUnload = (e: BeforeUnloadEvent) => {
      if (!isDirty) return;
      e.preventDefault();
      e.returnValue =
        "You have unsaved changes. Are you sure you want to leave?";
    };
    window.addEventListener("beforeunload", beforeUnload);
    return () => window.removeEventListener("beforeunload", beforeUnload);
  }, [isDirty]);

  return {
    isPending,
    isSuccess,
    isDirty,
    save: () => saveNow(useResumeStore.getState()),
  };
};
