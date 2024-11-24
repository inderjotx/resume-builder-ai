"use client";

import { useState } from "react";
import { useSettingsStore } from "@/store/resume/settings-store";
import { DynamicInput } from "@/components/ui/dynamic-input";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import PersonalInfoForm from "./forms/user-info-form";
import WorkExperienceForm from "./forms/work-experience-form";
import EducationForm from "./forms/education-form";
import SkillForm from "./forms/skill-form";
import AchievementForm from "./forms/achivement-form";
import AwardsForm from "./forms/awards-form";
import CertificateForm from "./forms/certificate-form";
import GoalsForm from "./forms/goals-form";
import ReferenceForm from "./forms/reference-form";
import SocialMediaForm from "./forms/social-media-form";
import VoluntaryForm from "./forms/voluntary-form";
import LanguagesForm from "./forms/languages-form";
import ProjectsForm from "./forms/projects-form";
import PublicationsForm from "./forms/publication-form";
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
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import DraggableCard from "./dragable-cards";
import DisplayContent from "./display-content";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { GripVertical, type LucideIcon } from "lucide-react";
import { useSortable } from "@dnd-kit/sortable";
import {
  Trophy,
  Award,
  GraduationCap,
  Lightbulb,
  Globe,
  FolderGit2,
  BookOpen,
  Users,
  Share2,
  Heart,
  BriefcaseBusiness,
  User,
} from "lucide-react";

function SortableAccordionItem({
  id,
  value,
  children,
  title,
  icon: Icon,
}: {
  id: string;
  value: string;
  children: React.ReactNode;
  title: string;
  icon: LucideIcon;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : undefined,
    transition,
    position: isDragging ? "relative" : undefined,
    zIndex: isDragging ? 9999 : "auto",
    boxShadow: isDragging ? "0 0 20px rgba(0,0,0,0.15)" : undefined,
  };

  return (
    <AccordionItem
      ref={setNodeRef}
      style={style as unknown as React.CSSProperties}
      value={value}
      className="rounded-lg border bg-muted/40 p-1"
    >
      <AccordionTrigger className="flex items-center rounded-md px-2 py-1 text-sm hover:no-underline">
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="size-8 cursor-grab touch-none"
            {...attributes}
            {...listeners}
          >
            <GripVertical className="h-4 w-4" />
          </Button>
          <Icon className="size-5" />
          <h2 className="text-base">{title}</h2>
          {/* <DynamicInput
            as="span"
            initialValue={title}
            className="text-lg font-semibold"
            onSave={(value) => {
              // Handle title updates if needed
            }}
          /> */}
        </div>
      </AccordionTrigger>
      <AccordionContent className="p-4">{children}</AccordionContent>
    </AccordionItem>
  );
}

export default function EditorDashboard() {
  const [activeSection, setActiveSection] = useState<string | null>(null);
  // const { order } = useSettingsStore((store) => store.order);
  // const { settings } = useSettingsStore((store) => store.settings);
  const [formOrder, setFormOrder] = useState([
    {
      id: "personal-info",
      title: "Personal Information",
      component: PersonalInfoForm,
      icon: User,
    },
    {
      id: "work-experience",
      title: "Work Experience",
      component: WorkExperienceForm,
      icon: BriefcaseBusiness,
    },
    {
      id: "education",
      title: "Education",
      component: EducationForm,
      icon: GraduationCap,
    },
    {
      id: "skills",
      title: "Skills",
      component: SkillForm,
      icon: Lightbulb,
    },
    {
      id: "achievements",
      title: "Achievements",
      component: AchievementForm,
      icon: Trophy,
    },
    {
      id: "awards",
      title: "Awards",
      component: AwardsForm,
      icon: Award,
    },
    {
      id: "certificates",
      title: "Certificates",
      component: CertificateForm,
      icon: Award,
    },
    {
      id: "goals",
      title: "Goals",
      component: GoalsForm,
      icon: Lightbulb,
    },
    {
      id: "references",
      title: "References",
      component: ReferenceForm,
      icon: Users,
    },
    {
      id: "social-media",
      title: "Social Media",
      component: SocialMediaForm,
      icon: Share2,
    },
    {
      id: "voluntary",
      title: "Voluntary Work",
      component: VoluntaryForm,
      icon: Heart,
    },
    {
      id: "languages",
      title: "Languages",
      component: LanguagesForm,
      icon: Globe,
    },
    {
      id: "projects",
      title: "Projects",
      component: ProjectsForm,
      icon: FolderGit2,
    },
    {
      id: "publications",
      title: "Publications",
      component: PublicationsForm,
      icon: BookOpen,
    },
  ]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (active?.id !== over?.id) {
      setFormOrder((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over?.id);

        return arrayMove(items, oldIndex, newIndex);
      });
    }
  }

  return (
    <div className="h-screen w-full bg-background">
      <div className="grid flex-1 grid-cols-5">
        <div className="col-span-5 lg:col-span-2">
          <header className="flex h-10 w-full items-center justify-center border-b">
            Top
          </header>
          <ScrollArea className="h-[calc(100vh-2.5rem)]">
            <div className="space-y-4 p-4">
              <h2 className="text-2xl font-bold">Editor</h2>
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
                modifiers={[restrictToVerticalAxis]}
                measuring={{
                  droppable: {
                    strategy: MeasuringStrategy.Always,
                  },
                }}
              >
                <SortableContext
                  items={formOrder.map((item) => item.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <Accordion
                    type="single"
                    value={activeSection ?? undefined}
                    onValueChange={setActiveSection}
                    collapsible
                    className="flex w-full flex-col gap-4"
                  >
                    {formOrder.map((form) => (
                      <SortableAccordionItem
                        key={form.id}
                        id={form.id}
                        value={form.id}
                        title={form.title}
                        icon={form.icon}
                      >
                        <form.component />
                      </SortableAccordionItem>
                    ))}
                  </Accordion>
                </SortableContext>
              </DndContext>
            </div>
          </ScrollArea>
        </div>
        <div className="col-span-3 hidden flex-1 lg:grid">
          <header className="flex h-10 w-full items-center justify-center border-b">
            Top
          </header>
          <ScrollArea className="h-[calc(100vh-2.5rem)]">
            <DisplayContent />
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}
