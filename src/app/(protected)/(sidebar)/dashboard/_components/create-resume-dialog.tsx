"use client";

import { ResponsiveModalDrawer } from "@/components/ui/responsive-modal";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type UseFormReturn } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Briefcase, Linkedin, Upload } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createResume } from "@/actions/create-resume";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { type ResumeData } from "@/server/db/schema";

export type CardType = "ai" | "old-to-new" | "linkedin" | "manual";

interface CreateResumeInput {
  name: string;
  templateId: string;
  data?: ResumeData;
}

interface CreateResumeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type: CardType;
}

// Add form schemas
const baseFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  templateId: z.string().min(1, "Template ID is required"),
});

const aiFormSchema = baseFormSchema.extend({
  jobDescription: z.string().min(1, "Job description is required").max(5000),
});

const linkedInFormSchema = baseFormSchema.extend({
  linkedinProfile: z.string().min(1, "LinkedIn profile is required"),
});

const oldToNewFormSchema = baseFormSchema.extend({
  pdfFile: z.any(), // You might want to add proper file validation
});

type AIFormValues = z.infer<typeof aiFormSchema>;
type LinkedInFormValues = z.infer<typeof linkedInFormSchema>;
type OldToNewFormValues = z.infer<typeof oldToNewFormSchema>;

export const CreateResumeDialog = ({
  open,
  onOpenChange,
  type,
}: CreateResumeDialogProps) => {
  const queryClient = useQueryClient();
  const manualForm = useForm<ManualFormValues>({
    resolver: zodResolver(manualFormSchema),
    defaultValues: { name: "", templateId: "" },
  });

  const aiForm = useForm<AIFormValues>({
    resolver: zodResolver(aiFormSchema),
    defaultValues: { name: "", templateId: "", jobDescription: "" },
  });

  const linkedInForm = useForm<LinkedInFormValues>({
    resolver: zodResolver(linkedInFormSchema),
    defaultValues: { name: "", templateId: "", linkedinProfile: "" },
  });

  const oldToNewForm = useForm<OldToNewFormValues>({
    resolver: zodResolver(oldToNewFormSchema),
    defaultValues: { name: "", templateId: "", pdfFile: null },
  });

  const { mutate: createResumeMutation, isPending } = useMutation({
    mutationFn: async (data: CreateResumeInput) => {
      try {
        await createResume(data);
      } catch (error) {
        await queryClient.invalidateQueries({ queryKey: ["credits"] });
        throw error;
      }
    },
    onError: (error) => {
      if (error instanceof Error) {
        if (error.message == "NEXT_REDIRECT") {
          // do nathing
        } else {
          toast.error(error.message);
        }
      } else {
        toast.error("Failed to create resume");
      }
    },
  });

  return (
    <ResponsiveModalDrawer
      title="Create Resume"
      open={open}
      onOpenChange={(value) => {
        if (!isPending) {
          onOpenChange(value);
        }
      }}
    >
      {type === "manual" && (
        <ManualForm
          form={manualForm}
          mutation={createResumeMutation}
          isPending={isPending}
        />
      )}
      {type === "ai" && (
        <AIForm
          form={aiForm}
          mutation={createResumeMutation}
          isPending={isPending}
        />
      )}
      {type === "linkedin" && (
        <LinkedInForm
          form={linkedInForm}
          mutation={createResumeMutation}
          isPending={isPending}
        />
      )}
      {type === "old-to-new" && (
        <OldToNewForm
          form={oldToNewForm}
          mutation={createResumeMutation}
          isPending={isPending}
        />
      )}
    </ResponsiveModalDrawer>
  );
};

const manualFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  templateId: z.string().min(1, "Template ID is required"),
});

type ManualFormValues = z.infer<typeof manualFormSchema>;

const ManualForm = ({
  form,
  mutation,
  isPending,
}: {
  form: UseFormReturn<ManualFormValues>;
  mutation: (data: CreateResumeInput) => void;
  isPending: boolean;
}) => {
  const onSubmit = (data: ManualFormValues) => {
    mutation(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 p-4">
        <BaseFormFields form={form} isPending={isPending} />
        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating...
            </>
          ) : (
            "Create Resume"
          )}
        </Button>
      </form>
    </Form>
  );
};

const AIForm = ({
  form,
  mutation,
  isPending,
}: {
  form: UseFormReturn<AIFormValues>;
  mutation: (data: CreateResumeInput) => void;
  isPending: boolean;
}) => {
  const onSubmit = (data: AIFormValues) => {
    mutation({
      name: data.name,
      templateId: data.templateId,
      // TODO: we need ai to convert job description to resume data
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 p-4">
        <BaseFormFields form={form} isPending={isPending} />
        <Card className="rounded-2xl border-2 border-purple-500 bg-purple-50 p-6 shadow-lg">
          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-lg bg-purple-500 p-2">
              <Briefcase className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-purple-700">
              Job Description
            </h2>
          </div>
          <FormField
            control={form.control}
            name="jobDescription"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-700">
                  Tell us about your dream role
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="I'm looking for a position that..."
                    className="mt-2 min-h-[120px] resize-none pl-4 outline-none ring-purple-500 focus:border-purple-500 focus-visible:ring-purple-500"
                    {...field}
                  />
                </FormControl>
                <div className="mt-2 flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    Provide details about your desired position
                  </p>
                  <span className="text-xs text-muted-foreground">
                    {field.value.length}/5000
                  </span>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </Card>
        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating...
            </>
          ) : (
            "Create Resume"
          )}
        </Button>
      </form>
    </Form>
  );
};

const LinkedInForm = ({
  form,
  mutation,
  isPending,
}: {
  form: UseFormReturn<LinkedInFormValues>;
  mutation: (data: CreateResumeInput) => void;
  isPending: boolean;
}) => {
  const onSubmit = (data: LinkedInFormValues) => {
    mutation({
      name: data.name,
      templateId: data.templateId,
      // TODO: we need ai to convert linkedin profile to resume data
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 p-4">
        <BaseFormFields form={form} isPending={isPending} />
        <Card className="rounded-2xl border-2 border-blue-500 bg-blue-50 p-6 shadow-lg">
          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-lg bg-blue-500 p-2">
              <Linkedin className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-blue-700">
              LinkedIn Profile
            </h2>
          </div>
          <FormField
            control={form.control}
            name="linkedinProfile"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-700">
                  Connect your professional identity
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="linkedin.com/in/username"
                    {...field}
                    className="h-12 border-2 pl-4 focus:border-blue-400 focus-visible:ring-blue-500"
                  />
                </FormControl>
                <p className="mt-2 text-sm text-muted-foreground">
                  Enter your LinkedIn profile URL or just the username
                </p>
                <FormMessage />
              </FormItem>
            )}
          />
        </Card>
        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating...
            </>
          ) : (
            "Create Resume"
          )}
        </Button>
      </form>
    </Form>
  );
};

const OldToNewForm = ({
  form,
  mutation,
  isPending,
}: {
  form: UseFormReturn<OldToNewFormValues>;
  mutation: (data: CreateResumeInput) => void;
  isPending: boolean;
}) => {
  const onSubmit = (data: OldToNewFormValues) => {
    mutation({
      name: data.name,
      templateId: data.templateId,
      // TODO: we need ai to convert pdf file to resume data
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 p-4">
        <BaseFormFields form={form} isPending={isPending} />
        <Card className="rounded-2xl border-2 border-green-500 bg-green-50 p-6 shadow-lg">
          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-lg bg-green-500 p-2">
              <Upload className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-green-700">
              Upload Resume
            </h2>
          </div>
          <FormField
            control={form.control}
            name="pdfFile"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-700">
                  Upload your existing resume
                </FormLabel>
                <FormControl>
                  <Input
                    type="file"
                    accept=".pdf"
                    onChange={(e) => field.onChange(e.target.files?.[0])}
                    className="h-12 border-2 pl-4 focus:border-green-400"
                  />
                </FormControl>
                <p className="mt-2 text-sm text-muted-foreground">
                  Upload your current resume in PDF format
                </p>
                <FormMessage />
              </FormItem>
            )}
          />
        </Card>
        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating...
            </>
          ) : (
            "Create Resume"
          )}
        </Button>
      </form>
    </Form>
  );
};

// Helper component for common fields
const BaseFormFields = ({
  form,
  isPending,
}: {
  form: any;
  isPending: boolean;
}) => (
  <>
    <FormField
      control={form.control}
      name="name"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Resume Name</FormLabel>
          <FormControl>
            <Input
              placeholder="Enter resume name"
              {...field}
              disabled={isPending}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
    <FormField
      control={form.control}
      name="templateId"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Template ID</FormLabel>
          <FormControl>
            <Input
              placeholder="Enter template ID"
              {...field}
              disabled={isPending}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  </>
);
