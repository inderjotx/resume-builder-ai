"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { LinkedInCard } from "./linkedin-card";
import { JobDescriptionCard } from "./jobdescription-card";
import { useMutation } from "@tanstack/react-query";
import { storeLinkedIn } from "@/actions/store-linkedin";

const formSchema = z.object({
  linkedinProfile: z
    .string()
    .min(1, "LinkedIn profile is required")
    .refine((val) => {
      const linkedinRegex =
        /^(https:\/\/[a-z]{2,3}\.linkedin\.com\/.*|[\w\-]{3,100})$/i;
      return linkedinRegex.test(val);
    }, "Please enter a valid LinkedIn profile URL or username"),
  jobDescription: z
    .string()
    .min(200, "Job description must be at least 200 characters")
    .max(5000, "Job description must not exceed 5000 characters"),
});

type FormValues = z.infer<typeof formSchema>;

export function OnboardingForm() {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      linkedinProfile: "",
      jobDescription: "",
    },
  });

  const { mutate: storeLinkedInMutation, isPending } = useMutation({
    mutationFn: async (linkedId: string) => {
      const toastId = toast.loading("Setting up your profile...");
      const response = await storeLinkedIn(linkedId);
      toast.dismiss(toastId);
      if (!response.success) {
        throw new Error(response.error);
      }
      return response.success;
    },
    onSuccess: () => {
      toast.success("Profile setup completed successfully!");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  async function onSubmit(data: FormValues) {
    try {
      storeLinkedInMutation(data.linkedinProfile);
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid gap-8 md:grid-cols-2">
          <LinkedInCard form={form} isLoading={isPending} />
          <JobDescriptionCard form={form} isLoading={isPending} />
        </div>

        <div className="flex justify-center">
          <Button
            type="submit"
            size="lg"
            className="bg-indigo-500 hover:bg-indigo-600"
            disabled={isPending}
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Setting up...
              </>
            ) : (
              "Get Started"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
