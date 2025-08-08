"use client";
import type React from "react";
import { useResumeStore } from "@/store/resume/data-store";
import type { SectionKeys } from "@/server/db/schema";
import { prettyDate } from "@/lib/utils";
import Image from "next/image";

export function SmartTemplate({
  ref,
}: {
  ref: React.RefObject<HTMLDivElement>;
}) {
  const order = useResumeStore((s) => s.order);

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
      className="mx-auto w-full max-w-4xl bg-white p-6 md:aspect-[1/1.4142]"
    >
      <div className="flex flex-col gap-6">
        {order?.map((section) => {
          const SectionComponent = sectionMap[section.id];
          return <SectionComponent key={section.id} />;
        })}
      </div>
    </div>
  );
}

function SectionWrapper({
  children,
  sectionKey,
}: {
  children: React.ReactNode;
  sectionKey: SectionKeys;
}) {
  const setActiveSection = useResumeStore((state) => state.setActiveSection);
  return (
    <section
      className="group relative cursor-pointer break-inside-avoid"
      onClick={() => setActiveSection(sectionKey)}
    >
      {children}
      <div className="pointer-events-none absolute bottom-2 right-2 hidden rounded bg-primary px-2 py-1 text-xs text-white group-hover:block">
        Edit
      </div>
    </section>
  );
}

function HeaderSection() {
  const personalInfo = useResumeStore((s) => s.personalInfo);
  return (
    <SectionWrapper sectionKey="personalInfo">
      <div className="flex items-center gap-4 border-b pb-4">
        <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full ring-2 ring-primary/40">
          <Image
            src={personalInfo?.imageUrl ?? "/avatars/user-image.png"}
            alt="Profile"
            fill
            className="object-cover object-center"
          />
        </div>
        <div className="min-w-0">
          <h1 className="truncate text-2xl font-semibold">
            {personalInfo?.firstName} {personalInfo?.lastName}
          </h1>
          <p className="truncate text-sm text-muted-foreground">
            {[personalInfo?.email, personalInfo?.phoneNumber]
              .filter(Boolean)
              .join(" · ")}
          </p>
          <p className="truncate text-sm text-muted-foreground">
            {[personalInfo?.city, personalInfo?.country].filter(Boolean).join(
              ", "
            )}
          </p>
        </div>
      </div>
      {personalInfo?.bio && (
        <div
          className="prose-sm mt-3 text-muted-foreground"
          dangerouslySetInnerHTML={{ __html: personalInfo.bio }}
        />
      )}
    </SectionWrapper>
  );
}

function WorkExperienceSection() {
  const work = useResumeStore((s) => s.workExperience);
  return (
    <SectionWrapper sectionKey="workExperience">
      <h2 className="text-lg font-semibold uppercase tracking-wide">
        {work?.title ?? "Work Experience"}
      </h2>
      <div className="mt-3 space-y-3">
        {work?.items?.map((job, i) => (
          <div key={i} className="rounded border p-3">
            <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="font-medium">{job?.position}</div>
                <div className="text-sm text-muted-foreground">
                  {job?.companyName}
                  {job?.city && job?.country && (
                    <span> · {job.city}, {job.country}</span>
                  )}
                </div>
              </div>
              <div className="text-xs text-muted-foreground">
                {prettyDate(job?.startDate)} - {job?.isCurrent ? "Present" : prettyDate(job?.endDate)}
              </div>
            </div>
            {job?.description && (
              <div
                className="prose-sm mt-2 text-sm text-muted-foreground"
                dangerouslySetInnerHTML={{ __html: job?.description }}
              />
            )}
          </div>
        ))}
      </div>
    </SectionWrapper>
  );
}

function EducationSection() {
  const edu = useResumeStore((s) => s.education);
  return (
    <SectionWrapper sectionKey="education">
      <h2 className="text-lg font-semibold uppercase tracking-wide">
        {edu?.title ?? "Education"}
      </h2>
      <div className="mt-3 space-y-3">
        {edu?.items?.map((e, i) => (
          <div key={i} className="rounded border p-3">
            <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="font-medium">{e?.degree}</div>
                <div className="text-sm text-muted-foreground">
                  {e?.institutionName}
                  {e?.city && <span> · {e.city}</span>}
                </div>
                <div className="text-sm">{e?.fieldOfStudy}</div>
              </div>
              <div className="text-xs text-muted-foreground">
                {prettyDate(e?.startDate)} - {e?.isCurrentlyStudying ? "Present" : prettyDate(e?.endDate)}
              </div>
            </div>
            {e?.description && (
              <div
                className="prose-sm mt-2 text-sm text-muted-foreground"
                dangerouslySetInnerHTML={{ __html: e?.description }}
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
  return (
    <SectionWrapper sectionKey="skills">
      <h2 className="text-lg font-semibold uppercase tracking-wide">
        {skills?.title ?? "Skills"}
      </h2>
      <div className="mt-2 space-y-2">
        {skills?.items?.map((group, i) => (
          <div key={i}>
            <div className="text-sm font-medium">{group?.skillCategory}</div>
            <div className="mt-1 flex flex-wrap gap-2 text-xs">
              {group?.skillTags?.map((tag, j) => (
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
  return (
    <SectionWrapper sectionKey="languages">
      <h2 className="text-lg font-semibold uppercase tracking-wide">
        {languages?.title ?? "Languages"}
      </h2>
      <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
        {languages?.items?.map((l, i) => (
          <div key={i} className="flex items-center justify-between rounded border px-2 py-1">
            <span>{l?.language}</span>
            <span className="text-xs text-muted-foreground">{l?.proficiency}</span>
          </div>
        ))}
      </div>
    </SectionWrapper>
  );
}

function ProjectsSection() {
  const projects = useResumeStore((s) => s.projects);
  return (
    <SectionWrapper sectionKey="projects">
      <h2 className="text-lg font-semibold uppercase tracking-wide">
        {projects?.title ?? "Projects"}
      </h2>
      <div className="mt-3 space-y-3">
        {projects?.items?.map((p, i) => (
          <div key={i} className="rounded border p-3">
            <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="font-medium">{p?.projectName}</div>
                {(p?.city ?? p?.country) && (
                  <div className="text-sm text-muted-foreground">
                    {[p?.city, p?.country].filter(Boolean).join(", ")}
                  </div>
                )}
              </div>
              <div className="text-xs text-muted-foreground">
                {prettyDate(p?.startDate)} - {p?.isCurrent ? "Present" : prettyDate(p?.endDate)}
              </div>
            </div>
            {p?.description && (
              <div
                className="prose-sm mt-2 text-sm text-muted-foreground"
                dangerouslySetInnerHTML={{ __html: p?.description }}
              />
            )}
          </div>
        ))}
      </div>
    </SectionWrapper>
  );
}

function CertificationsSection() {
  const certs = useResumeStore((s) => s.certifications);
  return (
    <SectionWrapper sectionKey="certifications">
      <h2 className="text-lg font-semibold uppercase tracking-wide">
        {certs?.title ?? "Certifications"}
      </h2>
      <div className="mt-3 space-y-3">
        {certs?.items?.map((c, i) => (
          <div key={i} className="rounded border p-3">
            <div className="font-medium">{c?.certificationName}</div>
            <div className="text-sm text-muted-foreground">{c?.certificationAuthority}</div>
            <div className="text-xs text-muted-foreground">{prettyDate(c?.certificationDate)}</div>
            {c?.description && (
              <div className="prose-sm mt-2 text-sm" dangerouslySetInnerHTML={{ __html: c?.description }} />
            )}
          </div>
        ))}
      </div>
    </SectionWrapper>
  );
}

function AchievementsSection() {
  const achievements = useResumeStore((s) => s.achievements);
  return (
    <SectionWrapper sectionKey="achievements">
      <h2 className="text-lg font-semibold uppercase tracking-wide">
        {achievements?.title ?? "Achievements"}
      </h2>
      <div className="mt-3 space-y-2">
        {achievements?.items?.map((a, i) => (
          <div key={i} className="rounded border p-3">
            <div className="flex items-start justify-between">
              <div className="font-medium">{a?.achievementTitle}</div>
              <div className="text-xs text-muted-foreground">{prettyDate(a?.achievementDate)}</div>
            </div>
            {a?.achievementDescription && (
              <div className="prose-sm mt-2 text-sm" dangerouslySetInnerHTML={{ __html: a?.achievementDescription }} />
            )}
          </div>
        ))}
      </div>
    </SectionWrapper>
  );
}

function GoalsSection() {
  const goals = useResumeStore((s) => s.goals);
  return (
    <SectionWrapper sectionKey="goals">
      <h2 className="text-lg font-semibold uppercase tracking-wide">
        {goals?.title ?? "Goals"}
      </h2>
      <ul className="mt-2 list-disc space-y-1 pl-6 text-sm">
        {goals?.items?.map((g, i) => (
          <li key={i}>{g?.goal}</li>
        ))}
      </ul>
    </SectionWrapper>
  );
}

function VoluntaryWorkSection() {
  const vw = useResumeStore((s) => s.voluntaryWork);
  return (
    <SectionWrapper sectionKey="voluntaryWork">
      <h2 className="text-lg font-semibold uppercase tracking-wide">
        {vw?.title ?? "Voluntary Work"}
      </h2>
      <div className="mt-3 space-y-3">
        {vw?.items?.map((w, i) => (
          <div key={i} className="rounded border p-3">
            <div className="flex items-start justify-between">
              <div>
                <div className="font-medium">{w?.role}</div>
                <div className="text-sm text-muted-foreground">{w?.organizationName}</div>
              </div>
              <div className="text-xs text-muted-foreground">
                {prettyDate(w?.startDate)} - {w?.isCurrent ? "Present" : prettyDate(w?.endDate)}
              </div>
            </div>
            {w?.description && (
              <div className="prose-sm mt-2 text-sm" dangerouslySetInnerHTML={{ __html: w?.description }} />
            )}
          </div>
        ))}
      </div>
    </SectionWrapper>
  );
}

function AwardsSection() {
  const awards = useResumeStore((s) => s.awards);
  return (
    <SectionWrapper sectionKey="awards">
      <h2 className="text-lg font-semibold uppercase tracking-wide">
        {awards?.title ?? "Awards"}
      </h2>
      <div className="mt-3 space-y-3">
        {awards?.items?.map((a, i) => (
          <div key={i} className="rounded border p-3">
            <div className="flex items-start justify-between">
              <div className="font-medium">{a?.title}</div>
              <div className="text-xs text-muted-foreground">{prettyDate(a?.date)}</div>
            </div>
            {a?.issuer && (
              <div className="text-sm text-muted-foreground">{a.issuer}</div>
            )}
            {a?.description && (
              <div className="prose-sm mt-2 text-sm" dangerouslySetInnerHTML={{ __html: a?.description }} />
            )}
          </div>
        ))}
      </div>
    </SectionWrapper>
  );
}

function ReferencesSection() {
  const refs = useResumeStore((s) => s.references);
  return (
    <SectionWrapper sectionKey="references">
      <h2 className="text-lg font-semibold uppercase tracking-wide">
        {refs?.title ?? "References"}
      </h2>
      <div className="mt-3 space-y-3">
        {refs?.items?.map((r, i) => (
          <div key={i} className="rounded border p-3">
            <div className="font-medium">{r?.name}</div>
            <div className="text-sm text-muted-foreground">
              {r?.position} {r?.company && `at ${r.company}`}
            </div>
            {r?.relationship && <div className="text-sm">{r.relationship}</div>}
            <div className="mt-2 text-sm">
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
  const pubs = useResumeStore((s) => s.publications);
  return (
    <SectionWrapper sectionKey="publications">
      <h2 className="text-lg font-semibold uppercase tracking-wide">
        {pubs?.title ?? "Publications"}
      </h2>
      <div className="mt-3 space-y-3">
        {pubs?.items?.map((p, i) => (
          <div key={i} className="rounded border p-3">
            <div className="flex items-start justify-between">
              <div className="font-medium">{p?.title}</div>
              <div className="text-xs text-muted-foreground">{prettyDate(p?.date)}</div>
            </div>
            {p?.description && (
              <div className="prose-sm mt-2 text-sm" dangerouslySetInnerHTML={{ __html: p?.description }} />
            )}
          </div>
        ))}
      </div>
    </SectionWrapper>
  );
}

function SocialMediaSection() {
  const social = useResumeStore((s) => s.socialMedia);
  return (
    <SectionWrapper sectionKey="socialMedia">
      <h2 className="text-lg font-semibold uppercase tracking-wide">
        {social?.title ?? "Social Media"}
      </h2>
      <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
        {social?.items?.map((s, i) => (
          <a key={i} href={s?.url} className="truncate text-primary hover:underline" target="_blank" rel="noreferrer">
            {s?.platform}
          </a>
        ))}
      </div>
    </SectionWrapper>
  );
}


