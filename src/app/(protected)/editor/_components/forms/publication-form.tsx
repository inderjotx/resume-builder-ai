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

const publicationSchema = z.object({
  title: z.string().min(1, "Title is required"),
  date: z.coerce.string(),
  url: z.string().url().optional().or(z.literal("")),
  description: z.string().optional(),
});

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  items: z.array(publicationSchema),
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
          <span>Publication #{index + 1}</span>
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

export default function PublicationForm() {
  const [activeAccordion, setActiveAccordion] = useState<string | null>(null);
  const publications = useResumeStore((store) => store.publications);
  const updatePublications = useResumeStore(
    (store) => store.updatePublications,
  );
  const publicationsVisible = useResumeStore(
    (store) => store.publicationsVisible,
  );
  const updatePublicationsVisibility = useResumeStore(
    (store) => store.updatePublicationsVisibility,
  );
  const order = useSettingsStore((store) => store.order);
  const setOrder = useSettingsStore((store) => store.setOrder);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: publications?.title ?? "Publications",
      items: publications?.items ?? [],
    },
    mode: "onChange",
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });

  const handleCreatePublicationForm = () => {
    append({
      title: "",
      date: "",
      url: "",
      description: "",
    });
    setActiveAccordion(`item-${fields.length}-publication`);
  };

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    updatePublications({
      title: data.title,
      items: data.items,
    });
  };

  useEffect(() => {
    if (publicationsVisible && !order.includes("publications")) {
      setOrder([...order, "publications"]);
    } else if (!publicationsVisible && order.includes("publications")) {
      setOrder(order.filter((section) => section !== "publications"));
    }
  }, [publicationsVisible, setOrder, order]);

  useEffect(() => {
    if (fields.length === 0 && publicationsVisible) {
      updatePublicationsVisibility(false);
    } else if (fields.length > 0 && !publicationsVisible) {
      updatePublicationsVisibility(true);
    }
  }, [fields.length, publicationsVisible, updatePublicationsVisibility]);

  useEffect(() => {
    const subscription = form.watch((value) => {
      const data = {
        title: value.title,
        items: value.items,
      } as ResumeData["publications"];

      updatePublications(data);
    });
    return () => subscription.unsubscribe();
  }, [form.watch, updatePublications, form]);

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

      if (activeAccordion === `item-${oldIndex}-publication`) {
        setActiveAccordion(`item-${newIndex}-publication`);
      } else if (activeAccordion === `item-${newIndex}-publication`) {
        setActiveAccordion(`item-${oldIndex}-publication`);
      }
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-4 rounded-md border bg-background"
      >
        <div className="flex flex-col gap-4 rounded-lg px-4 py-5">
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
                    value={`item-${index}-publication`}
                    className="rounded-lg border bg-muted/40 p-1"
                    onRemove={remove}
                    index={index}
                    isActive={activeAccordion === `item-${index}-publication`}
                  >
                    <AccordionContent className="relative flex flex-col gap-2 rounded-lg p-4">
                      <div className="flex flex-col gap-2">
                        <FormField
                          control={form.control}
                          name={`items.${index}.title`}
                          render={({ field }) => (
                            <FormItem className="space-y-0">
                              <FormLabel className="text-muted-foreground">
                                Title
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Publication Title"
                                  {...field}
                                />
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
                                Publication Date
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
                                      fromYear={1960}
                                      toYear={2030}
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
                          name={`items.${index}.url`}
                          render={({ field }) => (
                            <FormItem className="space-y-0">
                              <FormLabel className="text-muted-foreground">
                                URL
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Publication URL"
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
                                <Textarea
                                  placeholder="Describe your publication"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </AccordionContent>
                  </SortableAccordionItem>
                ))}
              </SortableContext>

              <Button
                type="button"
                variant="outline"
                className="mt-2"
                onClick={handleCreatePublicationForm}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Publication
              </Button>
            </Accordion>
          </DndContext>
        </div>
      </form>
    </Form>
  );
}
