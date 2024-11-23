"use client";
import { useForm, useFieldArray } from "react-hook-form";
import { useEffect } from "react";
import { z } from "zod";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
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
import { ResumeData } from "@/server/db/schema";
import { useSettingsStore } from "@/store/resume/settings-store";

const educationSchema = z.object({
  institutionName: z.string().optional(),
  degree: z.string().optional(),
  fieldOfStudy: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  isCurrentlyStudying: z.boolean().optional(),
  city: z.string().optional(),
  description: z.string().optional(),
});

const formSchema = z.object({
  items: z.array(educationSchema),
});

export default function EducationForm() {
  const education = useResumeStore((store) => store.education);
  const updateEducation = useResumeStore((store) => store.updateEducation);
  const visiblity = useResumeStore((store) => store.educationVisible);
  const setVisibility = useResumeStore(
    (store) => store.updateEducationVisibility,
  );
  const order = useSettingsStore((store) => store.order);
  const setOrder = useSettingsStore((store) => store.setOrder);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      items: education?.items ?? [{}],
    },
    mode: "onChange",
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });

  useEffect(() => {
    if (visiblity && !order.includes("education")) {
      setOrder([...order, "education"]);
    } else if (!visiblity && order.includes("education")) {
      setOrder(order.filter((section) => section !== "education"));
    }
  }, [visiblity, setOrder, order]);

  useEffect(() => {
    if (fields.length === 0 && visiblity) {
      setVisibility(false);
    } else if (fields.length > 0 && !visiblity) {
      setVisibility(true);
    }
  }, [fields.length, visiblity, setVisibility]);

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    updateEducation({ items: data.items });
  };

  useEffect(() => {
    const subscription = form.watch((value) => {
      const data = {
        items: value.items,
      } as ResumeData["education"];

      updateEducation(data);
    });
    return () => subscription.unsubscribe();
  }, [form.watch, updateEducation, form]);

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
                name={`items.${index}.institutionName`}
                render={({ field }) => (
                  <FormItem className="space-y-0">
                    <FormLabel className="text-muted-foreground">
                      Institution Name
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-2">
                <FormField
                  control={form.control}
                  name={`items.${index}.degree`}
                  render={({ field }) => (
                    <FormItem className="space-y-0">
                      <FormLabel className="text-muted-foreground">
                        Degree
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`items.${index}.fieldOfStudy`}
                  render={({ field }) => (
                    <FormItem className="space-y-0">
                      <FormLabel className="text-muted-foreground">
                        Field of Study
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div className="col-span-2 grid grid-cols-5 gap-2">
                <FormField
                  control={form.control}
                  name={`items.${index}.startDate`}
                  render={({ field }) => (
                    <FormItem className="col-span-2 space-y-0">
                      <FormLabel className="text-muted-foreground">
                        Start Date
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`items.${index}.endDate`}
                  render={({ field }) => (
                    <FormItem className="col-span-2 space-y-0">
                      <FormLabel className="text-muted-foreground">
                        End Date
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="col-span-1 flex items-center justify-center">
                <FormField
                  control={form.control}
                  name={`items.${index}.isCurrentlyStudying`}
                  render={({ field }) => (
                    <FormItem className="mt-4 flex items-center gap-2 space-y-0">
                      <FormLabel className="text-muted-foreground">
                        Currently Studying
                      </FormLabel>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <FormField
              control={form.control}
              name={`items.${index}.city`}
              render={({ field }) => (
                <FormItem className="space-y-0">
                  <FormLabel className="text-muted-foreground">City</FormLabel>
                  <FormControl>
                    <Input placeholder="" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name={`items.${index}.description`}
              render={({ field }) => (
                <FormItem className="space-y-0">
                  <FormLabel className="text-muted-foreground">
                    Description
                  </FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        ))}

        <Button
          type="button"
          variant="outline"
          className="mt-2"
          onClick={() => append({})}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Education
        </Button>
      </form>
    </Form>
  );
}
