"use client";
import { type Resume } from "@/server/db/schema";
import { useReactToPrint } from "react-to-print";
import { SelectForms } from "./select-forms";
import { useEffect, createElement, useRef, useState } from "react";
import { useSaveResume } from "@/hooks/use-save-resume";
import { Undo, Redo, ChevronsLeft, Trash } from "lucide-react";
import { useResumeStore } from "@/store/resume/data-store";
// import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import { type ResumeData, type SectionKeys } from "@/server/db/schema";
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
// import {
//   DndContext,
//   closestCenter,
//   KeyboardSensor,
//   PointerSensor,
//   useSensor,
//   useSensors,
//   MeasuringStrategy,
// } from "@dnd-kit/core";
// import type { DragEndEvent } from "@dnd-kit/core";
// import {
//   arrayMove,
//   SortableContext,
//   sortableKeyboardCoordinates,
//   verticalListSortingStrategy,
// } from "@dnd-kit/sortable";
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
  Printer,
} from "lucide-react";
import { useUpdateTitle } from "@/store/resume/data-store";
import { DynamicInput } from "@/components/ui/dynamic-input";
import { useHistoryStore } from "@/store/resume/history-store";
import { usePathname } from "next/navigation";
import { useBreakpoint } from "@/hooks/use-breakpoint";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Eye } from "lucide-react";
import { TemplatePicker } from "@/components/template-picker";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

function CustomAccordionItem({
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
  // const {
  //   attributes,
  //   listeners,
  //   setNodeRef,
  //   transform,
  //   transition,
  //   isDragging,
  // } = useSortable({ id });

  const { title, setTitle } = useUpdateTitle(id);
  const pathname = usePathname();
  const removeSection = useResumeStore((state) => state.removeSection);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  // Define which sections are optional (can be deleted)
  const optionalSections: SectionKeys[] = [
    "achievements",
    "awards",
    "certifications",
    "goals",
    "references",
    "publications",
    "voluntaryWork",
    "languages",
    "socialMedia",
  ];

  const isOptionalSection = optionalSections.includes(id);

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent accordion from toggling
    setShowDeleteDialog(true);
  };

  const handleConfirmDelete = () => {
    removeSection(id);
    setShowDeleteDialog(false);
  };

  const handleCancelDelete = () => {
    setShowDeleteDialog(false);
  };

  // const style = {
  //   transform: transform
  //     ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
  //     : undefined,
  //   transition,
  //   position: isDragging ? "relative" : undefined,
  //   zIndex: isDragging ? 9999 : "auto",
  //   boxShadow: isDragging ? "0 0 20px rgba(0,0,0,0.15)" : undefined,
  // };

  return (
    <>
      <AccordionItem
        // ref={setNodeRef}
        // style={style as unknown as React.CSSProperties}
        value={value}
        className="rounded-lg border bg-muted/40 p-1"
      >
        <AccordionTrigger className="flex items-center rounded-md px-2 py-1 text-sm hover:no-underline">
          <div className="flex w-full items-center justify-between gap-2 pr-2">
            {/* <div
              className="flex size-8 cursor-grab touch-none items-center justify-center rounded-md hover:bg-muted"
              {...attributes}
              {...listeners}
            >
              <GripVertical className="h-4 w-4" />
            </div> */}
            <div className="flex items-center gap-2">
              <Icon className="size-5" />
              <DynamicInput
                as="h3"
                value={title}
                onValueChange={(value) => setTitle(value)}
              />
            </div>
            {isOptionalSection && (
              <Button
                variant="outline"
                size="icon"
                className="ml-auto h-6 w-6 text-destructive hover:text-destructive"
                onClick={handleDeleteClick}
              >
                <Trash className="h-4 w-4" />
              </Button>
            )}
          </div>
        </AccordionTrigger>
        <AccordionContent id={`form-accordion-content-${id}`} className="p-4">
          {children}
        </AccordionContent>
      </AccordionItem>

      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Section</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the &quot;{title}&quot; section?
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={handleCancelDelete}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleConfirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
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

export default function EditorDashboard({ resume }: { resume: Resume }) {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const activeSection = useResumeStore((state) => state.activeSection);
  const setActiveSection = useResumeStore((state) => state.setActiveSection);
  const historyStore = useHistoryStore();
  const { isPending } = useSaveResume(resume.id);
  const updateAll = useResumeStore((state) => state.updateAll);
  const setSelectedTemplateId = useResumeStore((s) => s.setSelectedTemplateId);
  const resumeRef = useRef<HTMLDivElement>(null);
  const handlePrint = useReactToPrint({
    contentRef: resumeRef as React.RefObject<HTMLDivElement>,
    fonts: [
      {
        family: "Roboto",
        source:
          "https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap",
      },
    ],
  });
  const isXl = useBreakpoint("xl");

  useEffect(() => {
    console.log("setting up initial data");
    updateAll({
      data: resume.data!,
      settings: resume.settings!,
      order: resume.order!,
    });
    if (resume.settings?.templateId) {
      setSelectedTemplateId(resume.settings.templateId);
    }
  }, [resume, updateAll]);

  useEffect(() => {
    const content = document.getElementById(
      `form-accordion-content-${activeSection}`,
    );
    if (content) {
      content.scrollIntoView({ behavior: "smooth" });
    }
  }, [activeSection]);

  // useEffect(() => {
  //   const unsubscribe = useResumeStore.subscribe((state) => {
  //     historyStore.saveState(state.getData());
  //   });

  //   return () => {
  //     unsubscribe();
  //     // debouncedSave.cancel(); // Cancel any pending debounced calls
  //   };
  // }, []);

  // const handleUndo = () => {
  //   historyStore.undo((previousState) => {
  //     updateAll(previousState);
  //   });
  // };

  // const handleRedo = () => {
  //   historyStore.redo((nextState) => {
  //     updateAll(nextState);
  //   });
  // };

  const formOrder = useResumeStore((state) => state.order);
  const setFormOrder = useResumeStore((state) => state.setOrder);

  // const sensors = useSensors(
  //   useSensor(PointerSensor),
  //   useSensor(KeyboardSensor, {
  //     coordinateGetter: sortableKeyboardCoordinates,
  //   }),
  // );

  // function handleDragEnd(event: DragEndEvent) {
  //   const { active, over } = event;

  //   if (active?.id !== over?.id) {
  //     const oldIndex = formOrder.findIndex((item) => item.id === active.id);
  //     const newIndex = formOrder.findIndex((item) => item.id === over?.id);

  //     if (oldIndex === -1 || newIndex === -1) return;

  //     // Use arrayMove from dnd-kit to handle the reordering
  //     const newOrder = arrayMove(formOrder, oldIndex, newIndex);
  //     setFormOrder(newOrder);
  //   }
  // }

  function handlePrintResume() {
    handlePrint();
  }

  const ResumePreview = () => (
    <div className="flex-1">
      <header className="flex h-10 w-full items-center justify-between border-b px-8 lg:px-4">
        <div className="flex items-center gap-2">
          <span>Preview</span>
          <TemplatePicker />
        </div>
        <div className="flex items-center gap-2">
          {/* <Button
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
          </Button> */}
          <Button variant="outline" size="icon" onClick={handlePrintResume}>
            <Printer className="size-4" />
          </Button>
        </div>
      </header>
      <ScrollArea className="mr-2 h-[calc(100vh-2.5rem)] bg-muted">
        <DisplayContent ref={resumeRef as React.RefObject<HTMLDivElement>} />
      </ScrollArea>
    </div>
  );

  // TemplatePicker provided as a component

  return (
    <div className="h-screen w-full bg-background">
      <div className="grid flex-1 grid-cols-5">
        <div className="col-span-5 xl:col-span-2">
          <header className="flex h-10 w-full items-center justify-center border-b">
            {isPending ? (
              <span className="text-sm text-muted-foreground">Saving...</span>
            ) : (
              <span className="text-sm text-muted-foreground">Ready</span>
            )}
          </header>
          <ScrollArea
            id="editor-scroll-area"
            className="h-[calc(100vh-2.5rem)]"
          >
            <div className="space-y-4 p-4">
              <h2 className="text-2xl font-bold">Editor</h2>
              {/* <DndContext
                // sensors={sensors}
                collisionDetection={closestCenter}
                // onDragEnd={handleDragEnd}
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
                > */}
              <Accordion
                type="single"
                value={activeSection}
                onValueChange={setActiveSection}
                collapsible
                className="flex w-full flex-col gap-4 pb-6"
              >
                {formOrder.map((form) => (
                  <CustomAccordionItem
                    key={form.id}
                    id={form.id as keyof ResumeData}
                    value={form.id}
                    icon={FormMap[form.id as keyof typeof FormMap].icon}
                  >
                    {createElement(
                      FormMap[form.id as keyof typeof FormMap].component,
                    )}
                  </CustomAccordionItem>
                ))}
              </Accordion>
              <SelectForms />
              {/* </SortableContext>
              </DndContext> */}
            </div>
          </ScrollArea>
        </div>

        {isXl ? (
          // Desktop view - inline grid
          <div className="col-span-3 hidden flex-1 xl:grid">
            <ResumePreview />
          </div>
        ) : (
          // Mobile view - floating button and sheet
          <>
            <Button
              variant="outline"
              className="fixed right-4 top-4 z-50 xl:hidden"
              onClick={() => setIsSheetOpen(true)}
            >
              <ChevronsLeft className="size-4" />
              View Resume
            </Button>

            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
              <SheetContent
                side="right"
                className="w-full bg-muted p-0 px-4 sm:max-w-xl"
              >
                <ResumePreview />
              </SheetContent>
            </Sheet>
          </>
        )}
      </div>
    </div>
  );
}
