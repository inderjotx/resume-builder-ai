"use client";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Linkedin } from "lucide-react";

export function LinkedInCard({
  form,
  isLoading,
}: {
  form: any;
  isLoading: boolean;
}) {
  return (
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
              <div className="relative">
                <Input
                  placeholder="linkedin.com/in/username"
                  {...field}
                  disabled={isLoading}
                  className="h-12 border-2 pl-4 focus:border-blue-400 focus:ring-blue-400 focus-visible:ring-blue-400"
                />
              </div>
            </FormControl>
            <p className="mt-2 text-sm text-muted-foreground">
              Enter your LinkedIn profile URL or just the username
            </p>
            <FormMessage />
          </FormItem>
        )}
      />
    </Card>
  );
}
