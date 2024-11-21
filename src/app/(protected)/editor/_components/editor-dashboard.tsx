"use client";

import { useState } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  MeasuringStrategy,
} from "@dnd-kit/core";
import type { DragEndEvent } from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DraggableCard from "./dragable-cards";
import DisplayContent from "./display-content";

const initialCards = [
  {
    id: "1",
    title: "Getting Started",
    content: "Learn the basics of our platform...",
  },
  {
    id: "2",
    title: "Advanced Features",
    content: "Explore advanced features and capabilities...",
  },
  {
    id: "3",
    title: "Best Practices",
    content: "Follow these guidelines for optimal results...",
  },
  {
    id: "4",
    title: "Troubleshooting",
    content: "Common issues and their solutions...",
  },
  {
    id: "5",
    title: "API Reference",
    content: "Complete API documentation and examples...",
  },
  {
    id: "6",
    title: "Security Guidelines",
    content: "Important security considerations...",
  },
  {
    id: "7",
    title: "Performance Tips",
    content: "Optimize your application performance...",
  },
  {
    id: "8",
    title: "Deployment Guide",
    content: "Step-by-step deployment instructions...",
  },
  {
    id: "9",
    title: "Troubleshooting",
    content: "Common issues and their solutions...",
  },
  {
    id: "10",
    title: "API Reference",
    content: "Complete API documentation and examples...",
  },
  {
    id: "11",
    title: "Security Guidelines",
    content: "Important security considerations...",
  },
  {
    id: "12",
    title: "Performance Tips",
    content: "Optimize your application performance...",
  },
  {
    id: "13",
    title: "Deployment Guide",
    content: "Step-by-step deployment instructions...",
  },
];

export default function EditorDashboard() {
  const [cards, setCards] = useState(initialCards);
  const [activeTab, setActiveTab] = useState("editor");

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (active?.id !== over?.id) {
      setCards((items) => {
        const oldIndex = items.findIndex((item) => item.id === active?.id);
        const newIndex = items.findIndex((item) => item.id === over?.id);

        return arrayMove(items, oldIndex, newIndex);
      });
    }
  }

  return (
    <div className="h-screen w-full bg-background">
      <div className="grid flex-1 grid-cols-5">
        <div className="col-span-2">
          <ScrollArea className="h-screen">
            <div className="p-4">
              <h2 className="mb-4 text-2xl font-bold">Editor</h2>
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
                measuring={{
                  droppable: {
                    strategy: MeasuringStrategy.Always,
                  },
                }}
              >
                <SortableContext
                  items={cards}
                  strategy={verticalListSortingStrategy}
                >
                  {cards.map((card) => (
                    <DraggableCard key={card.id} card={card} />
                  ))}
                </SortableContext>
              </DndContext>
            </div>
          </ScrollArea>
        </div>
        <div className="col-span-3 flex-1">
          <ScrollArea className="h-screen">
            <DisplayContent />
          </ScrollArea>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="h-full lg:hidden">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
          <div className="h-[calc(100vh-56px)]">
            <TabsContent value="editor" className="m-0 h-full">
              <ScrollArea className="h-full">
                <div className="p-4">
                  <h2 className="mb-4 text-2xl font-bold">Editor</h2>
                  <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                    measuring={{
                      droppable: {
                        strategy: MeasuringStrategy.Always,
                      },
                    }}
                  >
                    <SortableContext
                      items={cards}
                      strategy={verticalListSortingStrategy}
                    >
                      {cards.map((card) => (
                        <DraggableCard key={card.id} card={card} />
                      ))}
                    </SortableContext>
                  </DndContext>
                </div>
              </ScrollArea>
            </TabsContent>
            <TabsContent value="preview" className="m-0 h-full">
              <ScrollArea className="h-full">
                <DisplayContent />
              </ScrollArea>
            </TabsContent>
          </div>
          <TabsList className="fixed bottom-0 left-0 right-0 flex h-14 justify-around border-t bg-background">
            <TabsTrigger value="editor" className="flex-1">
              Editor
            </TabsTrigger>
            <TabsTrigger value="preview" className="flex-1">
              Preview
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
    </div>
  );
}
