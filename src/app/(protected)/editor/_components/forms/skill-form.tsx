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
import { ResumeData } from "@/server/db/schema";
import { Badge } from "@/components/ui/badge";

const skillSchema = z.object({
  skillCategory: z.string().optional(),
  skillTags: z.array(z.string()).default([]),
});

const formSchema = z.object({
  items: z.array(skillSchema),
});

export default function SkillForm() {
  const { skills, updateSkills, skillsVisible, updateSkillsVisibility } =
    useResumeStore();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      items: skills?.items ?? [{ skillCategory: "", skillTags: [] }],
    },
    mode: "onChange",
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    updateSkills({ items: data.items });
  };

  useEffect(() => {
    const subscription = form.watch((value) => {
      const data = {
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

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="mx-auto flex max-w-2xl flex-col gap-4"
      >
        {fields.map((field, index) => (
          <div key={field.id} className="relative rounded-lg border p-4">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-2 top-2"
              onClick={() => remove(index)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>

            <div className="flex flex-col gap-4">
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
                          onClick={() => removeSkillTag(index, tagIndex)}
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
            </div>
          </div>
        ))}

        <Button
          type="button"
          variant="outline"
          className="mt-2"
          onClick={() => append({ skillCategory: "", skillTags: [] })}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Skill Category
        </Button>
      </form>
    </Form>
  );
}
