"use client";
import { useForm, useFieldArray } from "react-hook-form";
import { useEffect, useState } from "react";
import { SortableAccordionItem } from "./common/accordion-item";
import { CalendarInput } from "./common/calendar-input";
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
import { Plus } from "lucide-react";
import { type ResumeData } from "@/server/db/schema";
import { Checkbox } from "@/components/ui/checkbox";
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
import { Accordion, AccordionContent } from "@/components/ui/accordion";
import { RichTextEditor } from "@/components/ui/rich-text-editor";

const projectSchema = z.object({
  projectName: z.string().optional(),
  description: z.string().optional(),
  projectLink: z.string().url().optional().or(z.literal("")),
  city: z.string().optional(),
  country: z.string().optional(),
  startDate: z.coerce.string().optional(),
  endDate: z.coerce.string().optional(),
  isCurrent: z.boolean().optional(),
});

const formSchema = z.object({
  title: z.string().optional(),
  items: z.array(projectSchema),
});

export default function ProjectsForm() {
  const projects = useResumeStore((store) => store.projects);
  const updateProjects = useResumeStore((store) => store.updateProjects);
  const [activeAccordion, setActiveAccordion] = useState<string | null>(null);
  const [isUpdatingFromStore, setIsUpdatingFromStore] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: projects?.title ?? "Projects",
      items: projects?.items ?? [],
    },
    mode: "onChange",
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    updateProjects({ title: data.title, items: data.items });
  };

  // useEffect(() => {
  //   const subscription = form.watch((value) => {
  //     if (!isUpdatingFromStore) {
  //       const data = {
  //         title: value.title,
  //         items: value.items,
  //       } as ResumeData["projects"];
  //       updateProjects(data);
  //     }
  //   });
  //   return () => subscription.unsubscribe();
  // }, [form.watch, updateProjects, isUpdatingFromStore, form]);

  useEffect(() => {
    if (projects) {
      setIsUpdatingFromStore(true);
      form.reset({
        title: projects.title ?? "Projects",
        items: projects.items ?? [],
      });
      setTimeout(() => setIsUpdatingFromStore(false), 0);
    }
  }, [projects, form]);

  const handleCreateAccordion = () => {
    append({});
    setActiveAccordion(`item-${fields.length}-project`);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = fields.findIndex((field) => field.id === active.id);
      const newIndex = fields.findIndex((field) => field.id === over.id);

      const value = form.getValues("items");
      const buffer = value[oldIndex];
      const newValue = [...value];

      // @ts-ignore
      newValue[oldIndex] = value[newIndex];
      // @ts-ignore
      newValue[newIndex] = buffer;
      form.setValue("items", newValue);

      if (activeAccordion === `item-${oldIndex}-project`) {
        setActiveAccordion(`item-${newIndex}-project`);
      } else if (activeAccordion === `item-${newIndex}-project`) {
        setActiveAccordion(`item-${oldIndex}-project`);
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
                    formLabel="Project"
                    value={`item-${index}-project`}
                    className="rounded-lg border bg-background"
                    onRemove={remove}
                    index={index}
                    isActive={activeAccordion === `item-${index}-project`}
                  >
                    <AccordionContent className="relative flex flex-col gap-4 rounded-lg p-4">
                      <FormField
                        control={form.control}
                        name={`items.${index}.projectName`}
                        render={({ field }) => (
                          <FormItem className="space-y-0">
                            <FormLabel className="text-muted-foreground">
                              Project Name
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Project Name"
                                {...field}
                                className="bg-background"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name={`items.${index}.city`}
                          render={({ field }) => (
                            <FormItem className="space-y-0">
                              <FormLabel className="text-muted-foreground">
                                City
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="City"
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
                          name={`items.${index}.country`}
                          render={({ field }) => (
                            <FormItem className="space-y-0">
                              <FormLabel className="text-muted-foreground">
                                Country
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Country"
                                  {...field}
                                  className="bg-background"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="grid grid-cols-5 gap-4">
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
                                    fromDate: new Date(0),
                                    toDate: new Date(2100, 0, 1),
                                    fromYear: 1960,
                                    toYear: 2030,
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
                                    fromDate: new Date(0),
                                    toDate: new Date(2100, 0, 1),
                                    fromYear: 1960,
                                    toYear: 2030,
                                  }}
                                  disabled={form.watch(
                                    `items.${index}.isCurrent`,
                                  )}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name={`items.${index}.isCurrent`}
                          render={({ field }) => (
                            <FormItem className="col-span-1 flex flex-col justify-end space-y-0 pb-2">
                              <FormControl>
                                <div className="flex items-center space-x-2">
                                  <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                  />
                                  <FormLabel className="text-sm font-normal">
                                    Current
                                  </FormLabel>
                                </div>
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name={`items.${index}.projectLink`}
                        render={({ field }) => (
                          <FormItem className="space-y-0">
                            <FormLabel className="text-muted-foreground">
                              Project Link
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="url"
                                placeholder="https://example.com"
                                {...field}
                              />
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
                            <FormMessage />
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
                Add Project
              </Button>
            </Accordion>
          </DndContext>
        </div>
      </form>
    </Form>
  );
}
