"use client";
import {
  Sparkles,
  RefreshCw,
  Linkedin,
  Edit3,
  type LucideIcon,
} from "lucide-react";
import { CreateResumeDialog } from "./create-resume-dialog";
import { Card } from "./creation-cards";
import { useState } from "react";

const cards: {
  title: string;
  icon: LucideIcon;
  type: CardType;
  emoji: string;
  gradient: string;
}[] = [
  {
    title: "AI Resume From Job Description",
    icon: Sparkles,
    type: "ai",
    emoji: "✨",
    gradient: "bg-indigo-100 hover:bg-indigo-200",
  },
  {
    title: "Old Resume to New",
    icon: RefreshCw,
    type: "old-to-new",
    emoji: "🔄",
    gradient: "bg-teal-100 hover:bg-teal-200",
  },
  {
    title: "LinkedIn Profile to Resume",
    icon: Linkedin,
    type: "linkedin",
    emoji: "📄",
    gradient: "bg-sky-100 hover:bg-sky-200",
  },
  {
    title: "Manual Creation",
    icon: Edit3,
    type: "manual",
    emoji: "✍️",
    gradient: "bg-rose-100 hover:bg-rose-200",
  },
];

import type { CardType } from "./create-resume-dialog";

export const CreateSection = () => {
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [selectedType, setSelectedType] = useState<CardType>("ai");

  const handleCreate = (type: CardType) => {
    setSelectedType(type);
    setOpenCreateDialog(true);
  };

  return (
    <>
      <div className="flex flex-col gap-2 lg:w-[70%]">
        <h2 className="text-xl">Create</h2>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {cards.map((card, index) => (
            <Card key={index} {...card} onSelect={handleCreate} />
          ))}
        </div>
      </div>
      <CreateResumeDialog
        open={openCreateDialog}
        onOpenChange={setOpenCreateDialog}
        type={selectedType}
      />
    </>
  );
};
