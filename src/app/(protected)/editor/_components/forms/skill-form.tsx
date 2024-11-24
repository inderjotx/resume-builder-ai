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
import { Plus, Trash2, X } from "lucide-react";
import { type ResumeData } from "@/server/db/schema";
import { Badge } from "@/components/ui/badge";
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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const skillSchema = z.object({
  skillCategory: z.string().optional(),
  skillTags: z.array(z.string()).default([]),
});

const formSchema = z.object({
  title: z.string().optional(),
  items: z.array(skillSchema),
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
          <span>Skill Category #{index + 1}</span>
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

export default function SkillForm() {
  const { skills, updateSkills, skillsVisible, updateSkillsVisibility } =
    useResumeStore();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: skills?.title,
      items: skills?.items ?? [{ skillCategory: "", skillTags: [] }],
    },
    mode: "onChange",
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });

  const [activeAccordion, setActiveAccordion] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    updateSkills({ title: data.title, items: data.items });
  };

  const handleAddSkillCategory = () => {
    append({ skillCategory: "", skillTags: [] });
    setTimeout(() => {
      setActiveAccordion(`item-${fields.length}-skill`);
    }, 100);
  };

  useEffect(() => {
    const subscription = form.watch((value) => {
      const data = {
        title: value.title,
        items: value.items,
      } as ResumeData["skills"];

      updateSkills(data);
    });
    return () => subscription.unsubscribe();
  }, [form.watch, updateSkills, form]);

  const addSkillTag = (index: number) => {
    const input = document.getElementById(
      `skill-newTag-${index}`,
    ) as null | HTMLInputElement;
    const newTag = input?.value;

    if (!newTag) return;

    const currentTags = form.getValues(`items.${index}.skillTags`) || [];
    if (newTag && !currentTags.includes(newTag)) {
      form.setValue(`items.${index}.skillTags`, [...currentTags, newTag]);
    }
    input.value = "";
  };

  const removeSkillTag = (categoryIndex: number, tagIndex: number) => {
    const currentTags = form.getValues(`items.${categoryIndex}.skillTags`);
    form.setValue(
      `items.${categoryIndex}.skillTags`,
      currentTags.filter((_, index) => index !== tagIndex),
    );
  };

  useEffect(() => {
    if (fields.length === 0 && skillsVisible) {
      updateSkillsVisibility(false);
    } else if (fields.length > 0 && !skillsVisible) {
      updateSkillsVisibility(true);
    }
  }, [fields.length, skillsVisible, updateSkillsVisibility]);

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

      if (activeAccordion === `item-${oldIndex}-skill`) {
        setActiveAccordion(`item-${newIndex}-skill`);
      } else if (activeAccordion === `item-${newIndex}-skill`) {
        setActiveAccordion(`item-${oldIndex}-skill`);
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
                    value={`item-${index}-skill`}
                    className="rounded-lg border bg-muted/40 p-1"
                    onRemove={remove}
                    index={index}
                    isActive={activeAccordion === `item-${index}-skill`}
                  >
                    <AccordionContent className="relative flex flex-col gap-2 rounded-lg p-4">
                      <FormField
                        control={form.control}
                        name={`items.${index}.skillCategory`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-muted-foreground">
                              Skill Category
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="e.g., Programming Languages"
                                {...field}
                                className="bg-background"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="space-y-2">
                        <FormLabel className="text-muted-foreground">
                          Skill Tags
                        </FormLabel>
                        <div className="flex flex-wrap gap-2">
                          {form
                            .watch(`items.${index}.skillTags`)
                            ?.map((tag, tagIndex) => (
                              <Badge key={tagIndex} variant="secondary">
                                {tag}
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  className="ml-1 h-4 w-4 p-0"
                                  onClick={() =>
                                    removeSkillTag(index, tagIndex)
                                  }
                                >
                                  <X className="h-3 w-3" />
                                </Button>
                              </Badge>
                            ))}
                        </div>
                        <div className="flex gap-2">
                          <Input
                            placeholder="Add a skill tag"
                            id={`skill-newTag-${index}`}
                            // value={newTag}
                            // onChange={(e) => setNewTag(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault();
                                addSkillTag(index);
                              }
                            }}
                          />
                          <Button
                            type="button"
                            onClick={() => {
                              addSkillTag(index);
                            }}
                          >
                            Add
                          </Button>
                        </div>
                      </div>
                    </AccordionContent>
                  </SortableAccordionItem>
                ))}
              </SortableContext>

              <Button
                type="button"
                variant="outline"
                className="mt-2"
                onClick={handleAddSkillCategory}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Skill Category
              </Button>
            </Accordion>
          </DndContext>
        </div>
      </form>
    </Form>
  );
}
