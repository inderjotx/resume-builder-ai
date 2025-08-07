"use client";
import { useForm, useFieldArray } from "react-hook-form";
import { useEffect, useState } from "react";
import { z } from "zod";
import { SortableAccordionItem } from "./common/accordion-item";
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
import { CalendarInput } from "./common/calendar-input";
import { Accordion, AccordionContent } from "@/components/ui/accordion";
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

const voluntarySchema = z.object({
  organizationName: z.string().optional(),
  role: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  isCurrent: z.boolean().optional(),
  description: z.string().optional(),
});

const formSchema = z.object({
  title: z.string().optional(),
  items: z.array(voluntarySchema),
});

export default function VoluntaryForm() {
  const [activeAccordion, setActiveAccordion] = useState<string | null>(null);
  const voluntaryWork = useResumeStore((store) => store.voluntaryWork);
  const updateVoluntaryWork = useResumeStore(
    (store) => store.updateVoluntaryWork,
  );
  const [isUpdatingFromStore, setIsUpdatingFromStore] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: voluntaryWork?.title ?? "",
      items: voluntaryWork?.items ?? [{}],
    },
    mode: "onChange",
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    updateVoluntaryWork({ title: data.title, items: data.items });
  };

  // useEffect(() => {
  //   const subscription = form.watch((value) => {
  //     if (!isUpdatingFromStore) {
  //       const data = {
  //         title: value.title,
  //         items: value.items,
  //       } as ResumeData["voluntaryWork"];
  //       updateVoluntaryWork(data);
  //     }
  //   });
  //   return () => subscription.unsubscribe();
  // }, [form.watch, updateVoluntaryWork, isUpdatingFromStore, form]);

  useEffect(() => {
    if (voluntaryWork) {
      setIsUpdatingFromStore(true);
      form.reset({
        title: voluntaryWork.title ?? "",
        items: voluntaryWork.items ?? [],
      });
      setTimeout(() => setIsUpdatingFromStore(false), 0);
    }
  }, [voluntaryWork, form]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleCreateVoluntaryForm = () => {
    append({});
    setActiveAccordion(`item-${fields.length}-voluntary`);
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

      if (activeAccordion === `item-${oldIndex}-voluntary`) {
        setActiveAccordion(`item-${newIndex}-voluntary`);
      } else if (activeAccordion === `item-${newIndex}-voluntary`) {
        setActiveAccordion(`item-${oldIndex}-voluntary`);
      }
    }
  };

  return (
    <Form {...form}>
      <form className="flex flex-col gap-4 rounded-md">
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
                    formLabel="Voluntary Work"
                    value={`item-${index}-voluntary`}
                    className="rounded-lg border bg-background"
                    onRemove={remove}
                    index={index}
                    isActive={activeAccordion === `item-${index}-voluntary`}
                  >
                    <AccordionContent className="relative flex flex-col gap-4 rounded-lg p-4">
                      <FormField
                        control={form.control}
                        name={`items.${index}.organizationName`}
                        render={({ field }) => (
                          <FormItem className="space-y-0">
                            <FormLabel className="text-muted-foreground">
                              Organization Name
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
                        name={`items.${index}.role`}
                        render={({ field }) => (
                          <FormItem className="space-y-0">
                            <FormLabel className="text-muted-foreground">
                              Role
                            </FormLabel>
                            <FormControl>
                              <Input placeholder="" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid grid-cols-7 gap-2">
                        <div className="col-span-5 grid grid-cols-2 gap-2">
                          <FormField
                            control={form.control}
                            name={`items.${index}.startDate`}
                            render={({ field }) => (
                              <FormItem className="space-y-0">
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
                              <FormItem className="space-y-0">
                                <FormLabel className="text-muted-foreground">
                                  End Date
                                </FormLabel>
                                <FormControl>
                                  <CalendarInput
                                    value={field.value}
                                    onChange={field.onChange}
                                    disabled={form.watch(
                                      `items.${index}.isCurrent`,
                                    )}
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

                        <div
                          className="col-span-2 flex"
                          items-center
                          justify-center
                        >
                          <FormField
                            control={form.control}
                            name={`items.${index}.isCurrent`}
                            render={({ field }) => (
                              <FormItem className="mt-4 flex items-center gap-2 space-y-0">
                                <FormLabel className="text-muted-foreground">
                                  Current Role
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
                onClick={handleCreateVoluntaryForm}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Voluntary Work
              </Button>
            </Accordion>
          </DndContext>
        </div>
      </form>
    </Form>
  );
}
