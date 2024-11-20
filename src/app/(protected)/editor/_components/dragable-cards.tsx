"use client";

import { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
// import { CSS } from "@dnd-kit/utilities";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { GripVertical } from "lucide-react";

interface CardData {
  id: string;
  title: string;
  content: string;
}

interface Props {
  card: CardData;
}

export default function DraggableCard({ card }: Props) {
  const [isExpanded, setIsExpanded] = useState(false);
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: card.id });

  console.log(card);

  const style = {
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : undefined,
    transition,
    height: isExpanded ? "auto" : undefined,
    position: isDragging ? "relative" : undefined,
    zIndex: isDragging ? 9999 : "auto",
    boxShadow: isDragging ? "0 0 20px rgba(0,0,0,0.15)" : undefined,
  };

  return (
    <Card
      ref={setNodeRef}
      className={`mb-4 ${isDragging ? "opacity-90" : ""}`}
      style={style}
    >
      <CardHeader
        className="flex cursor-pointer flex-row items-center space-x-2 p-4"
        onClick={() => !isDragging && setIsExpanded(!isExpanded)}
      >
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing"
        >
          <GripVertical className="h-5 w-5 text-muted-foreground" />
        </div>
        <h3 className="font-semibold">{card.title}</h3>
      </CardHeader>
      {isExpanded && (
        <CardContent className="pt-0">
          <p className="text-muted-foreground">{card.content}</p>
        </CardContent>
      )}
    </Card>
  );
}
