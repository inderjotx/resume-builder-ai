"use client";

import { signInWithEmail } from "@/actions/auth-server";
import { toast } from "sonner";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const formSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type FormValues = z.infer<typeof formSchema>;

export function SignInForm() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userEmail, setUserEmail] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: FormValues) => {
    try {
      setIsLoading(true);
      await signInWithEmail(data.email);
      setUserEmail(data.email);
      setIsOpen(true);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Something went wrong";

      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const openEmailClient = () => {
    // Common email providers and their web interfaces
    const emailProviders: Record<string, string> = {
      "gmail.com": "https://mail.google.com",
      "yahoo.com": "https://mail.yahoo.com",
      "outlook.com": "https://outlook.live.com",
      "hotmail.com": "https://outlook.live.com",
    };

    const domain = userEmail.split("@")[1];
    const emailUrl =
      emailProviders?.[domain as unknown as keyof typeof emailProviders] ??
      `mailto:${userEmail}`;
    setIsOpen(false);
    window.open(emailUrl, "_blank");
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
        <Label className="mb-1.5 block text-sm font-medium">Email</Label>
        <Input
          {...register("email")}
          type="email"
          placeholder="name@company.com"
          className="h-12"
        />
        {errors.email && (
          <span className="text-sm text-red-500">{errors.email.message}</span>
        )}

        <Button
          type="submit"
          disabled={isLoading}
          className="h-10 w-full rounded-full bg-black hover:bg-gray-800"
        >
          {isLoading ? "Sending..." : "Continue"}
        </Button>
      </form>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-2xl">
              Verification Email Sent
            </DialogTitle>
            <DialogDescription className="text-base">
              We&apos;ve sent a verification link to {userEmail}. Please check
              your email and click the link to verify your account.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Close
            </Button>
            <Button onClick={openEmailClient}>Open Email</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
