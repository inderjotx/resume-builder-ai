"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useResumeStore } from "@/store/resume/data-store";
import {
  type SectionKeys,
  PageSize,
  HeadlineCapitalization,
} from "@/server/db/schema";
import { prettyDate } from "@/lib/utils";
import Image from "next/image";

// ProfileBannerTemplate: modern profile banner on the left with circular photo and angled bottom,
// right panel for Profile and Contact, then Experience and other sections below.
export function ProfileBannerTemplate({
  ref,
}: {
  ref: React.RefObject<HTMLDivElement>;
}) {
  const settings = useResumeStore((s) => s.settings);
  const order = useResumeStore((s) => s.order);

  const primary = settings?.color ?? "#6b7280"; // default slate-500-like for headings
  const bannerBg = settings?.secondaryColor ?? "#0b1220"; // dark banner background
  const pageBg = settings?.background?.color ?? "#ffffff";
  const bodyFont = settings?.fontFace
    ? { fontFamily: settings.fontFace }
    : undefined;

  // Map all supported sections. `personalInfo` is rendered in the hero header, so map to no-op.
  const sectionMap = useMemo<Record<SectionKeys, React.ComponentType>>(
    () => ({
      personalInfo: () => null,
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
    }),
    [],
  );

  // Determine screen pixel dimensions per page size (96 DPI approximation)
  const { pageWidth, pageHeight } = useMemo(() => {
    const size = settings?.pageFormat ?? PageSize.A4;
    if (size === PageSize.Letter) {
      return { pageWidth: 816, pageHeight: 1056 };
    }
    return { pageWidth: 794, pageHeight: 1123 };
  }, [settings?.pageFormat]);

  // Build main sections in the selected order
  const sectionKeys = useMemo(() => order?.map((s) => s.id) ?? [], [order]);

  const sectionElements = useMemo(() => {
    const elements: React.ReactNode[] = [
      <HeroHeader key="hero" bannerBg={bannerBg} accent={primary} />,
    ];
    sectionKeys.forEach((key) => {
      const Cmp = sectionMap[key as SectionKeys];
      elements.push(<Cmp key={key} />);
    });
    return elements;
  }, [sectionKeys, sectionMap, bannerBg, primary]);

  // Pagination: measure section heights offscreen, then split into pages
  const measureRefs = useRef<Array<HTMLDivElement | null>>([]);
  const [pages, setPages] = useState<React.ReactNode[][]>([]);

  useEffect(() => {
    const paddingY = 32 * 2;
    const innerHeight = pageHeight - paddingY;
    const gap = 32;
    const heights = measureRefs.current.map((el) => el?.offsetHeight ?? 0);
    const result: React.ReactNode[][] = [];
    let current: React.ReactNode[] = [];
    let used = 0;
    sectionElements.forEach((el, i) => {
      const h = heights[i] ?? 0;
      const needed = current.length === 0 ? h : h + gap;
      if (used + needed > innerHeight && current.length > 0) {
        result.push(current);
        current = [el];
        used = h;
      } else {
        current.push(el);
        used += needed;
      }
    });
    if (current.length) result.push(current);
    setPages(result);
  }, [sectionElements, pageHeight]);

  const pageStyleFixed: React.CSSProperties = {
    width: `${pageWidth}px`,
    height: `${pageHeight}px`,
    backgroundColor: pageBg,
    ...(bodyFont ?? {}),
    fontSize: settings?.fontSize ?? "16px",
    lineHeight: settings?.lineHeight ?? "1.5",
  };

  return (
    <div className="mx-auto flex w-full max-w-full flex-col items-center gap-6">
      {/* Hidden measurement container */}
      <div
        style={{
          position: "absolute",
          left: -99999,
          top: 0,
          width: `${pageWidth - 64}px`,
        }}
      >
        {sectionElements.map((el, i) => (
          <div
            key={`m-${i}`}
            ref={(node) => {
              measureRefs.current[i] = node;
            }}
            className="mb-8"
          >
            <div className="p-0">{el}</div>
          </div>
        ))}
      </div>

      {/* Render paginated pages */}
      {pages.map((content, pageIndex) => (
        <div
          key={`page-${pageIndex}`}
          className="shadow print:shadow-none"
          style={pageStyleFixed}
          ref={pageIndex === 0 ? ref : undefined}
        >
          <main className="h-full p-8">
            <div className="flex flex-col gap-8">{content}</div>
          </main>
        </div>
      ))}
    </div>
  );
}

function HeroHeader({
  bannerBg,
  accent,
}: {
  bannerBg: string;
  accent: string;
}) {
  const personal = useResumeStore((s) => s.personalInfo);
  const settings = useResumeStore((s) => s.settings);

  const headingStyle: React.CSSProperties = {
    color: "#ffffff",
    fontFamily: settings?.headingFontFace ?? undefined,
    textTransform:
      settings?.headlineCapitalization === HeadlineCapitalization.Uppercase
        ? "uppercase"
        : settings?.headlineCapitalization === HeadlineCapitalization.Lowercase
          ? "lowercase"
          : settings?.headlineCapitalization ===
              HeadlineCapitalization.Capitalize
            ? "capitalize"
            : undefined,
  };

  return (
    <div>
      <div className="grid grid-cols-3 gap-6">
        {/* Left banner with angled bottom */}
        <div className="col-span-1">
          <div className="relative h-72 overflow-hidden rounded-md">
            {/* Avatar positioned within the container to keep it inside page bounds */}
            <div className="absolute left-1/2 top-6 z-20 -translate-x-1/2">
              <div className="relative h-28 w-28 overflow-hidden rounded-full ring-4 ring-white">
                <Image
                  src={personal?.imageUrl ?? "/avatars/user-image.png"}
                  alt="Profile"
                  fill
                  className="object-cover object-center"
                />
              </div>
            </div>
            <div
              className="flex h-full items-center justify-center px-4 text-center text-white"
              style={{
                backgroundColor: bannerBg,
                clipPath: "polygon(0 0, 100% 0, 100% 75%, 50% 100%, 0 75%)",
              }}
            >
              <div className="mt-16">
                <div
                  className="text-3xl font-extrabold tracking-wide"
                  style={headingStyle}
                >
                  {(personal?.firstName ?? "") +
                    (personal?.lastName ? ` ${personal.lastName}` : "")}
                </div>
                {personal?.title && (
                  <div
                    className="mt-1 text-sm opacity-90"
                    style={{
                      fontFamily: settings?.headingFontFace ?? undefined,
                    }}
                  >
                    {personal.title}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right profile and contact */}
        <div className="col-span-2 grid grid-cols-2 gap-6">
          <div>
            <RightSectionTitle accent={accent}>Profile</RightSectionTitle>
            {personal?.bio ? (
              <div
                className="prose-sm mt-2 text-sm text-zinc-700"
                dangerouslySetInnerHTML={{ __html: personal.bio }}
              />
            ) : (
              <div className="text-sm text-zinc-500">
                Add a short professional summary.
              </div>
            )}
          </div>

          <div>
            <RightSectionTitle accent={accent}>Contact</RightSectionTitle>
            <div className="mt-2 space-y-1 text-sm text-zinc-700">
              {personal?.phoneNumber && <div>{personal.phoneNumber}</div>}
              {personal?.website && (
                <div className="truncate">{personal.website}</div>
              )}
              {personal?.email && <div>{personal.email}</div>}
              {(personal?.address ?? personal?.city ?? personal?.country) && (
                <div>
                  {[personal?.address, personal?.city, personal?.country]
                    .filter(Boolean)
                    .join(", ")}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function RightSectionTitle({
  accent,
  children,
}: {
  accent: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className="mb-1 text-lg font-extrabold tracking-wide"
      style={{ color: accent }}
    >
      {children}
    </div>
  );
}

function SectionWrapper({ children }: { children: React.ReactNode }) {
  return <section className="space-y-3">{children}</section>;
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  const settings = useResumeStore((s) => s.settings);
  const primary = settings?.color ?? "#6b7280";
  const style: React.CSSProperties = {
    fontFamily: settings?.headingFontFace ?? undefined,
    textTransform:
      settings?.headlineCapitalization === HeadlineCapitalization.Uppercase
        ? "uppercase"
        : settings?.headlineCapitalization === HeadlineCapitalization.Lowercase
          ? "lowercase"
          : settings?.headlineCapitalization ===
              HeadlineCapitalization.Capitalize
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
  const primary = settings?.color ?? "#6b7280";
  if (!work?.items?.length) return null;
  return (
    <SectionWrapper>
      <SectionTitle>{work?.title ?? "Experience"}</SectionTitle>
      <div className="space-y-6">
        {work.items?.map((job, i) => (
          <div key={i} className="grid grid-cols-[12px_1fr] gap-4">
            <div className="relative mt-1">
              <div
                className="h-3 w-3 rounded-full"
                style={{ backgroundColor: primary }}
              />
            </div>
            <div>
              <div className="flex flex-wrap items-start justify-between gap-3">
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
                  dangerouslySetInnerHTML={{ __html: job.description }}
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
