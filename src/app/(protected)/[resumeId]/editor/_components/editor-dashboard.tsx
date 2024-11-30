"use client";

import { SelectForms } from "./select-forms";
import GraphForm from "./forms/graphs-form";
import { useEffect, createElement } from "react";
import { Undo, Redo } from "lucide-react";
import { useResumeStore } from "@/store/resume/data-store";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import { type ResumeData } from "@/server/db/schema";
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
  ChartArea as Graph,
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
import { useUpdateTitle } from "@/store/resume/data-store";
import { DynamicInput } from "@/components/ui/dynamic-input";
import { useHistoryStore } from "@/store/resume/history-store";

function SortableAccordionItem({
  id,
  value,
  children,
  icon: Icon,
}: {
  id: keyof ResumeData;
  value: string;
  children: React.ReactNode;
  // title,
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

  const { title, setTitle } = useUpdateTitle(id);

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
          <div
            className="flex size-8 cursor-grab touch-none items-center justify-center rounded-md hover:bg-muted"
            {...attributes}
            {...listeners}
          >
            <GripVertical className="h-4 w-4" />
          </div>
          <Icon className="size-5" />
          <DynamicInput
            as="h3"
            value={title}
            onValueChange={(value) => setTitle(value)}
          />
        </div>
      </AccordionTrigger>
      <AccordionContent id={`form-accordion-content-${id}`} className="p-4">
        {children}
      </AccordionContent>
    </AccordionItem>
  );
}

export const FormMap: Record<
  keyof ResumeData,
  {
    id: keyof ResumeData;
    title: string;
    component: React.ComponentType;
    icon: LucideIcon;
  }
> = {
  personalInfo: {
    id: "personalInfo",
    title: "Personal Information",
    component: PersonalInfoForm,
    icon: User,
  },
  graphs: {
    id: "graphs",
    title: "Graphs",
    component: GraphForm,
    icon: Graph,
  },
  workExperience: {
    id: "workExperience",
    title: "Work Experience",
    component: WorkExperienceForm,
    icon: BriefcaseBusiness,
  },
  education: {
    id: "education",
    title: "Education",
    component: EducationForm,
    icon: GraduationCap,
  },
  skills: {
    id: "skills",
    title: "Skills",
    component: SkillForm,
    icon: Lightbulb,
  },
  achievements: {
    id: "achievements",
    title: "Achievements",
    component: AchievementForm,
    icon: Trophy,
  },
  awards: {
    id: "awards",
    title: "Awards",
    component: AwardsForm,
    icon: Award,
  },
  certifications: {
    id: "certifications",
    title: "Certifications",
    component: CertificateForm,
    icon: Award,
  },
  goals: {
    id: "goals",
    title: "Goals",
    component: GoalsForm,
    icon: Lightbulb,
  },
  references: {
    id: "references",
    title: "References",
    component: ReferenceForm,
    icon: Users,
  },
  socialMedia: {
    id: "socialMedia",
    title: "Social Media",
    component: SocialMediaForm,
    icon: Share2,
  },
  voluntaryWork: {
    id: "voluntaryWork",
    title: "Voluntary Work",
    component: VoluntaryForm,
    icon: Heart,
  },
  languages: {
    id: "languages",
    title: "Languages",
    component: LanguagesForm,
    icon: Globe,
  },
  projects: {
    id: "projects",
    title: "Projects",
    component: ProjectsForm,
    icon: FolderGit2,
  },
  publications: {
    id: "publications",
    title: "Publications",
    component: PublicationsForm,
    icon: BookOpen,
  },
} as const;

export default function EditorDashboard() {
  const activeSection = useResumeStore((state) => state.activeSection);
  const setActiveSection = useResumeStore((state) => state.setActiveSection);
  const historyStore = useHistoryStore();

  const updateAll = useResumeStore((state) => state.updateAll);

  useEffect(() => {
    const content = document.getElementById(
      `form-accordion-content-${activeSection}`,
    );
    if (content) {
      content.scrollIntoView({ behavior: "smooth" });
    }
  }, [activeSection]);

  useEffect(() => {
    const unsubscribe = useResumeStore.subscribe((state) => {
      historyStore.saveState(state.getData());
    });

    return () => {
      unsubscribe();
      // debouncedSave.cancel(); // Cancel any pending debounced calls
    };
  }, []);

  const handleUndo = () => {
    historyStore.undo((previousState) => {
      updateAll(previousState);
    });
  };

  const handleRedo = () => {
    historyStore.redo((nextState) => {
      updateAll(nextState);
    });
  };

  const formOrder = useResumeStore((state) => state.order);
  const setFormOrder = useResumeStore((state) => state.setOrder);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (active?.id !== over?.id) {
      const oldIndex = formOrder.findIndex((item) => item.id === active.id);
      const newIndex = formOrder.findIndex((item) => item.id === over?.id);

      if (oldIndex === -1 || newIndex === -1) return;

      // Use arrayMove from dnd-kit to handle the reordering
      const newOrder = arrayMove(formOrder, oldIndex, newIndex);
      setFormOrder(newOrder);
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
                    value={activeSection}
                    onValueChange={setActiveSection}
                    collapsible
                    className="flex w-full flex-col gap-4 pb-6"
                  >
                    {formOrder.map((form) => (
                      <SortableAccordionItem
                        key={form.id}
                        id={form.id as keyof ResumeData}
                        value={form.id}
                        icon={FormMap[form.id as keyof typeof FormMap].icon}
                      >
                        {createElement(
                          FormMap[form.id as keyof typeof FormMap].component,
                        )}
                      </SortableAccordionItem>
                    ))}
                  </Accordion>
                  <SelectForms />
                </SortableContext>
              </DndContext>
            </div>
          </ScrollArea>
        </div>
        <div className="col-span-3 hidden flex-1 lg:grid">
          <header className="flex h-10 w-full items-center justify-center border-b">
            Top
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={handleUndo}
                disabled={!historyStore.canUndo}
              >
                <Undo className="size-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={handleRedo}
                disabled={!historyStore.canRedo}
              >
                <Redo className="size-4" />
              </Button>
            </div>
          </header>
          <ScrollArea className="h-[calc(100vh-2.5rem)] bg-muted">
            <DisplayContent />
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}
