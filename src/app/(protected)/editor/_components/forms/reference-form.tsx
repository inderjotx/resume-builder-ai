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
import { Input } from "@/components/ui/input";
import { useResumeStore } from "@/store/resume/data-store";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, GripVertical, Users } from "lucide-react";
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
  useSortable,
} from "@dnd-kit/sortable";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import { DynamicInput } from "@/components/ui/dynamic-input";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { PhoneInput } from "@/components/ui/phone-input";

const referenceSchema = z.object({
  name: z.string().optional(),
  position: z.string().optional(),
  company: z.string().optional(),
  email: z.string().email().optional(),
  phoneNumber: z.string().optional(),
  relationship: z.string().optional(),
});

const formSchema = z.object({
  title: z.string().optional(),
  items: z.array(referenceSchema),
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
          <span>Reference #{index + 1}</span>
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

export default function ReferenceForm() {
  const references = useResumeStore((store) => store.references);
  const updateReferences = useResumeStore((store) => store.updateReferences);
  const referencesVisible = useResumeStore((store) => store.referencesVisible);
  const updateReferencesVisibility = useResumeStore(
    (store) => store.updateReferencesVisibility,
  );
  const order = useSettingsStore((store) => store.order);
  const setOrder = useSettingsStore((store) => store.setOrder);
  const [activeAccordion, setActiveAccordion] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      items: references?.items ?? [],
      title: references?.title ?? "",
    },
    mode: "onChange",
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    updateReferences({ title: data.title, items: data.items });
  };

  useEffect(() => {
    if (referencesVisible && !order.includes("references")) {
      setOrder([...order, "references"]);
    } else if (!referencesVisible && order.includes("references")) {
      setOrder(order.filter((section) => section !== "references"));
    }
  }, [referencesVisible, setOrder, order]);

  useEffect(() => {
    if (fields.length === 0 && referencesVisible) {
      updateReferencesVisibility(false);
    } else if (fields.length > 0 && !referencesVisible) {
      updateReferencesVisibility(true);
    }
  }, [fields.length, referencesVisible, updateReferencesVisibility]);

  useEffect(() => {
    const subscription = form.watch((value) => {
      const data = {
        items: value.items,
        title: value.title,
      } as ResumeData["references"];

      updateReferences(data);
    });
    return () => subscription.unsubscribe();
  }, [form.watch, updateReferences, form]);

  const handleCreateAccordion = () => {
    append({});
    setTimeout(() => {
      const newId = form.getValues("items").length - 1;
      setActiveAccordion(`item-${newId}-ref`);
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

      if (activeAccordion === `item-${oldIndex}-ref`) {
        setActiveAccordion(`item-${newIndex}-ref`);
      } else if (activeAccordion === `item-${newIndex}-ref`) {
        setActiveAccordion(`item-${oldIndex}-ref`);
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
          <Users className="size-6" />
          <DynamicInput
            as="h2"
            initialValue="References"
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
                  value={`item-${index}-ref`}
                  className="rounded-lg border bg-muted/40 p-1"
                  onRemove={remove}
                  index={index}
                  isActive={activeAccordion === `item-${index}-ref`}
                >
                  <AccordionContent className="relative flex flex-col gap-2 rounded-lg p-4">
                    <FormField
                      control={form.control}
                      name={`items.${index}.name`}
                      render={({ field }) => (
                        <FormItem className="space-y-0">
                          <FormLabel className="text-muted-foreground">
                            Name
                          </FormLabel>
                          <FormControl>
                            <Input placeholder="Reference Name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`items.${index}.position`}
                      render={({ field }) => (
                        <FormItem className="space-y-0">
                          <FormLabel className="text-muted-foreground">
                            Position
                          </FormLabel>
                          <FormControl>
                            <Input placeholder="Position" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`items.${index}.company`}
                      render={({ field }) => (
                        <FormItem className="space-y-0">
                          <FormLabel className="text-muted-foreground">
                            Company
                          </FormLabel>
                          <FormControl>
                            <Input placeholder="Company" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`items.${index}.email`}
                      render={({ field }) => (
                        <FormItem className="space-y-0">
                          <FormLabel className="text-muted-foreground">
                            Email
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="Email"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`items.${index}.phoneNumber`}
                      render={({ field }) => (
                        <FormItem className="space-y-0">
                          <FormLabel className="text-muted-foreground">
                            Phone Number
                          </FormLabel>
                          <FormControl>
                            <PhoneInput
                              placeholder="Enter phone number"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`items.${index}.relationship`}
                      render={({ field }) => (
                        <FormItem className="space-y-0">
                          <FormLabel className="text-muted-foreground">
                            Relationship
                          </FormLabel>
                          <FormControl>
                            <Input placeholder="Relationship" {...field} />
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
              Add Reference
            </Button>
          </Accordion>
        </DndContext>
      </form>
    </Form>
  );
}
