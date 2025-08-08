"use client";
import type React from "react";
import { useResumeStore } from "@/store/resume/data-store";
import type { SectionKeys } from "@/server/db/schema";
import { prettyDate } from "@/lib/utils";
import Image from "next/image";

// ElegantSidebarTemplate: two-column layout with a colored left rail similar to the provided image
export function ElegantSidebarTemplate({
  ref,
}: {
  ref: React.RefObject<HTMLDivElement>;
}) {
  const settings = useResumeStore((s) => s.settings);
  const order = useResumeStore((s) => s.order);
  const primary = settings?.color ?? "#0f172a"; // default slate-900
  const secondary = settings?.secondaryColor ?? "#0b1220";
  const bg = settings?.background?.color ?? "#ffffff";
  const bodyFont = settings?.fontFace
    ? { fontFamily: settings.fontFace }
    : undefined;

  const sectionMap: Record<SectionKeys, React.ComponentType> = {
    personalInfo: HeaderSection,
    workExperience: WorkExperienceSection,
    education: EducationSection,
    skills: SkillsSection,
    languages: LanguagesSection,
    projects: ProjectsSection,
    certifications: CertificationsSection,
    achievements: AchievementsSection,
    goals: GoalsSection,
    voluntaryWork: VoluntaryWorkSection,
    awards: AwardsSection,
    references: ReferencesSection,
    publications: PublicationsSection,
    socialMedia: SocialMediaSection,
  };

  return (
    <div
      ref={ref}
      className="mx-auto w-full max-w-5xl bg-white md:aspect-[1/1.4142]"
      style={{
        backgroundColor: bg,
        ...(bodyFont ?? {}),
        fontSize: settings?.fontSize ?? "16px",
        lineHeight: settings?.lineHeight ?? "1.5",
      }}
    >
      <div className="grid grid-cols-3">
        <aside
          className="col-span-1 flex h-full flex-col gap-6 p-6 text-white"
          style={{ backgroundColor: secondary }}
        >
          <SidebarPersonal />
          <SidebarContact />
          <SidebarEducation />
          <SidebarSkills />
          <SidebarLanguages />
        </aside>
        <main className="col-span-2 p-8">
          <MainHeader primary={primary} />
          <div className="mt-8 flex flex-col gap-8">
            {order
              ?.filter(
                (s) =>
                  ![
                    "personalInfo",
                    "education",
                    "skills",
                    "languages",
                  ].includes(s.id),
              )
              .map((section) => {
                const Section = sectionMap[section.id];
                return <Section key={section.id} />;
              })}
          </div>
        </main>
      </div>
    </div>
  );
}

function SidebarPersonal() {
  const personal = useResumeStore((s) => s.personalInfo);
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative h-28 w-28 overflow-hidden rounded-full ring-4 ring-white/20">
        <Image
          src={personal?.imageUrl ?? "/avatars/user-image.png"}
          alt="Profile"
          fill
          className="object-cover object-center"
        />
      </div>
      <div className="text-center">
        <div className="text-lg font-semibold tracking-wide">
          {personal?.firstName} {personal?.lastName}
        </div>
      </div>
    </div>
  );
}

function SidebarBlock({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="mb-2 border-b border-white/20 pb-1 text-sm font-semibold uppercase tracking-wider">
        {title}
      </div>
      <div className="text-sm text-white/90">{children}</div>
    </div>
  );
}

function SidebarContact() {
  const p = useResumeStore((s) => s.personalInfo);
  return (
    <SidebarBlock title="Contact">
      <div className="space-y-1">
        {p?.phoneNumber && <div>{p.phoneNumber}</div>}
        {p?.email && <div>{p.email}</div>}
        {(p?.address || p?.city || p?.country) && (
          <div>
            {[p?.address, p?.city, p?.country].filter(Boolean).join(", ")}
          </div>
        )}
        {p?.website && <div className="truncate">{p.website}</div>}
      </div>
    </SidebarBlock>
  );
}

function SidebarEducation() {
  const edu = useResumeStore((s) => s.education);
  if (!edu?.items?.length) return null;
  return (
    <SidebarBlock title={edu.title ?? "Education"}>
      <div className="space-y-3">
        {edu.items?.map((e, i) => (
          <div key={i}>
            <div className="font-medium">{e?.degree}</div>
            <div className="text-white/80">{e?.institutionName}</div>
            <div className="text-xs text-white/70">
              {prettyDate(e?.startDate)} -{" "}
              {e?.isCurrentlyStudying ? "Present" : prettyDate(e?.endDate)}
            </div>
          </div>
        ))}
      </div>
    </SidebarBlock>
  );
}

function SidebarSkills() {
  const skills = useResumeStore((s) => s.skills);
  if (!skills?.items?.length) return null;
  return (
    <SidebarBlock title={skills.title ?? "Skills"}>
      <ul className="list-disc space-y-1 pl-5">
        {skills.items
          ?.flatMap((g) => g?.skillTags ?? [])
          .map((tag, i) => <li key={i}>{tag}</li>)}
      </ul>
    </SidebarBlock>
  );
}

function SidebarLanguages() {
  const langs = useResumeStore((s) => s.languages);
  if (!langs?.items?.length) return null;
  return (
    <SidebarBlock title={langs.title ?? "Languages"}>
      <ul className="space-y-1">
        {langs.items?.map((l, i) => (
          <li key={i} className="flex items-center justify-between">
            <span>{l?.language}</span>
            <span className="text-xs opacity-80">{l?.proficiency}</span>
          </li>
        ))}
      </ul>
    </SidebarBlock>
  );
}

function MainHeader({ primary }: { primary: string }) {
  const personal = useResumeStore((s) => s.personalInfo);
  const settings = useResumeStore((s) => s.settings);
  const title =
    (personal?.firstName ?? "") +
    (personal?.lastName ? ` ${personal.lastName}` : "");
  const role = personal?.title ?? "";
  const headingStyle: React.CSSProperties = {
    color: primary,
    fontFamily: settings?.headingFontFace || undefined,
    textTransform:
      settings?.headlineCapitalization === "uppercase"
        ? "uppercase"
        : settings?.headlineCapitalization === "lowercase"
          ? "lowercase"
          : settings?.headlineCapitalization === "capitalize"
            ? "capitalize"
            : undefined,
  };
  return (
    <div>
      <h1
        className="text-3xl font-extrabold tracking-wide"
        style={headingStyle}
      >
        {title}
      </h1>
      {role && (
        <div
          className="mt-1 text-base font-medium tracking-widest text-zinc-700"
          style={{
            fontFamily: settings?.headingFontFace || undefined,
            textTransform:
              settings?.headlineCapitalization === "uppercase"
                ? "uppercase"
                : settings?.headlineCapitalization === "lowercase"
                  ? "lowercase"
                  : settings?.headlineCapitalization === "capitalize"
                    ? "capitalize"
                    : undefined,
          }}
        >
          {role}
        </div>
      )}
      {personal?.bio && (
        <div
          className="prose-sm mt-6 max-w-none border-t pt-4 text-sm text-muted-foreground"
          dangerouslySetInnerHTML={{ __html: personal.bio }}
        />
      )}
    </div>
  );
}

function SectionWrapper({ children }: { children: React.ReactNode }) {
  return <section className="space-y-3">{children}</section>;
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  const settings = useResumeStore((s) => s.settings);
  const primary = settings?.color ?? "#0f172a";
  const style: React.CSSProperties = {
    fontFamily: settings?.headingFontFace || undefined,
    textTransform:
      settings?.headlineCapitalization === "uppercase"
        ? "uppercase"
        : settings?.headlineCapitalization === "lowercase"
          ? "lowercase"
          : settings?.headlineCapitalization === "capitalize"
            ? "capitalize"
            : undefined,
    color: primary,
  };
  return (
    <div className="flex items-center gap-3">
      <div className="h-[2px] w-6" style={{ backgroundColor: primary }} />
      <h2
        className="text-lg font-extrabold tracking-wide text-zinc-800"
        style={style}
      >
        {children}
      </h2>
    </div>
  );
}

function WorkExperienceSection() {
  const work = useResumeStore((s) => s.workExperience);
  const settings = useResumeStore((s) => s.settings);
  const primary = settings?.color ?? "#0f172a";
  return (
    <SectionWrapper>
      <SectionTitle>{work?.title ?? "Work Experience"}</SectionTitle>
      <div className="space-y-6">
        {work?.items?.map((job, i) => (
          <div key={i} className="grid grid-cols-[12px_1fr] gap-4">
            <div
              className="mt-2 h-3 w-3 rounded-full"
              style={{ backgroundColor: primary }}
            />
            <div>
              <div className="flex items-start justify-between">
                <div>
                  <div className="font-semibold text-zinc-800">
                    {job?.companyName}
                  </div>
                  <div className="text-sm text-zinc-600">{job?.position}</div>
                </div>
                <div className="text-sm text-zinc-500">
                  {prettyDate(job?.startDate)} -{" "}
                  {job?.isCurrent ? "Present" : prettyDate(job?.endDate)}
                </div>
              </div>
              {job?.description && (
                <div
                  className="prose-sm mt-2 text-sm text-zinc-600"
                  dangerouslySetInnerHTML={{ __html: job?.description }}
                />
              )}
            </div>
          </div>
        ))}
      </div>
    </SectionWrapper>
  );
}

function EducationSection() {
  return null;
}
function SkillsSection() {
  return null;
}
function LanguagesSection() {
  return null;
}
function ProjectsSection() {
  return null;
}
function CertificationsSection() {
  return null;
}
function AchievementsSection() {
  return null;
}
function GoalsSection() {
  return null;
}
function VoluntaryWorkSection() {
  return null;
}
function AwardsSection() {
  return null;
}
function ReferencesSection() {
  return null;
}
function PublicationsSection() {
  return null;
}
function SocialMediaSection() {
  return null;
}

// This template renders its own personal header separately,
// so the mapped personalInfo section is a no-op.
function HeaderSection() {
  return null;
}
