"use client";
import { useForm, useFieldArray } from "react-hook-form";
import { useEffect } from "react";
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
import { ResumeData } from "@/server/db/schema";
import { useSettingsStore } from "@/store/resume/settings-store";

const voluntarySchema = z.object({
  organizationName: z.string().optional(),
  role: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  isCurrent: z.boolean().optional(),
  description: z.string().optional(),
});

const formSchema = z.object({
  items: z.array(voluntarySchema),
});

export default function VoluntaryForm() {
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

  return (
    <Form {...form}>
      <form className="mx-auto flex max-w-2xl flex-col gap-4">
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
                          <Input placeholder="" {...field} />
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
                          <Input placeholder="" {...field} />
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
          Add Voluntary Work
        </Button>
      </form>
    </Form>
  );
}
