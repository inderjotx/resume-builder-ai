"use client";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { Accordion, AccordionContent } from "@/components/ui/accordion";
import { SortableAccordionItem } from "./common/accordion-item";
import { CalendarInput } from "./common/calendar-input";
import { useEffect, useState } from "react";
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
import { Plus } from "lucide-react";
import { type ResumeData } from "@/server/db/schema";
import {
  DndContext,
  MeasuringStrategy,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import { RichTextEditor } from "@/components/ui/rich-text-editor";

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
  title: z.string().optional(),
  experiences: z.array(workExperienceSchema),
});

export default function WorkExperienceForm() {
  const workExperience = useResumeStore((store) => store.workExperience);
  const updateWorkExperience = useResumeStore(
    (store) => store.updateWorkExperience,
  );
  const [isUpdatingFromStore, setIsUpdatingFromStore] = useState(false);

  const [activeAccordion, setActiveAccordion] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: workExperience?.title ?? "",
      experiences: workExperience?.items ?? [],
    },
    mode: "onChange",
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "experiences",
  });

  const handleCreateAccordion = () => {
    append({});
    setTimeout(() => {
      const newId = form.getValues("experiences").length - 1;
      setActiveAccordion(`item-${newId}-work-experience`);
    }, 0);
  };

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    updateWorkExperience({ items: data.experiences });
  };

  useEffect(() => {
    const subscription = form.watch((value) => {
      if (!isUpdatingFromStore) {
        const data = {
          items: value.experiences,
          title: value.title ?? "",
        } as ResumeData["workExperience"];
        updateWorkExperience(data);
      }
    });
    return () => subscription.unsubscribe();
  }, [form.watch, updateWorkExperience, isUpdatingFromStore, form]);

  useEffect(() => {
    if (workExperience) {
      setIsUpdatingFromStore(true);
      form.reset({
        title: workExperience.title ?? "",
        experiences: workExperience.items ?? [],
      });
      setTimeout(() => setIsUpdatingFromStore(false), 0);
    }
  }, [workExperience, form]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = fields.findIndex((field) => field.id === active.id);
      const newIndex = fields.findIndex((field) => field.id === over.id);

      const value = form.getValues("experiences");
      const buffer = value[oldIndex];
      const newValue = [...value];

      // @ts-ignore
      newValue[oldIndex] = value[newIndex];
      // @ts-ignore
      newValue[newIndex] = buffer;
      form.setValue("experiences", newValue);

      if (activeAccordion === `item-${oldIndex}-work-experience`) {
        setActiveAccordion(`item-${newIndex}-work-experience`);
      } else if (activeAccordion === `item-${newIndex}-work-experience`) {
        setActiveAccordion(`item-${oldIndex}-work-experience`);
      }
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-4 rounded-md"
      >
        <div className="flex flex-col gap-4 rounded-lg py-5">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
            modifiers={[restrictToVerticalAxis]}
            measuring={{
              droppable: {
                strategy: MeasuringStrategy.Always,
              },
            }}
          >
            <Accordion
              type="single"
              value={activeAccordion ?? undefined}
              onValueChange={(value) => setActiveAccordion(value)}
              collapsible
              className="flex w-full flex-col gap-4"
            >
              <SortableContext
                items={fields.map((field) => field.id)}
                strategy={verticalListSortingStrategy}
              >
                {fields.map((field, index) => (
                  <SortableAccordionItem
                    key={field.id}
                    id={field.id}
                    formLabel="Work Experience"
                    value={`item-${index}-work-experience`}
                    className="rounded-lg border bg-background"
                    onRemove={remove}
                    index={index}
                    isActive={
                      activeAccordion === `item-${index}-work-experience`
                    }
                  >
                    <AccordionContent className="relative flex flex-col gap-4 rounded-lg p-4">
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
                          render={({ field }) => (
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

                      <div className="grid grid-cols-8 gap-2">
                        <div className="col-span-6 grid grid-cols-4 gap-2">
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
                                          )!,
                                        ).getFullYear() || 1960,
                                      toYear: new Date().getFullYear(),
                                      fromDate: new Date(
                                        form.getValues(
                                          `experiences.${index}.startDate`,
                                        )!,
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

                        <div className="col-span-2 flex items-center justify-center">
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
                          render={({ field }) => (
                            <FormItem className="space-y-0">
                              <FormLabel className="text-muted-foreground">
                                City
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder=""
                                  className="bg-background"
                                  {...field}
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
                          render={({ field }) => (
                            <FormItem className="space-y-0">
                              <FormLabel className="text-muted-foreground">
                                Country
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder=""
                                  className="bg-background"
                                  {...field}
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
                        render={({ field }) => (
                          <FormItem className="space-y-0">
                            <FormLabel className="text-muted-foreground">
                              Description
                            </FormLabel>
                            <FormControl>
                              <RichTextEditor
                                content={field.value ?? ""}
                                onValueChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </AccordionContent>
                  </SortableAccordionItem>
                ))}
              </SortableContext>

              <Button
                type="button"
                variant="dashed"
                className="mt-2"
                onClick={handleCreateAccordion}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Work Experience
              </Button>
            </Accordion>
          </DndContext>
        </div>
      </form>
    </Form>
  );
}
