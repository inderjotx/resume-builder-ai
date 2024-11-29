"use client";
import { useForm } from "react-hook-form";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import { CalendarInput } from "./common/calendar-input";
import { useEffect, useState } from "react";
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
import { useUploadThing } from "@/lib/uploadthing";
import { toast } from "sonner";
import { ResponsiveModalDrawer } from "@/components/ui/responsive-modal";
import { ImageEditor } from "@/app/(protected)/editor/_components/image-editor";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";

const formSchema = z.object({
  title: z.string().optional(),
  firstName: z.string(),
  imageUrl: z.string().optional(),
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

const MAX_IMAGE_SIZE = 1024 * 1024 * 2; // 2MB
export default function PersonalInfoForm() {
  const { startUpload } = useUploadThing("imageUploader");
  const session = useSession();

  const updatePersonalInfo = useResumeStore(
    (state) => state.updatePersonalInfo,
  );
  const personalInfo = useResumeStore((state) => state.personalInfo);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ...personalInfo,
      imageUrl: personalInfo?.imageUrl ?? session.data?.user?.image ?? "",
    },
    mode: "onChange",
  });

  useEffect(() => {
    if (session.data?.user?.image) {
      form.setValue("imageUrl", session.data.user.image);
    }
  }, [session.data?.user?.image, form]);

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

  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const size = file?.size;
    if (size && size > MAX_IMAGE_SIZE) {
      toast.error("Image size is too large");
    }
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl);
    }
  };

  const handleImageSave = async (croppedImage: Blob) => {
    try {
      const userId = session.data?.user?.id;
      const res = await startUpload([
        new File([croppedImage], `profile-${userId}.png`),
      ]);
      if (res) {
        form.setValue("imageUrl", (res[0] as any)?.fileUrl);
        setSelectedImage(null);
      }
    } catch (error) {
      toast.error("Failed to upload image");
      console.error(error);
    }
  };

  return (
    <Form {...form}>
      <form className="flex flex-col gap-4 rounded-md">
        <div className="flex flex-col gap-4 rounded-md border bg-background px-5 py-5">
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-5 flex items-center justify-center">
              <ResponsiveModalDrawer
                title="Edit Profile Picture"
                trigger={
                  <div className="group relative size-32 cursor-pointer overflow-hidden rounded-full border p-2 ring-2 ring-gray-100 ring-offset-4">
                    <Image
                      src={form.watch("imageUrl") ?? "/default-avatar.png"}
                      alt="user-image"
                      fill
                      className="rounded-full object-cover"
                    />
                    <div className="absolute inset-x-0 bottom-0 hidden h-6 items-center justify-center border bg-muted/80 transition-all group-hover:flex">
                      Edit
                    </div>
                  </div>
                }
              >
                {selectedImage ? (
                  <div className="flex flex-col gap-4">
                    <ImageEditor
                      imageUrl={selectedImage}
                      onSave={handleImageSave}
                    />
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-4 p-4">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleFileSelect}
                      className="hidden"
                      id="image-upload"
                    />
                    <Label
                      htmlFor="image-upload"
                      className="flex size-40 cursor-pointer items-center justify-center rounded-full border-2 border-dashed bg-muted hover:bg-muted/80"
                    >
                      <Upload className="size-8" />
                    </Label>
                  </div>
                )}
              </ResponsiveModalDrawer>
            </div>
            <div className="col-span-7 flex flex-col gap-4">
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

          <div>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="space-y-0">
                  <FormLabel className="text-muted-foreground">Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder=""
                      type="email"
                      className="bg-background"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
