"use client";
import { useForm, useFieldArray } from "react-hook-form";
import { useEffect, useState } from "react";
import { useSettingsStore } from "@/store/resume/settings-store";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { z } from "zod";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
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
import { Plus, Trash2, CalendarIcon } from "lucide-react";
import { type ResumeData } from "@/server/db/schema";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
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
  useSortable,
} from "@dnd-kit/sortable";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import { GripVertical, Trophy } from "lucide-react";
import { DynamicInput } from "@/components/ui/dynamic-input";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

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

function SortableAccordionItem({
  id,
  value,
  children,
  className,
  onRemove,
  index,
  isActive,
}: {
  id: string;
  children: React.ReactNode;
  className?: string;
  value: string;
  onRemove: (index: number) => void;
  index: number;
  isActive: boolean;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : undefined,
    transition,
    height: isActive ? "auto" : undefined,
    position: isDragging ? "relative" : undefined,
    zIndex: isDragging ? 9999 : "auto",
    boxShadow: isDragging ? "0 0 20px rgba(0,0,0,0.15)" : undefined,
  };

  return (
    <AccordionItem
      ref={setNodeRef}
      style={style as unknown as React.CSSProperties}
      value={value}
      className={className}
    >
      <AccordionTrigger className="flex items-center rounded-md px-2 py-1 text-sm hover:no-underline">
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="size-8 cursor-grab touch-none"
            {...attributes}
            {...listeners}
          >
            <GripVertical className="h-4 w-4" />
          </Button>
          <span>Award #{index + 1}</span>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="ml-auto mr-2 size-8"
          onClick={() => onRemove(index)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </AccordionTrigger>
      {children}
    </AccordionItem>
  );
}

export default function AwardsForm() {
  const awards = useResumeStore((store) => store.awards);
  const updateAwards = useResumeStore((store) => store.updateAwards);
  const awardsVisible = useResumeStore((store) => store.awardsVisible);
  const updateAwardsVisibility = useResumeStore(
    (store) => store.updateAwardsVisibility,
  );
  const order = useSettingsStore((store) => store.order);
  const setOrder = useSettingsStore((store) => store.setOrder);
  const [activeAccordion, setActiveAccordion] = useState<string | null>(null);

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
    if (awardsVisible && !order.includes("awards")) {
      setOrder([...order, "awards"]);
    } else if (!awardsVisible && order.includes("awards")) {
      setOrder(order.filter((section) => section !== "awards"));
    }
  }, [awardsVisible, setOrder, order]);

  useEffect(() => {
    if (fields.length === 0 && awardsVisible) {
      updateAwardsVisibility(false);
    } else if (fields.length > 0 && !awardsVisible) {
      updateAwardsVisibility(true);
    }
  }, [fields.length, awardsVisible, updateAwardsVisibility]);

  useEffect(() => {
    const subscription = form.watch((value) => {
      const data = {
        items: value.items,
      } as ResumeData["awards"];

      updateAwards(data);
    });
    return () => subscription.unsubscribe();
  }, [form.watch, updateAwards, form]);

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
        className="mx-auto flex max-w-2xl flex-col gap-4 rounded-md border p-4"
      >
        <div className="flex items-center gap-2">
          <Trophy className="size-6" />
          <DynamicInput
            as="h2"
            initialValue="Awards"
            className="text-lg font-semibold"
            onSave={(value) => form.setValue("title", value)}
          />
        </div>

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
                  value={`item-${index}-award`}
                  className="rounded-lg border bg-muted/40 p-1"
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
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "w-full justify-start text-left font-normal",
                                    !field.value && "text-muted-foreground",
                                  )}
                                >
                                  <CalendarIcon className="mr-2 h-4 w-4" />
                                  {field.value ? (
                                    format(new Date(field.value), "PPP")
                                  ) : (
                                    <span>Pick a date</span>
                                  )}
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent
                                align="start"
                                className="w-auto p-0"
                              >
                                <Calendar
                                  mode="single"
                                  captionLayout="dropdown-buttons"
                                  selected={
                                    field.value
                                      ? new Date(field.value)
                                      : undefined
                                  }
                                  onSelect={(date) =>
                                    field.onChange(date?.toISOString())
                                  }
                                  fromYear={1900}
                                  toYear={new Date().getFullYear()}
                                />
                              </PopoverContent>
                            </Popover>
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
                            <Textarea
                              placeholder="Describe your award"
                              {...field}
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
              variant="outline"
              className="mt-2"
              onClick={handleCreateAccordion}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Award
            </Button>
          </Accordion>
        </DndContext>
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
  // ... copy the CalendarInput component implementation from achievements form ...
};
