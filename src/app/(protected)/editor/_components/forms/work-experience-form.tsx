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
  FormDescription,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { useResumeStore } from "@/store/resume/data-store";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { ResumeData } from "@/server/db/schema";

const workExperienceSchema = z.object({
  companyName: z.string().optional(),
  position: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  isCurrent: z.boolean().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
  description: z.string().optional(),
});

const formSchema = z.object({
  experiences: z.array(workExperienceSchema),
});

export default function WorkExperienceForm() {
  const { workExperience, updateWorkExperience } = useResumeStore();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      experiences: workExperience?.items ?? [{}],
    },
    mode: "onChange",
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "experiences",
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    updateWorkExperience({ items: data.experiences });
  };

  useEffect(() => {
    const subscription = form.watch((value) => {
      const data = {
        items: value.experiences,
      } as ResumeData["workExperience"];
      updateWorkExperience(data);
    });
    return () => subscription.unsubscribe();
  }, [form.watch, updateWorkExperience, form]);

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
                name={`experiences.${index}.companyName`}
                render={({ field }) => (
                  <FormItem className="space-y-0">
                    <FormLabel className="text-muted-foreground">
                      Company Name
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
                name={`experiences.${index}.position`}
                render={(field) => (
                  <FormItem className="space-y-0">
                    <FormLabel className="text-muted-foreground">
                      Position
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="" {...field} />
                    </FormControl>
                    <FormDescription />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div className="col-span-2 grid grid-cols-5 gap-2">
                <FormField
                  control={form.control}
                  name={`experiences.${index}.startDate`}
                  render={(field) => (
                    <FormItem className="col-span-2 space-y-0">
                      <FormLabel className="text-muted-foreground">
                        Start Date
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="" {...field} />
                      </FormControl>
                      <FormDescription />
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`experiences.${index}.endDate`}
                  render={(field) => (
                    <FormItem className="col-span-2 space-y-0">
                      <FormLabel className="text-muted-foreground">
                        End Date
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="" {...field} />
                      </FormControl>
                      <FormDescription />
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="col-span-1 flex items-center justify-center">
                <FormField
                  control={form.control}
                  name={`experiences.${index}.isCurrent`}
                  render={(field) => (
                    <FormItem className="mt-4 flex items-center gap-2 space-y-0">
                      <FormLabel
                        htmlFor="isCurrent"
                        className="text-muted-foreground"
                      >
                        Current Position
                      </FormLabel>
                      <Checkbox
                        id="isCurrent"
                        checked={field?.field?.value}
                        onCheckedChange={field?.field?.onChange}
                      />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <FormField
                control={form.control}
                name={`experiences.${index}.city`}
                render={(field) => (
                  <FormItem className="space-y-0">
                    <FormLabel className="text-muted-foreground">
                      City
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="" {...field} />
                    </FormControl>
                    <FormDescription />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`experiences.${index}.country`}
                render={(field) => (
                  <FormItem className="space-y-0">
                    <FormLabel className="text-muted-foreground">
                      Country
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="" {...field} />
                    </FormControl>
                    <FormDescription />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name={`experiences.${index}.description`}
              render={(field) => (
                <FormItem className="space-y-0">
                  <FormLabel className="text-muted-foreground">
                    Description
                  </FormLabel>
                  <FormControl>
                    <Textarea {...field?.field} />
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
          Add Work Experience
        </Button>
      </form>
    </Form>
  );
}
