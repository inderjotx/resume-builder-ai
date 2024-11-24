"use client";
import { useForm, useFieldArray } from "react-hook-form";
import { useEffect, useState } from "react";
import { useSettingsStore } from "@/store/resume/settings-store";
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
import { useResumeStore } from "@/store/resume/data-store";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, GripVertical } from "lucide-react";
import { type ResumeData, Proficiency } from "@/server/db/schema";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const languageSchema = z.object({
  language: z.string().min(1, "Language is required").optional(),
  proficiency: z.nativeEnum(Proficiency).optional(),
});

const formSchema = z.object({
  title: z.string().optional(),
  items: z.array(languageSchema),
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
          <span>Language #{index + 1}</span>
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

export default function LanguagesForm() {
  const languages = useResumeStore((store) => store.languages);
  const updateLanguages = useResumeStore((store) => store.updateLanguages);
  const languagesVisible = useResumeStore((store) => store.languagesVisible);
  const updateLanguagesVisibility = useResumeStore(
    (store) => store.updateLanguagesVisibility,
  );
  const order = useSettingsStore((store) => store.order);
  const setOrder = useSettingsStore((store) => store.setOrder);
  const [activeAccordion, setActiveAccordion] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: languages?.title,
      items: languages?.items ?? [],
    },
    mode: "onChange",
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    updateLanguages({ items: data.items });
  };

  useEffect(() => {
    if (languagesVisible && !order.includes("languages")) {
      setOrder([...order, "languages"]);
    } else if (!languagesVisible && order.includes("languages")) {
      setOrder(order.filter((section) => section !== "languages"));
    }
  }, [languagesVisible, setOrder, order]);

  useEffect(() => {
    if (fields.length === 0 && languagesVisible) {
      updateLanguagesVisibility(false);
    } else if (fields.length > 0 && !languagesVisible) {
      updateLanguagesVisibility(true);
    }
  }, [fields.length, languagesVisible, updateLanguagesVisibility]);

  useEffect(() => {
    const subscription = form.watch((value) => {
      const data = {
        items: value.items,
      } as ResumeData["languages"];

      updateLanguages(data);
    });
    return () => subscription.unsubscribe();
  }, [form.watch, updateLanguages, form]);

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

      if (activeAccordion === `item-${oldIndex}-language`) {
        setActiveAccordion(`item-${newIndex}-language`);
      } else if (activeAccordion === `item-${newIndex}-language`) {
        setActiveAccordion(`item-${oldIndex}-language`);
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
                    value={`item-${index}-language`}
                    className="rounded-lg border bg-muted/40 p-1"
                    onRemove={remove}
                    index={index}
                    isActive={activeAccordion === `item-${index}-language`}
                  >
                    <AccordionContent className="relative flex flex-col gap-2 rounded-lg p-4">
                      <FormField
                        control={form.control}
                        name={`items.${index}.language`}
                        render={({ field }) => (
                          <FormItem className="space-y-0">
                            <FormLabel className="text-muted-foreground">
                              Language
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Enter language..."
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`items.${index}.proficiency`}
                        render={({ field }) => (
                          <FormItem className="space-y-0">
                            <FormLabel className="text-muted-foreground">
                              Proficiency
                            </FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select proficiency level" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {Object.values(Proficiency).map((level) => (
                                  <SelectItem key={level} value={level}>
                                    {level.charAt(0).toUpperCase() +
                                      level.slice(1)}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
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
                onClick={() => append({})}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Language
              </Button>
            </Accordion>
          </DndContext>
        </div>
      </form>
    </Form>
  );
}
