"use client";
import { useForm, useFieldArray } from "react-hook-form";
import { useEffect, useState } from "react";
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
import {
  Plus,
  Trash2,
  GripVertical,
  GraduationCap,
  CalendarIcon,
} from "lucide-react";
import { type ResumeData } from "@/server/db/schema";
import { useSettingsStore } from "@/store/resume/settings-store";
import { DynamicInput } from "@/components/ui/dynamic-input";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
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
  useSortable,
} from "@dnd-kit/sortable";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import { type DragEndEvent } from "@dnd-kit/core";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

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
  title: z.string().optional(),
  items: z.array(educationSchema),
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
          <span>Education #{index + 1}</span>
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
  const disabledDates = [
    {
      from: calendarProps?.fromDate ? new Date(0) : undefined,
      to: calendarProps?.fromDate
        ? new Date(calendarProps.fromDate)
        : undefined,
    },
    {
      from: calendarProps?.toDate ? new Date(calendarProps.toDate) : undefined,
      to: new Date(2100, 0, 1),
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

export default function EducationForm() {
  const education = useResumeStore((store) => store.education);
  const updateEducation = useResumeStore((store) => store.updateEducation);
  const visiblity = useResumeStore((store) => store.educationVisible);
  const setVisibility = useResumeStore(
    (store) => store.updateEducationVisibility,
  );
  const order = useSettingsStore((store) => store.order);
  const setOrder = useSettingsStore((store) => store.setOrder);

  const [activeAccordion, setActiveAccordion] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: education?.title,
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

  const handleCreateAccordion = () => {
    append({});
    setTimeout(() => {
      const newId = fields.length - 1;
      setActiveAccordion(`item-${newId}-education`);
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
        className="mx-auto flex max-w-2xl flex-col gap-4 rounded-md border p-4"
      >
        <div className="flex items-center gap-2">
          <GraduationCap className="size-6" />
          <DynamicInput
            as="h2"
            initialValue={form.getValues("title") ?? "Education"}
            className="text-lg font-semibold"
            onSave={(value) => {
              form.setValue("title", value);
            }}
          />
        </div>

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
          modifiers={[restrictToVerticalAxis]}
          measuring={{
            droppable: { strategy: MeasuringStrategy.Always },
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
                  value={`item-${index}-education`}
                  className="rounded-lg border bg-muted/40 p-1"
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

                    <div className="grid grid-cols-5 gap-2">
                      <div className="col-span-4 grid grid-cols-4 gap-2">
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

                      <div className="col-span-1 flex items-center justify-center">
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
                            <Textarea {...field} />
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
              variant="outline"
              className="mt-2"
              onClick={handleCreateAccordion}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Education
            </Button>
          </Accordion>
        </DndContext>
      </form>
    </Form>
  );
}
