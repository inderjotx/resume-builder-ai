import React from "react";
import { Card } from "./_components/creation-cards";

import { Sparkles, RefreshCw, Linkedin, Edit3 } from "lucide-react";

const cards = [
  {
    title: "AI Resume From Job Description",
    icon: Sparkles,
    emoji: "✨",
    gradient: "bg-indigo-100 hover:bg-indigo-200",
  },
  {
    title: "Old Resume to New",
    icon: RefreshCw,
    emoji: "🔄",
    gradient: "bg-teal-100 hover:bg-teal-200",
  },
  {
    title: "LinkedIn Profile to Resume",
    icon: Linkedin,
    emoji: "📄",
    gradient: "bg-sky-100 hover:bg-sky-200",
  },
  {
    title: "Manual Creation",
    icon: Edit3,
    emoji: "✍️",
    gradient: "bg-rose-100 hover:bg-rose-200",
  },
];
export default function DashboardPage() {
  return (
    <div className="mx-auto flex h-screen max-w-7xl flex-col gap-8 px-4 py-8 lg:px-0">
      <CreateSection />
      <ResumeSection />
    </div>
  );
}

const CreateSection = () => {
  return (
    <div className="flex flex-col gap-2">
      <h2 className="text-xl">Create</h2>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {cards.map((card, index) => (
          <Card key={index} {...card} />
        ))}
      </div>
    </div>
  );
};

const ResumeSection = () => {
  return (
    <div className="flex flex-col gap-2">
      <h2 className="text-xl">Resume</h2>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4"></div>
    </div>
  );
};
