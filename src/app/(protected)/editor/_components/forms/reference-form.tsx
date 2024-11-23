"use client";
import { useForm, useFieldArray } from "react-hook-form";
import { useEffect } from "react";
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
import { Plus, Trash2 } from "lucide-react";
import { ResumeData } from "@/server/db/schema";

const referenceSchema = z.object({
  name: z.string().optional(),
  position: z.string().optional(),
  company: z.string().optional(),
  email: z.string().email().optional(),
  phoneNumber: z.string().optional(),
  relationship: z.string().optional(),
});

const formSchema = z.object({
  items: z.array(referenceSchema),
});

export default function ReferenceForm() {
  const references = useResumeStore((store) => store.references);
  const updateReferences = useResumeStore((store) => store.updateReferences);
  const referencesVisible = useResumeStore((store) => store.referencesVisible);
  const updateReferencesVisibility = useResumeStore(
    (store) => store.updateReferencesVisibility,
  );
  const order = useSettingsStore((store) => store.order);
  const setOrder = useSettingsStore((store) => store.setOrder);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      items: references?.items ?? [],
    },
    mode: "onChange",
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    updateReferences({ items: data.items });
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
      } as ResumeData["references"];

      updateReferences(data);
    });
    return () => subscription.unsubscribe();
  }, [form.watch, updateReferences, form]);

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

            <div className="grid grid-cols-2 gap-4">
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
                      <Input type="email" placeholder="Email" {...field} />
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
                      <Input placeholder="Phone Number" {...field} />
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
          Add Reference
        </Button>
      </form>
    </Form>
  );
}
