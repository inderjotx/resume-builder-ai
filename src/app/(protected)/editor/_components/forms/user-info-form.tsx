"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarInput } from "./common/calendar-input";
import { useEffect } from "react";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PhoneInput } from "@/components/ui/phone-input";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { useResumeStore } from "@/store/resume/data-store";
import { type ResumeData } from "@/server/db/schema";
import { HISTORY_CHANGE_EVENT } from "@/store/resume/history-store";

const formSchema = z.object({
  titleBefore: z.string().optional(),
  title: z.string().optional(),
  titleAfter: z.string().optional(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().email(),
  phoneNumber: z.string(),
  dateOfBirth: z.coerce.string(),
  nationality: z.string(),
  address: z.string(),
  city: z.string(),
  postalCode: z.string(),
  country: z.string(),
  website: z.string(),
  bio: z.string(),
});

export default function PersonalInfoForm() {
  const updatePersonalInfo = useResumeStore(
    (state) => state.updatePersonalInfo,
  );
  const personalInfo = useResumeStore((state) => state.personalInfo);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ...personalInfo,
    },
    mode: "onChange",
  });

  useEffect(() => {
    const subscription = form.watch((value) => {
      updatePersonalInfo(value as Partial<ResumeData["personalInfo"]>);
    });
    return () => subscription.unsubscribe();
  }, [form.watch, updatePersonalInfo, form]);

  // useEffect(() => {
  //   const handleHistoryChange = () => {
  //     form.reset(personalInfo);
  //   };

  //   window.addEventListener(HISTORY_CHANGE_EVENT, handleHistoryChange);

  //   return () => {
  //     window.removeEventListener(HISTORY_CHANGE_EVENT, handleHistoryChange);
  //   };
  // }, []);

  return (
    <Form {...form}>
      <form className="flex flex-col gap-4 rounded-md px-4">
        <div className="flex flex-col gap-4 rounded-md border bg-background px-5 py-5">
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-6">
              <FormField
                control={form.control}
                name="titleBefore"
                render={({ field }) => (
                  <FormItem className="space-y-0">
                    <FormControl>
                      <Input
                        placeholder="Title Before"
                        type="text"
                        className="bg-background"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="col-span-6">
              <FormField
                control={form.control}
                name="titleAfter"
                render={({ field }) => (
                  <FormItem className="space-y-0">
                    <FormControl>
                      <Input
                        placeholder="Title After"
                        type="text"
                        className="bg-background"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-6">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem className="space-y-0">
                    <FormLabel className="text-muted-foreground">
                      First Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder=""
                        type="text"
                        className="bg-background"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="col-span-6">
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem className="space-y-0">
                    <FormLabel className="text-muted-foreground">
                      Last Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder=""
                        type="text"
                        className="bg-background"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-6">
              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem className="space-y-0">
                    <FormLabel className="text-muted-foreground">
                      Phone number
                    </FormLabel>
                    <FormControl className="w-full">
                      <PhoneInput
                        placeholder=""
                        className="bg-background"
                        {...field}
                        defaultCountry="TR"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="col-span-6">
              <FormField
                control={form.control}
                name="nationality"
                render={({ field }) => (
                  <FormItem className="space-y-0">
                    <FormLabel className="text-muted-foreground">
                      Nationality
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder=""
                        type="text"
                        className="bg-background"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-6">
              <FormField
                control={form.control}
                name="dateOfBirth"
                render={({ field }) => (
                  <FormItem className="space-y-0">
                    <FormLabel className="text-muted-foreground">
                      Date of birth
                    </FormLabel>
                    <CalendarInput
                      value={field.value}
                      onChange={field.onChange}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="col-span-6">
              <FormField
                control={form.control}
                name="website"
                render={({ field }) => (
                  <FormItem className="space-y-0">
                    <FormLabel className="text-muted-foreground">
                      Website
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder=""
                        type=""
                        className="bg-background"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-6">
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem className="space-y-0">
                    <FormLabel className="text-muted-foreground">
                      Address
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder=""
                        type=""
                        className="bg-background"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="col-span-6">
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem className="space-y-0">
                    <FormLabel className="text-muted-foreground">
                      City
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder=""
                        type=""
                        className="bg-background"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-6">
              <FormField
                control={form.control}
                name="postalCode"
                render={({ field }) => (
                  <FormItem className="space-y-0">
                    <FormLabel className="text-muted-foreground">
                      Postal Code
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder=""
                        type=""
                        className="bg-background"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="col-span-6">
              <FormField
                control={form.control}
                name="country"
                render={({ field }) => (
                  <FormItem className="space-y-0">
                    <FormLabel className="text-muted-foreground">
                      Country
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder=""
                        type=""
                        className="bg-background"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <FormField
            control={form.control}
            name="bio"
            render={({ field }) => (
              <FormItem className="space-y-0">
                <FormLabel className="text-muted-foreground">Bio</FormLabel>
                <FormControl>
                  <RichTextEditor
                    content={field.value}
                    onValueChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </form>
    </Form>
  );
}
