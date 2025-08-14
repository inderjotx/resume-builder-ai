"use client";
import { useForm, useFieldArray } from "react-hook-form";
import { useEffect, useState } from "react";
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

const awardSchema = z.object({
  title: z.string().optional(),
  date: z.coerce.string().optional(),
  url: z.string().url().optional().or(z.literal("")),
  issuer: z.string().optional(),
  description: z.string().optional(),
});

const formSchema = z.object({
  title: z.string().optional(),
  items: z.array(awardSchema),
});
import { SortableAccordionItem } from "./common/accordion-item";
import { CalendarInput } from "./common/calendar-input";
export default function AwardsForm() {
  const awards = useResumeStore((store) => store.awards);
  const updateAwards = useResumeStore((store) => store.updateAwards);
  const [activeAccordion, setActiveAccordion] = useState<string | null>(null);
  const [isUpdatingFromStore, setIsUpdatingFromStore] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: awards?.title ?? "",
      items: awards?.items ?? [],
    },
    mode: "onChange",
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    updateAwards({ title: data.title, items: data.items });
  };

  useEffect(() => {
    const subscription = form.watch((value) => {
      if (!isUpdatingFromStore) {
        const data = {
          title: value.title,
          items: value.items,
        } as ResumeData["awards"];
        updateAwards(data);
      }
    });
    return () => subscription.unsubscribe();
  }, [form, updateAwards, isUpdatingFromStore]);

  useEffect(() => {
    if (awards) {
      setIsUpdatingFromStore(true);
      form.reset({
        title: awards.title ?? "",
        items: awards.items ?? [],
      });
      setTimeout(() => setIsUpdatingFromStore(false), 0);
    }
  }, [awards, form]);

  const handleCreateAccordion = () => {
    append({});
    setTimeout(() => {
      const newId = form.getValues("items").length - 1;
      setActiveAccordion(`item-${newId}-award`);
    }, 0);
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

      const value = form.getValues("items");
      const buffer = value[oldIndex];
      const newValue = [...value];

      // @ts-ignore
      newValue[oldIndex] = value[newIndex];
      // @ts-ignore
      newValue[newIndex] = buffer;
      form.setValue("items", newValue);

      if (activeAccordion === `item-${oldIndex}-award`) {
        setActiveAccordion(`item-${newIndex}-award`);
      } else if (activeAccordion === `item-${newIndex}-award`) {
        setActiveAccordion(`item-${oldIndex}-award`);
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
                    formLabel="Award"
                    value={`item-${index}-award`}
                    className="rounded-lg border bg-background"
                    onRemove={remove}
                    index={index}
                    isActive={activeAccordion === `item-${index}-award`}
                  >
                    <AccordionContent className="relative flex flex-col gap-2 rounded-lg p-4">
                      <FormField
                        control={form.control}
                        name={`items.${index}.title`}
                        render={({ field }) => (
                          <FormItem className="space-y-0">
                            <FormLabel className="text-muted-foreground">
                              Award Title
                            </FormLabel>
                            <FormControl>
                              <Input placeholder="Award Title" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`items.${index}.date`}
                        render={({ field }) => (
                          <FormItem className="space-y-0">
                            <FormLabel className="text-muted-foreground">
                              Date Received
                            </FormLabel>
                            <FormControl>
                              <CalendarInput
                                value={field.value}
                                onChange={field.onChange}
                                calendarProps={{
                                  mode: "single",
                                  captionLayout: "dropdown-buttons",
                                  fromYear: 1900,
                                  toYear: new Date().getFullYear(),
                                }}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`items.${index}.issuer`}
                        render={({ field }) => (
                          <FormItem className="space-y-0">
                            <FormLabel className="text-muted-foreground">
                              Issuer
                            </FormLabel>
                            <FormControl>
                              <Input placeholder="Award Issuer" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`items.${index}.url`}
                        render={({ field }) => (
                          <FormItem className="space-y-0">
                            <FormLabel className="text-muted-foreground">
                              URL
                            </FormLabel>
                            <FormControl>
                              <Input placeholder="Award URL" {...field} />
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
                Add Award
              </Button>
            </Accordion>
          </DndContext>
        </div>
      </form>
    </Form>
  );
}
