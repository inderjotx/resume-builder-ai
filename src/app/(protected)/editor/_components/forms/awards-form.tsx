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

const awardSchema = z.object({
  title: z.string().optional(),
  date: z.coerce.string().optional(),
  url: z.string().url().optional().or(z.literal("")),
  issuer: z.string().optional(),
  description: z.string().optional(),
});

const formSchema = z.object({
  items: z.array(awardSchema),
});

export default function AwardsForm() {
  const awards = useResumeStore((store) => store.awards);
  const updateAwards = useResumeStore((store) => store.updateAwards);
  const awardsVisible = useResumeStore((store) => store.awardsVisible);
  const updateAwardsVisibility = useResumeStore(
    (store) => store.updateAwardsVisibility,
  );
  const order = useSettingsStore((store) => store.order);
  const setOrder = useSettingsStore((store) => store.setOrder);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      items: awards?.items ?? [],
    },
    mode: "onChange",
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    updateAwards({ items: data.items });
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
                        <PopoverContent align="start" className="w-auto p-0">
                          <Calendar
                            mode="single"
                            captionLayout="dropdown-buttons"
                            selected={
                              field.value ? new Date(field.value) : undefined
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
                    <FormLabel className="text-muted-foreground">URL</FormLabel>
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
                      <Textarea placeholder="Describe your award" {...field} />
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
          Add Award
        </Button>
      </form>
    </Form>
  );
}
