"use client";
import { useForm, useFieldArray } from "react-hook-form";
import { useEffect, useState } from "react";
import { z } from "zod";
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
import { Plus } from "lucide-react";
import { type ResumeData } from "@/server/db/schema";
import { Accordion, AccordionContent } from "@/components/ui/accordion";
import {
  DndContext,
  MeasuringStrategy,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import { type DragEndEvent } from "@dnd-kit/core";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { CalendarInput } from "./common/calendar-input";

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
import { SortableAccordionItem } from "./common/accordion-item";

const formSchema = z.object({
  title: z.string().optional(),
  items: z.array(educationSchema),
});

export default function EducationForm() {
  const education = useResumeStore((store) => store.education);
  const updateEducation = useResumeStore((store) => store.updateEducation);
  const [activeAccordion, setActiveAccordion] = useState<string | null>(null);
  const [isUpdatingFromStore, setIsUpdatingFromStore] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: education?.title ?? "",
      items: education?.items ?? [],
    },
    mode: "onChange",
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    updateEducation({ items: data.items });
  };

  useEffect(() => {
    const subscription = form.watch((value) => {
      if (!isUpdatingFromStore) {
        const data = {
          items: value.items,
        } as ResumeData["education"];
        updateEducation(data);
      }
    });
    return () => subscription.unsubscribe();
  }, [form.watch, updateEducation, isUpdatingFromStore, form]);

  useEffect(() => {
    if (education) {
      setIsUpdatingFromStore(true);
      form.reset({
        title: education.title ?? "",
        items: education.items ?? [],
      });
      setTimeout(() => setIsUpdatingFromStore(false), 0);
    }
  }, [education, form]);

  const handleCreateAccordion = () => {
    append({});
    const newId = fields.length;
    setActiveAccordion(`item-${newId}-education`);
  };

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

      const values = form.getValues("items");
      form.setValue("items", arrayMove(values, oldIndex, newIndex));

      if (activeAccordion === `item-${oldIndex}-education`) {
        setActiveAccordion(`item-${newIndex}-education`);
      } else if (activeAccordion === `item-${newIndex}-education`) {
        setActiveAccordion(`item-${oldIndex}-education`);
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
                    formLabel="Education"
                    value={`item-${index}-education`}
                    className="rounded-lg border bg-background"
                    onRemove={remove}
                    index={index}
                    isActive={activeAccordion === `item-${index}-education`}
                  >
                    <AccordionContent className="relative flex flex-col gap-2 rounded-lg p-4">
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

                      <div className="grid grid-cols-7 gap-2">
                        <div className="col-span-5 grid grid-cols-4 gap-2">
                          <FormField
                            control={form.control}
                            name={`items.${index}.startDate`}
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
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <div className="col-span-2 flex items-center justify-center">
                          <FormField
                            control={form.control}
                            name={`items.${index}.isCurrentlyStudying`}
                            render={({ field }) => (
                              <FormItem className="mt-4 flex items-center gap-2 space-y-0">
                                <FormLabel className="text-muted-foreground">
                                  Is Current
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
                            <FormLabel className="text-muted-foreground">
                              City
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
                        name={`items.${index}.description`}
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
                Add Education
              </Button>
            </Accordion>
          </DndContext>
        </div>
      </form>
    </Form>
  );
}
