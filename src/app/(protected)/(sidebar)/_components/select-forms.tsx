import { ScrollArea } from "@/components/ui/scroll-area";
import { useResumeStore } from "@/store/resume/data-store";
import { useState } from "react";
import Image from "next/image";
import { FormMap } from "./editor-dashboard";
import { cn } from "@/lib/utils";
import { BadgePlus } from "lucide-react";

export function SelectForms() {
  const formOrder = useResumeStore((state) => state.order);
  const setFormOrder = useResumeStore((state) => state.setOrder);
  const selectedSectionIds = formOrder.map((item) => item.id);
  const allSectionIds = Object.keys(FormMap) as (keyof typeof FormMap)[];
  const notSelectedSectionIds = allSectionIds.filter(
    (sectionId) => !selectedSectionIds.includes(sectionId),
  );
  const [selectedSectionId, setSelectedSectionId] = useState<
    keyof typeof FormMap
  >(notSelectedSectionIds?.[0] ?? selectedSectionIds?.[0] ?? "achievements");

  const handleAddSection = (sectionId: keyof typeof FormMap) => {
    console.log(sectionId);
    setFormOrder([
      ...formOrder,
      { id: sectionId, title: FormMap[sectionId]?.title },
    ]);

    const selectForms = document.getElementById("select-forms");
    if (selectForms) {
      selectForms.scrollTo({
        top: selectForms.scrollHeight,
        behavior: "instant",
      });
    }
  };

  return (
    <div className="pb-16" id="select-forms">
      <div className="flex rounded-lg border">
        <ScrollArea className="h-[300px] w-[300px] border-r p-2">
          <div className="mr-1">
            {notSelectedSectionIds.map((sectionId) => {
              const Icon = FormMap[sectionId].icon;
              const isSelected = selectedSectionIds.includes(sectionId);

              return (
                <div
                  key={sectionId}
                  className={cn(
                    "flex cursor-pointer items-center justify-between rounded-md p-2 hover:bg-muted/60",
                    isSelected && "opacity-50",
                  )}
                >
                  <div
                    key={sectionId}
                    onMouseEnter={() => setSelectedSectionId(sectionId)}
                    className={cn(
                      "relative flex items-center gap-2",
                      isSelected && "opacity-50",
                    )}
                  >
                    <Icon className="size-4" />
                    <span className="text-sm">{FormMap[sectionId].title}</span>
                  </div>
                  <BadgePlus
                    className="size-4 hover:text-primary"
                    onClick={() => handleAddSection(sectionId)}
                  />
                </div>
              );
            })}

            {selectedSectionIds.map((sectionId) => {
              const Icon = FormMap[sectionId].icon;
              const isSelected = selectedSectionIds.includes(sectionId);

              return (
                <div
                  onMouseEnter={() => setSelectedSectionId(sectionId)}
                  key={sectionId}
                  className={cn(
                    "group relative flex cursor-pointer items-center gap-2 rounded-md p-2 hover:bg-muted/60",
                    isSelected && "opacity-50",
                    selectedSectionId === sectionId && "bg-muted/60",
                  )}
                >
                  <Icon className="size-4" />
                  <span className="text-sm">{FormMap[sectionId].title}</span>
                </div>
              );
            })}
          </div>
        </ScrollArea>
        <div className="flex w-full flex-col items-center justify-center bg-muted">
          <div className="relative mx-auto aspect-video w-[80%] rounded-lg border bg-background p-1 shadow-lg">
            <Image
              src={`/section/${selectedSectionId}.png`}
              alt={`${selectedSectionId} preview`}
              unoptimized
              fill
              className="object-contain"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
