"use client";
import { useForm, useFieldArray } from "react-hook-form";
import { useEffect } from "react";
import { useSettingsStore } from "@/store/resume/settings-store";
import { z } from "zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { useResumeStore } from "@/store/resume/data-store";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { ResumeData, SocialMediaPlatform } from "@/server/db/schema";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const socialMediaSchema = z.object({
  platform: z.nativeEnum(SocialMediaPlatform).optional(),
  url: z.string().url("Please enter a valid URL").optional(),
});

const formSchema = z.object({
  items: z.array(socialMediaSchema),
});

export default function SocialMediaForm() {
  const socialMedia = useResumeStore((store) => store.socialMedia);
  const updateSocialMedia = useResumeStore((store) => store.updateSocialMedia);
  const socialMediaVisible = useResumeStore(
    (store) => store.socialMediaVisible,
  );
  const updateSocialMediaVisibility = useResumeStore(
    (store) => store.updateSocialMediaVisibility,
  );
  const order = useSettingsStore((store) => store.order);
  const setOrder = useSettingsStore((store) => store.setOrder);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      items: socialMedia?.items ?? [],
    },
    mode: "onChange",
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    updateSocialMedia({ items: data.items });
  };

  useEffect(() => {
    if (socialMediaVisible && !order.includes("socialMedia")) {
      setOrder([...order, "socialMedia"]);
    } else if (!socialMediaVisible && order.includes("socialMedia")) {
      setOrder(order.filter((section) => section !== "socialMedia"));
    }
  }, [socialMediaVisible, setOrder, order]);

  useEffect(() => {
    if (fields.length === 0 && socialMediaVisible) {
      updateSocialMediaVisibility(false);
    } else if (fields.length > 0 && !socialMediaVisible) {
      updateSocialMediaVisibility(true);
    }
  }, [fields.length, socialMediaVisible, updateSocialMediaVisibility]);

  useEffect(() => {
    const subscription = form.watch((value) => {
      const data = {
        items: value.items,
      } as ResumeData["socialMedia"];

      updateSocialMedia(data);
    });
    return () => subscription.unsubscribe();
  }, [form.watch, updateSocialMedia, form]);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="mx-auto flex max-w-2xl flex-col gap-4"
      >
        {fields.map((field, index) => (
          <div key={field.id} className="relative rounded-lg border p-4">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-2 top-2"
              onClick={() => remove(index)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>

            <div className="flex flex-col gap-2">
              <FormField
                control={form.control}
                name={`items.${index}.platform`}
                render={({ field }) => (
                  <FormItem className="space-y-0">
                    <FormLabel className="text-muted-foreground">
                      Platform
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a platform" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.values(SocialMediaPlatform).map((platform) => (
                          <SelectItem key={platform} value={platform}>
                            {platform.charAt(0).toUpperCase() +
                              platform.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={`items.${index}.url`}
                render={({ field }) => (
                  <FormItem className="space-y-0">
                    <FormLabel className="text-muted-foreground">URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        ))}

        <Button
          type="button"
          variant="outline"
          className="mt-2"
          onClick={() => append({})}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Social Media
        </Button>
      </form>
    </Form>
  );
}
