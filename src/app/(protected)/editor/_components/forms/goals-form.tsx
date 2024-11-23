"use client";
import { useForm, useFieldArray } from "react-hook-form";
import { useEffect } from "react";
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
import { Plus, Trash2 } from "lucide-react";
import { ResumeData } from "@/server/db/schema";
import { useSettingsStore } from "@/store/resume/settings-store";

const goalSchema = z.object({
  goal: z.string().optional(),
});

const formSchema = z.object({
  items: z.array(goalSchema),
});

export default function GoalsForm() {
  const { goals, updateGoals } = useResumeStore();
  const { goalsVisible, updateGoalsVisibility } = useResumeStore();
  const { order, setOrder } = useSettingsStore();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      items: goals?.items ?? [],
    },
    mode: "onChange",
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    updateGoals({ items: data.items });
  };

  useEffect(() => {
    if (goalsVisible && !order.includes("goals")) {
      setOrder([...order, "goals"]);
    } else if (!goalsVisible && order.includes("goals")) {
      setOrder(order.filter((section) => section !== "goals"));
    }
  }, [goalsVisible, setOrder, order]);

  useEffect(() => {
    if (fields.length === 0 && goalsVisible) {
      updateGoalsVisibility(false);
    } else if (fields.length > 0 && !goalsVisible) {
      updateGoalsVisibility(true);
    }
  }, [fields.length, goalsVisible, updateGoalsVisibility]);

  useEffect(() => {
    const subscription = form.watch((value) => {
      const data = {
        items: value.items,
      } as ResumeData["goals"];

      updateGoals(data);
    });
    return () => subscription.unsubscribe();
  }, [form.watch, updateGoals, form]);

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

            <FormField
              control={form.control}
              name={`items.${index}.goal`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-muted-foreground">Goal</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., Become proficient in React development"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        ))}

        <Button
          type="button"
          variant="outline"
          className="mt-2"
          onClick={() => append({ goal: "" })}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Goal
        </Button>
      </form>
    </Form>
  );
}
