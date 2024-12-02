"use client";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Briefcase } from "lucide-react";

export function JobDescriptionCard({
  form,
  isLoading,
}: {
  form: any;
  isLoading: boolean;
}) {
  return (
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
                className="mt-2 h-12 min-h-[180px] resize-none border-2 pl-4 outline-none ring-purple-500 focus:border-purple-500 focus:ring-purple-500 focus-visible:ring-purple-500 active:ring-purple-500"
                {...field}
                disabled={isLoading}
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
  );
}
