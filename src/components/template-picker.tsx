"use client";
import { useEffect } from "react";
import { useResumeStore } from "@/store/resume/data-store";
import { TEMPLATES } from "@/components/templates/registry";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export function TemplatePicker() {
  const selectedTemplateId = useResumeStore((s) => s.selectedTemplateId);
  const setSelectedTemplateId = useResumeStore((s) => s.setSelectedTemplateId);
  const current = TEMPLATES.find((t) => t.id === selectedTemplateId) ?? TEMPLATES[0]!;

  // hydrate from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem("preferredTemplateId");
      if (stored && stored !== selectedTemplateId) {
        setSelectedTemplateId(stored);
      }
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // persist on change
  useEffect(() => {
    try {
      localStorage.setItem("preferredTemplateId", selectedTemplateId);
    } catch {}
  }, [selectedTemplateId]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-7 gap-2">
          <Image src={current.thumbnail} alt={current.name} width={16} height={16} className="rounded" />
          <span className="text-xs">{current.name}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-80">
        <div className="mb-2 text-xs font-medium text-muted-foreground">Select Template</div>
        <div className="grid grid-cols-3 gap-3">
          {TEMPLATES.map((t) => (
            <button
              key={t.id}
              onClick={() => setSelectedTemplateId(t.id)}
              className={`flex flex-col items-center gap-2 rounded-md border p-2 text-xs hover:bg-muted ${
                selectedTemplateId === t.id ? "ring-2 ring-primary" : ""
              }`}
            >
              <Image
                src={t.thumbnail}
                alt={t.name}
                width={120}
                height={160}
                className="rounded object-cover"
              />
              <span className="truncate">{t.name}</span>
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}


