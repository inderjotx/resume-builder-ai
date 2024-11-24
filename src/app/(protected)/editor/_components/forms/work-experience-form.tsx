"use client";
import { useForm, useFieldArray } from "react-hook-form";
import { toast } from "sonner";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import { BriefcaseBusiness, CalendarIcon } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { z } from "zod";
import { Calendar } from "@/components/ui/calendar";
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
import { cn } from "@/lib/utils";

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
  const [activeAccordion, setActiveAccordion] = useState<string | null>(null);

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

  const handleCreateAccordion = () => {
    append({});
    const index = fields.length;
    setActiveAccordion(`item-${index}-work-experience`);
  };

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
        className="mx-auto flex max-w-2xl flex-col gap-4 rounded-md border p-4"
      >
        <div className="flex items-center gap-2">
          <BriefcaseBusiness className="size-6" />
          <h2 className="text-lg font-semibold">{workExperience?.title}</h2>
        </div>

        <Accordion
          type="single"
          value={activeAccordion ?? undefined}
          onValueChange={(value) => setActiveAccordion(value)}
          collapsible
          className="flex w-full flex-col gap-4"
        >
          {fields.map((field, index) => (
            <AccordionItem
              key={`item-${index}-work-experience`}
              value={`item-${index}-work-experience`}
              className="rounded-lg border bg-muted/40 p-1"
            >
              <AccordionTrigger className="flex items-center rounded-md px-2 py-1 text-sm hover:no-underline">
                <span>Work Experience #{index + 1}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="ml-auto mr-2 size-8"
                  onClick={() => remove(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </AccordionTrigger>
              <AccordionContent className="relative flex flex-col gap-2 rounded-lg p-4">
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
                          <Input
                            placeholder=""
                            {...field}
                            className="bg-background"
                          />
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
                          <Input
                            placeholder=""
                            {...field}
                            className="bg-background"
                          />
                        </FormControl>
                        <FormDescription />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-5 gap-2">
                  <div className="col-span-4 grid grid-cols-4 gap-2">
                    <FormField
                      control={form.control}
                      name={`experiences.${index}.startDate`}
                      render={({ field }) => (
                        <FormItem className="col-span-2 space-y-0">
                          <FormLabel className="text-muted-foreground">
                            Start Date
                          </FormLabel>
                          <FormControl>
                            <CalendarInput
                              value={field.value}
                              onChange={field.onChange}
                              calendarProps={{
                                fromYear: 1960,
                                toYear: new Date().getFullYear(),
                                toDate: new Date(),
                              }}
                            />
                          </FormControl>
                          <FormDescription />
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`experiences.${index}.endDate`}
                      render={({ field }) => (
                        <FormItem className="col-span-2 space-y-0">
                          <FormLabel className="text-muted-foreground">
                            End Date
                          </FormLabel>
                          <FormControl>
                            <CalendarInput
                              value={field.value}
                              onChange={field.onChange}
                              disabled={form.getValues(
                                `experiences.${index}.isCurrent`,
                              )}
                              calendarProps={{
                                fromYear:
                                  new Date(
                                    form.getValues(
                                      `experiences.${index}.startDate`,
                                    ) ?? "",
                                  ).getFullYear() || 1960,
                                toYear: new Date().getFullYear(),
                                fromDate: new Date(
                                  form.getValues(
                                    `experiences.${index}.startDate`,
                                  ) ?? "",
                                ),
                                toDate: new Date(),
                              }}
                            />
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
                      render={({ field }) => (
                        <FormItem className="mt-6 flex items-center gap-2 space-y-0">
                          <FormLabel
                            htmlFor="isCurrent"
                            className="text-muted-foreground"
                          >
                            Is Current
                          </FormLabel>
                          <Checkbox
                            id="isCurrent"
                            className="bg-background"
                            checked={field.value}
                            onCheckedChange={field.onChange}
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
                          <Input
                            placeholder=""
                            {...field}
                            className="bg-background"
                          />
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
                          <Input
                            placeholder=""
                            {...field}
                            className="bg-background"
                          />
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
                        <Textarea {...field?.field} className="bg-background" />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </AccordionContent>
            </AccordionItem>
          ))}

          <Button
            type="button"
            variant="outline"
            className="mt-2"
            onClick={handleCreateAccordion}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Work Experience
          </Button>
        </Accordion>
      </form>
    </Form>
  );
}

const CalendarInput = ({
  value,
  onChange,
  calendarProps,
  disabled,
}: {
  value: string | undefined;
  calendarProps?: React.ComponentProps<typeof Calendar>;
  onChange: (value: string) => void;
  disabled?: boolean;
}) => {
  // Create disabled dates array
  const disabledDates = [
    {
      from: calendarProps?.fromDate ? new Date(0) : undefined, // Start of time
      to: calendarProps?.fromDate
        ? new Date(calendarProps.fromDate)
        : undefined,
    },
    {
      from: calendarProps?.toDate ? new Date(calendarProps.toDate) : undefined,
      to: new Date(2100, 0, 1), // Far future date
    },
  ].filter((range) => range.from && range.to) as { from: Date; to: Date }[];

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full justify-start bg-background text-left font-normal",
            !value && "text-muted-foreground",
            disabled && "cursor-not-allowed opacity-50",
          )}
          disabled={disabled}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {value ? format(new Date(value), "PPP") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      {!disabled && (
        <PopoverContent align="start" className="w-auto p-0">
          <Calendar
            mode="single"
            captionLayout="dropdown-buttons"
            selected={value ? new Date(value) : undefined}
            onSelect={(date) =>
              date ? onChange(date?.toISOString()) : undefined
            }
            disabled={disabledDates}
            fromYear={calendarProps?.fromYear}
            toYear={calendarProps?.toYear}
          />
        </PopoverContent>
      )}
    </Popover>
  );
};
