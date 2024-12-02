import { AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { GripVertical, Trash2 } from "lucide-react";
import { useSortable } from "@dnd-kit/sortable";

export function SortableAccordionItem({
  id,
  value,
  children,
  className,
  onRemove,
  index,
  formLabel,
  isActive,
}: {
  id: string;
  children: React.ReactNode;
  className?: string;
  value: string;
  formLabel: string;
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
  } = useSortable({
    id,
  });

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
          <div
            className="flex size-8 cursor-grab touch-none items-center justify-center rounded-md hover:bg-muted"
            {...attributes}
            {...listeners}
          >
            <GripVertical className="h-4 w-4" />
          </div>
          <span>{formLabel} #{index + 1}</span>
        </div>
        <div
          className="ml-auto mr-2 flex size-8 cursor-pointer items-center justify-center rounded-md hover:bg-muted"
          onClick={() => onRemove(index)}
        >
          <Trash2 className="h-4 w-4" />
        </div>
      </AccordionTrigger>
      {children}
    </AccordionItem>
  );
}
