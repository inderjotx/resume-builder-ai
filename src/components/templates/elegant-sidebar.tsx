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

  // Determine realistic aspect ratio based on selected page size
  const pageStyle: React.CSSProperties = (() => {
    const size = settings?.pageFormat ?? "A4";
    // A4 ratio ≈ 1 : 1.4142, Letter ≈ 1 : 1.2941
    const ratio = size === "letter" ? 1 / 1.2941 : 1 / 1.4142;
    return {
      aspectRatio: `1 / ${size === "letter" ? 1.2941 : 1.4142}`,
    } as React.CSSProperties;
  })();

  return (
    <div
      ref={ref}
      className="mx-auto w-full max-w-5xl bg-white print:shadow-none"
      style={{
        backgroundColor: bg,
        ...(bodyFont ?? {}),
        fontSize: settings?.fontSize ?? "16px",
        lineHeight: settings?.lineHeight ?? "1.5",
        ...pageStyle,
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
  const education = useResumeStore((s) => s.education);
  if (!education?.items?.length) return null;
  return (
    <SectionWrapper>
      <SectionTitle>{education.title ?? "Education"}</SectionTitle>
      <div className="space-y-4">
        {education.items?.map((e, i) => (
          <div key={i}>
            <div className="flex items-start justify-between">
              <div>
                <div className="font-medium">{e?.degree}</div>
                <div className="text-sm text-zinc-600">
                  {e?.institutionName}
                </div>
                {e?.fieldOfStudy && (
                  <div className="text-sm text-zinc-600">{e.fieldOfStudy}</div>
                )}
              </div>
              <div className="text-sm text-zinc-500">
                {prettyDate(e?.startDate)} -{" "}
                {e?.isCurrentlyStudying ? "Present" : prettyDate(e?.endDate)}
              </div>
            </div>
            {e?.description && (
              <div
                className="prose-sm mt-2 text-sm text-zinc-600"
                dangerouslySetInnerHTML={{ __html: e.description }}
              />
            )}
          </div>
        ))}
      </div>
    </SectionWrapper>
  );
}
function SkillsSection() {
  const skills = useResumeStore((s) => s.skills);
  if (!skills?.items?.length) return null;
  return (
    <SectionWrapper>
      <SectionTitle>{skills.title ?? "Skills"}</SectionTitle>
      <div className="space-y-2">
        {skills.items?.map((g, i) => (
          <div key={i}>
            <div className="text-sm font-medium">{g?.skillCategory}</div>
            <div className="mt-1 flex flex-wrap gap-2 text-xs">
              {g?.skillTags?.map((tag, j) => (
                <span key={j} className="rounded border px-2 py-0.5">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </SectionWrapper>
  );
}
function LanguagesSection() {
  const languages = useResumeStore((s) => s.languages);
  if (!languages?.items?.length) return null;
  return (
    <SectionWrapper>
      <SectionTitle>{languages.title ?? "Languages"}</SectionTitle>
      <div className="grid grid-cols-2 gap-2 text-sm">
        {languages.items?.map((l, i) => (
          <div
            key={i}
            className="flex items-center justify-between rounded border px-2 py-1"
          >
            <span>{l?.language}</span>
            <span className="text-xs text-muted-foreground">
              {l?.proficiency}
            </span>
          </div>
        ))}
      </div>
    </SectionWrapper>
  );
}
function ProjectsSection() {
  const projects = useResumeStore((s) => s.projects);
  if (!projects?.items?.length) return null;
  return (
    <SectionWrapper>
      <SectionTitle>{projects.title ?? "Projects"}</SectionTitle>
      <div className="space-y-3">
        {projects.items?.map((p, i) => (
          <div key={i}>
            <div className="flex items-start justify-between">
              <div className="font-medium">{p?.projectName}</div>
              <div className="text-xs text-muted-foreground">
                {prettyDate(p?.startDate)} -{" "}
                {p?.isCurrent ? "Present" : prettyDate(p?.endDate)}
              </div>
            </div>
            {p?.description && (
              <div
                className="prose-sm mt-1 text-sm text-zinc-600"
                dangerouslySetInnerHTML={{ __html: p.description }}
              />
            )}
          </div>
        ))}
      </div>
    </SectionWrapper>
  );
}
function CertificationsSection() {
  const certifications = useResumeStore((s) => s.certifications);
  if (!certifications?.items?.length) return null;
  return (
    <SectionWrapper>
      <SectionTitle>{certifications.title ?? "Certifications"}</SectionTitle>
      <div className="space-y-3">
        {certifications.items?.map((c, i) => (
          <div key={i}>
            <div className="font-medium">{c?.certificationName}</div>
            <div className="text-sm text-zinc-600">
              {c?.certificationAuthority}
            </div>
            <div className="text-xs text-zinc-500">
              {prettyDate(c?.certificationDate)}
            </div>
          </div>
        ))}
      </div>
    </SectionWrapper>
  );
}
function AchievementsSection() {
  const achievements = useResumeStore((s) => s.achievements);
  if (!achievements?.items?.length) return null;
  return (
    <SectionWrapper>
      <SectionTitle>{achievements.title ?? "Achievements"}</SectionTitle>
      <div className="space-y-3">
        {achievements.items?.map((a, i) => (
          <div key={i}>
            <div className="flex items-start justify-between">
              <div className="font-medium">{a?.achievementTitle}</div>
              <div className="text-xs text-muted-foreground">
                {prettyDate(a?.achievementDate)}
              </div>
            </div>
            {a?.achievementDescription && (
              <div
                className="prose-sm mt-1 text-sm"
                dangerouslySetInnerHTML={{ __html: a.achievementDescription }}
              />
            )}
          </div>
        ))}
      </div>
    </SectionWrapper>
  );
}
function GoalsSection() {
  const goals = useResumeStore((s) => s.goals);
  if (!goals?.items?.length) return null;
  return (
    <SectionWrapper>
      <SectionTitle>{goals.title ?? "Goals"}</SectionTitle>
      <ul className="mt-1 list-disc space-y-1 pl-5 text-sm">
        {goals.items?.map((g, i) => <li key={i}>{g?.goal}</li>)}
      </ul>
    </SectionWrapper>
  );
}
function VoluntaryWorkSection() {
  const vw = useResumeStore((s) => s.voluntaryWork);
  if (!vw?.items?.length) return null;
  return (
    <SectionWrapper>
      <SectionTitle>{vw.title ?? "Voluntary Work"}</SectionTitle>
      <div className="space-y-3">
        {vw.items?.map((w, i) => (
          <div key={i}>
            <div className="flex items-start justify-between">
              <div>
                <div className="font-medium">{w?.role}</div>
                <div className="text-sm text-zinc-600">
                  {w?.organizationName}
                </div>
              </div>
              <div className="text-xs text-zinc-500">
                {prettyDate(w?.startDate)} -{" "}
                {w?.isCurrent ? "Present" : prettyDate(w?.endDate)}
              </div>
            </div>
            {w?.description && (
              <div
                className="prose-sm mt-1 text-sm"
                dangerouslySetInnerHTML={{ __html: w.description }}
              />
            )}
          </div>
        ))}
      </div>
    </SectionWrapper>
  );
}
function AwardsSection() {
  const awards = useResumeStore((s) => s.awards);
  if (!awards?.items?.length) return null;
  return (
    <SectionWrapper>
      <SectionTitle>{awards.title ?? "Awards"}</SectionTitle>
      <div className="space-y-3">
        {awards.items?.map((a, i) => (
          <div key={i}>
            <div className="flex items-start justify-between">
              <div className="font-medium">{a?.title}</div>
              <div className="text-xs text-muted-foreground">
                {prettyDate(a?.date)}
              </div>
            </div>
            {a?.issuer && (
              <div className="text-sm text-muted-foreground">{a.issuer}</div>
            )}
            {a?.description && (
              <div
                className="prose-sm mt-1 text-sm"
                dangerouslySetInnerHTML={{ __html: a.description }}
              />
            )}
          </div>
        ))}
      </div>
    </SectionWrapper>
  );
}
function ReferencesSection() {
  const references = useResumeStore((s) => s.references);
  if (!references?.items?.length) return null;
  return (
    <SectionWrapper>
      <SectionTitle>{references.title ?? "References"}</SectionTitle>
      <div className="space-y-3">
        {references.items?.map((r, i) => (
          <div key={i}>
            <div className="font-medium">{r?.name}</div>
            <div className="text-sm text-zinc-600">
              {r?.position} {r?.company && `at ${r.company}`}
            </div>
            {r?.relationship && <div className="text-sm">{r.relationship}</div>}
            <div className="mt-1 text-sm">
              {r?.email && <div>{r.email}</div>}
              {r?.phoneNumber && <div>{r.phoneNumber}</div>}
            </div>
          </div>
        ))}
      </div>
    </SectionWrapper>
  );
}
function PublicationsSection() {
  const publications = useResumeStore((s) => s.publications);
  if (!publications?.items?.length) return null;
  return (
    <SectionWrapper>
      <SectionTitle>{publications.title ?? "Publications"}</SectionTitle>
      <div className="space-y-3">
        {publications.items?.map((p, i) => (
          <div key={i}>
            <div className="flex items-start justify-between">
              <div className="font-medium">{p?.title}</div>
              <div className="text-xs text-muted-foreground">
                {prettyDate(p?.date)}
              </div>
            </div>
            {p?.description && (
              <div
                className="prose-sm mt-1 text-sm"
                dangerouslySetInnerHTML={{ __html: p.description }}
              />
            )}
          </div>
        ))}
      </div>
    </SectionWrapper>
  );
}
function SocialMediaSection() {
  const social = useResumeStore((s) => s.socialMedia);
  if (!social?.items?.length) return null;
  return (
    <SectionWrapper>
      <SectionTitle>{social.title ?? "Social Media"}</SectionTitle>
      <div className="grid grid-cols-2 gap-2 text-sm">
        {social.items?.map((s, i) => (
          <a
            key={i}
            href={s?.url}
            className="truncate text-primary hover:underline"
            target="_blank"
            rel="noreferrer"
          >
            {s?.platform}
          </a>
        ))}
      </div>
    </SectionWrapper>
  );
}

// This template renders its own personal header separately,
// so the mapped personalInfo section is a no-op.
function HeaderSection() {
  return null;
}
