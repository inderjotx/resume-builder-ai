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
import { useResumeStore } from "@/store/resume/data-store";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { ResumeData, Proficiency } from "@/server/db/schema";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

const languageSchema = z.object({
  language: z.string().min(1, "Language is required").optional(),
  proficiency: z.nativeEnum(Proficiency).optional(),
});

const formSchema = z.object({
  items: z.array(languageSchema),
});

export default function LanguagesForm() {
  const languages = useResumeStore((store) => store.languages);
  const updateLanguages = useResumeStore((store) => store.updateLanguages);
  const languagesVisible = useResumeStore((store) => store.languagesVisible);
  const updateLanguagesVisibility = useResumeStore(
    (store) => store.updateLanguagesVisibility,
  );
  const order = useSettingsStore((store) => store.order);
  const setOrder = useSettingsStore((store) => store.setOrder);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
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
                name={`items.${index}.language`}
                render={({ field }) => (
                  <FormItem className="space-y-0">
                    <FormLabel className="text-muted-foreground">
                      Language
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Enter language..." {...field} />
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
                            {level.charAt(0).toUpperCase() + level.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
          Add Language
        </Button>
      </form>
    </Form>
  );
}
