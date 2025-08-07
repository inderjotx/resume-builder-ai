"use client";
import { useForm, useFieldArray } from "react-hook-form";
import { useEffect, useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
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
import { CalendarInput } from "./common/calendar-input";
import { SortableAccordionItem } from "./common/accordion-item";
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

const certificateSchema = z.object({
  certificationName: z.string().optional(),
  certificationDate: z.coerce.string().optional(),
  certificationAuthority: z.string().optional(),
  certificationLink: z.string().url().optional().or(z.literal("")),
  description: z.string().optional(),
});

const formSchema = z.object({
  title: z.string().optional(),
  items: z.array(certificateSchema),
});

export default function CertificateForm() {
  const certifications = useResumeStore((store) => store.certifications);
  const updateCertifications = useResumeStore(
    (store) => store.updateCertifications,
  );
  const [activeAccordion, setActiveAccordion] = useState<string | null>(null);
  const [isUpdatingFromStore, setIsUpdatingFromStore] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: certifications?.title ?? "",
      items: certifications?.items ?? [],
    },
    mode: "onChange",
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    updateCertifications({ items: data.items });
  };

  useEffect(() => {
    const subscription = form.watch((value) => {
      if (!isUpdatingFromStore) {
        const data = {
          items: value.items,
        } as ResumeData["certifications"];
        updateCertifications(data);
      }
    });
    return () => subscription.unsubscribe();
  }, [form.watch, updateCertifications, isUpdatingFromStore, form]);

  useEffect(() => {
    if (certifications) {
      setIsUpdatingFromStore(true);
      form.reset({
        title: certifications.title ?? "",
        items: certifications.items ?? [],
      });
      setTimeout(() => setIsUpdatingFromStore(false), 0);
    }
  }, [certifications, form]);

  const handleCreateAccordion = () => {
    append({});
    setTimeout(() => {
      const newId = form.getValues("items").length - 1;
      setActiveAccordion(`item-${newId}-cert`);
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

      if (activeAccordion === `item-${oldIndex}-cert`) {
        setActiveAccordion(`item-${newIndex}-cert`);
      } else if (activeAccordion === `item-${newIndex}-cert`) {
        setActiveAccordion(`item-${oldIndex}-cert`);
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
                    value={`item-${index}-cert`}
                    className="rounded-lg border bg-background"
                    onRemove={remove}
                    formLabel="Certificate"
                    index={index}
                    isActive={activeAccordion === `item-${index}-cert`}
                  >
                    <AccordionContent className="relative flex flex-col gap-4 rounded-lg p-4">
                      <FormField
                        control={form.control}
                        name={`items.${index}.certificationName`}
                        render={({ field }) => (
                          <FormItem className="space-y-0">
                            <FormLabel className="text-muted-foreground">
                              Certification Name
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Certification Name"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`items.${index}.certificationDate`}
                        render={({ field }) => (
                          <FormItem className="space-y-0">
                            <FormLabel className="text-muted-foreground">
                              Date Received
                            </FormLabel>
                            <FormControl>
                              <div className="">
                                <div className="">
                                  <CalendarInput
                                    value={field.value}
                                    onChange={field.onChange}
                                    calendarProps={{
                                      fromYear: 1960,
                                      toYear: new Date().getFullYear(),
                                      toDate: new Date(),
                                    }}
                                  />
                                </div>
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`items.${index}.certificationAuthority`}
                        render={({ field }) => (
                          <FormItem className="space-y-0">
                            <FormLabel className="text-muted-foreground">
                              Certification Authority
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Certification Authority"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`items.${index}.certificationLink`}
                        render={({ field }) => (
                          <FormItem className="space-y-0">
                            <FormLabel className="text-muted-foreground">
                              Certification Link
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Certification URL"
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
                Add Certificate
              </Button>
            </Accordion>
          </DndContext>
        </div>
      </form>
    </Form>
  );
}
