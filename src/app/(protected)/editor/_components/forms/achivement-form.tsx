"use client";
import { useForm, useFieldArray } from "react-hook-form";
import { useEffect } from "react";
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
import { ResumeData } from "@/server/db/schema";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";

const achievementSchema = z.object({
  achievementTitle: z.string().optional(),
  achievementDate: z.coerce.string().optional(),
  achievementDescription: z.string().optional(),
});

const formSchema = z.object({
  items: z.array(achievementSchema),
});

export default function AchievementForm() {
  const achievements = useResumeStore((store) => store.achievements);
  const updateAchievements = useResumeStore(
    (store) => store.updateAchievements,
  );
  const achievementsVisible = useResumeStore(
    (store) => store.achievementsVisible,
  );
  const updateAchievementsVisibility = useResumeStore(
    (store) => store.updateAchievementsVisibility,
  );
  const order = useSettingsStore((store) => store.order);
  const setOrder = useSettingsStore((store) => store.setOrder);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      items: achievements?.items ?? [],
    },
    mode: "onChange",
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    updateAchievements({ items: data.items });
  };

  useEffect(() => {
    if (achievementsVisible && !order.includes("achievements")) {
      setOrder([...order, "achievements"]);
    } else if (!achievementsVisible && order.includes("achievements")) {
      setOrder(order.filter((section) => section !== "achievements"));
    }
  }, [achievementsVisible, setOrder, order]);

  useEffect(() => {
    if (fields.length === 0 && achievementsVisible) {
      updateAchievementsVisibility(false);
    } else if (fields.length > 0 && !achievementsVisible) {
      updateAchievementsVisibility(true);
    }
  }, [fields.length, achievementsVisible, updateAchievementsVisibility]);

  useEffect(() => {
    const subscription = form.watch((value) => {
      const data = {
        items: value.items,
      } as ResumeData["achievements"];

      updateAchievements(data);
    });
    return () => subscription.unsubscribe();
  }, [form.watch, updateAchievements, form]);

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

            <div className="flex flex-col gap-2">
              <FormField
                control={form.control}
                name={`items.${index}.achievementTitle`}
                render={({ field }) => (
                  <FormItem className="space-y-0">
                    <FormLabel className="text-muted-foreground">
                      Title
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Achievement Title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={`items.${index}.achievementDate`}
                render={({ field }) => (
                  <FormItem className="space-y-0">
                    <FormLabel className="text-muted-foreground">
                      Date
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
                        <PopoverContent align="start" className="w-auto p-0">
                          <Calendar
                            mode="single"
                            captionLayout="dropdown-buttons"
                            selected={
                              field.value ? new Date(field.value) : undefined
                            }
                            onSelect={field.onChange}
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
                name={`items.${index}.achievementDescription`}
                render={({ field }) => (
                  <FormItem className="space-y-0">
                    <FormLabel className="text-muted-foreground">
                      Description
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe your achievement"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        ))}

        <Button
          type="button"
          variant="outline"
          className="mt-2"
          onClick={() => append({})}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Achievement
        </Button>
      </form>
    </Form>
  );
}
