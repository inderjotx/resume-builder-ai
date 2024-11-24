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
import { Plus, Trash2 } from "lucide-react";
import { type ResumeData } from "@/server/db/schema";
import { useSettingsStore } from "@/store/resume/settings-store";
import { DynamicInput } from "@/components/ui/dynamic-input";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Heart, CalendarIcon } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
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
import { GripVertical } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

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
          <span>Voluntary Work #{index + 1}</span>
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

export default function VoluntaryForm() {
  const [activeAccordion, setActiveAccordion] = useState<string | null>(null);
  const voluntaryWork = useResumeStore((store) => store.voluntaryWork);
  const updateVoluntaryWork = useResumeStore(
    (store) => store.updateVoluntaryWork,
  );
  const visibility = useResumeStore((store) => store.voluntaryWorkVisible);
  const setVisibility = useResumeStore(
    (store) => store.updateVoluntaryWorkVisibility,
  );
  const order = useSettingsStore((store) => store.order);
  const setOrder = useSettingsStore((store) => store.setOrder);

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

  useEffect(() => {
    if (visibility && !order.includes("voluntaryWork")) {
      setOrder([...order, "voluntaryWork"]);
    } else if (!visibility && order.includes("voluntaryWork")) {
      setOrder(order.filter((section) => section !== "voluntaryWork"));
    }
  }, [visibility, setOrder, order]);

  useEffect(() => {
    if (fields.length === 0 && visibility) {
      setVisibility(false);
    } else if (fields.length > 0 && !visibility) {
      setVisibility(true);
    }
  }, [fields.length, visibility, setVisibility]);

  useEffect(() => {
    const subscription = form.watch((value) => {
      const data = {
        items: value.items,
      } as ResumeData["voluntaryWork"];

      updateVoluntaryWork(data);
    });
    return () => subscription.unsubscribe();
  }, [form.watch, updateVoluntaryWork, form]);

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
      <form className="mx-auto flex max-w-2xl flex-col gap-4 rounded-md border p-4">
        <div className="flex items-center gap-2">
          <Heart className="size-6" />
          <DynamicInput
            as="h2"
            initialValue="Voluntary Work"
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
                  value={`item-${index}-voluntary`}
                  className="rounded-lg border bg-muted/40 p-1"
                  onRemove={remove}
                  index={index}
                  isActive={activeAccordion === `item-${index}-voluntary`}
                >
                  <AccordionContent className="relative flex flex-col gap-2 rounded-lg p-4">
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

                    <div className="grid grid-cols-3 gap-2">
                      <div className="col-span-2 grid grid-cols-2 gap-2">
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
                                    mode: "single",
                                    selected: field.value
                                      ? new Date(field.value)
                                      : undefined,
                                    onSelect: (date) =>
                                      field.onChange(
                                        date ? date.toISOString() : undefined,
                                      ),
                                    initialFocus: true,
                                  }}
                                  disabled={!visibility}
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
                                  calendarProps={{
                                    mode: "single",
                                    selected: field.value
                                      ? new Date(field.value)
                                      : undefined,
                                    onSelect: (date) =>
                                      field.onChange(
                                        date ? date.toISOString() : undefined,
                                      ),
                                    initialFocus: true,
                                  }}
                                  disabled={!visibility}
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
              onClick={handleCreateVoluntaryForm}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Voluntary Work
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
