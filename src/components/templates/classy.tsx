import type { SectionKeys } from "@/server/db/schema";
import { prettyDate } from "@/lib/utils";
import { SocialMediaPlatform } from "@/server/db/schema";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { useResumeStore } from "@/store/resume/data-store";
import { Card } from "@/components/ui/card";
import {
  GraduationCap,
  Briefcase,
  Mail,
  MapPin,
  Phone,
  Link as LinkIcon,
  Wrench,
  FolderGit,
  Award,
  Languages,
  Target,
  Heart,
  Trophy,
  Users,
  BookOpen,
  Share2,
  Dot,
  Globe,
  Calendar,
  Flag,
  type LucideIcon,
} from "lucide-react";

import {
  LinkedinIcon,
  TwitterIcon,
  FacebookIcon,
  InstagramIcon,
  YoutubeIcon,
} from "lucide-react";
// import { cn } from "@/lib/utils";

interface SocialIconProps {
  platform?: SocialMediaPlatform;
  className?: string;
}

export function SocialIcon({
  platform,
  className = "h-4 w-4",
}: SocialIconProps) {
  switch (platform) {
    case SocialMediaPlatform.LinkedIn:
      return <LinkedinIcon className={className} />;
    case SocialMediaPlatform.Twitter:
      return <TwitterIcon className={className} />;
    case SocialMediaPlatform.Facebook:
      return <FacebookIcon className={className} />;
    case SocialMediaPlatform.Instagram:
      return <InstagramIcon className={className} />;
    case SocialMediaPlatform.YouTube:
      return <YoutubeIcon className={className} />;
    case SocialMediaPlatform.Website:
      return <Globe className={className} />;
    default:
      return <Globe className={className} />;
  }
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
    <div
      className="group relative cursor-pointer break-inside-avoid rounded-sm transition-all hover:ring-2 hover:ring-indigo-400 hover:ring-offset-8"
      onClick={() => setActiveSection(sectionKey)}
    >
      {children}
      <div className="pointer-events-none absolute bottom-2 right-2 hidden rounded-md bg-indigo-400 px-2 py-1 text-xs text-white group-hover:block">
        Edit
      </div>
    </div>
  );
}

export function ClassyTemplate({
  ref,
}: {
  ref: React.RefObject<HTMLDivElement>;
}) {
  const order = useResumeStore((state) => state.order);

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
      className="mx-auto w-full max-w-4xl border bg-white p-4 shadow-lg sm:p-6 md:aspect-[1/1.4142] print:shadow-none"
    >
      <div className="flex flex-col gap-8">
        {order?.map((section) => {
          const SectionComponent = sectionMap[section.id];
          return <SectionComponent key={section.id} />;
        })}
      </div>
    </div>
  );
}

function HeaderSection() {
  const personalInfo = useResumeStore((state) => state.personalInfo);
  const settings = useResumeStore((state) => state.settings);
  console.log("settings", settings);
  return (
    <SectionWrapper sectionKey="personalInfo">
      <header className="">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="relative h-28 w-24 shrink-0 overflow-hidden rounded-md">
              <Image
                src={personalInfo?.imageUrl ?? "/avatars/user-image.png"}
                alt="Profile"
                fill
                className="object-cover object-center"
              />
            </div>

            <div className="flex flex-col gap-1">
              <h1
                className="text-lg font-medium"
                style={{ color: settings?.color }}
              >
                {personalInfo?.firstName} {personalInfo?.lastName}
              </h1>

              {personalInfo?.email && (
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Mail className="size-3 shrink-0" />
                  <span className="truncate">{personalInfo.email}</span>
                </div>
              )}
              {personalInfo?.phoneNumber && (
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Phone className="size-3 shrink-0" />
                  <span className="truncate">{personalInfo.phoneNumber}</span>
                </div>
              )}
              {(personalInfo?.city ?? personalInfo?.country) && (
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <MapPin className="mb-auto mt-1 size-3 shrink-0" />
                  <span className="text-wrap">
                    {[personalInfo.address, personalInfo.postalCode]
                      .filter(Boolean)
                      .join(", ")}{" "}
                    {[personalInfo.city, personalInfo.country]
                      .filter(Boolean)
                      .join(", ")}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-1 gap-2 text-sm text-muted-foreground sm:grid-cols-2 md:grid-cols-3">
          {personalInfo?.website && (
            <div className="group flex items-center gap-1">
              <Globe
                className="size-3 shrink-0"
                style={{ color: settings?.color }}
              />
              <a
                href={personalInfo.website}
                className="truncate"
                style={{ color: settings?.color }}
              >
                {personalInfo.website}
              </a>
            </div>
          )}
          {personalInfo?.dateOfBirth && (
            <div className="flex items-center gap-1">
              <Calendar className="size-3 shrink-0" />
              <span className="truncate">{personalInfo.dateOfBirth}</span>
            </div>
          )}
          {personalInfo?.nationality && (
            <div className="flex items-center gap-1">
              <Flag className="size-3 shrink-0" />
              <span className="truncate">{personalInfo.nationality}</span>
            </div>
          )}
        </div>

        {personalInfo?.bio && (
          <div
            dangerouslySetInnerHTML={{ __html: personalInfo.bio }}
            className="prose-sm mt-2 text-sm text-muted-foreground"
          ></div>
        )}
      </header>
    </SectionWrapper>
  );
}

function WorkExperienceSection() {
  const workExperience = useResumeStore((state) => state.workExperience);
  const settings = useResumeStore((state) => state.settings);
  return (
    <SectionWrapper sectionKey="workExperience">
      <section className="">
        <SectionHeading
          Icon={Briefcase}
          heading={workExperience?.title ?? "Work Experience"}
          color={settings?.color}
        />
        <div className="mt-4 flex flex-col gap-4">
          {workExperience?.items?.map((job, index) => (
            <Card key={index} className="p-4 shadow-none">
              <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-start">
                <div className="space-y-1">
                  <h3 className="font-semibold">{job?.position}</h3>
                  <div className="text-sm text-muted-foreground">
                    <span className="font-medium">{job?.companyName}</span>
                    {job?.city && job?.country && (
                      <span className="ml-1">
                        · {job.city}, {job.country}
                      </span>
                    )}
                  </div>
                </div>
                <div className="whitespace-nowrap text-sm text-muted-foreground">
                  {prettyDate(job?.startDate)} -{" "}
                  {job?.isCurrent ? "Present" : prettyDate(job?.endDate)}
                </div>
              </div>
              <div
                dangerouslySetInnerHTML={{
                  __html: job?.description ?? "",
                }}
                className="prose-sm mt-2 text-pretty text-sm text-muted-foreground"
              ></div>
            </Card>
          ))}
        </div>
      </section>
    </SectionWrapper>
  );
}

function EducationSection() {
  const education = useResumeStore((state) => state.education);
  const settings = useResumeStore((state) => state.settings);

  return (
    <SectionWrapper sectionKey="education">
      <section>
        <SectionHeading
          Icon={GraduationCap}
          heading={education?.title ?? "Education"}
          color={settings?.color}
        />
        <div className="mt-4 flex flex-col gap-4">
          {education?.items?.map((edu, index) => (
            <Card key={index} className="p-4 shadow-none">
              <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-start">
                <div className="space-y-1">
                  <h3 className="font-semibold">{edu?.degree}</h3>
                  <div className="text-sm text-muted-foreground">
                    <span className="font-medium">{edu?.institutionName}</span>
                    {edu?.city && <span className="ml-1">· {edu.city}</span>}
                  </div>
                  <div className="text-sm">{edu?.fieldOfStudy}</div>
                </div>
                <div className="whitespace-nowrap text-sm text-muted-foreground">
                  {prettyDate(edu?.startDate)} -{" "}
                  {edu?.isCurrentlyStudying
                    ? "Present"
                    : prettyDate(edu?.endDate)}
                </div>
              </div>
              <p
                dangerouslySetInnerHTML={{
                  __html: edu?.description ?? "",
                }}
                className="mt-2 text-pretty text-sm text-muted-foreground"
              />
            </Card>
          ))}
        </div>
      </section>
    </SectionWrapper>
  );
}

function SkillsSection() {
  const skills = useResumeStore((state) => state.skills);
  const settings = useResumeStore((state) => state.settings);

  return (
    <SectionWrapper sectionKey="skills">
      <section>
        <SectionHeading
          Icon={Wrench}
          heading={skills?.title ?? "Skills"}
          color={settings?.color}
        />
        <div className="mt-4 flex flex-col gap-4">
          {skills?.items?.map((skillGroup, index) => (
            <div key={index} className="space-y-2">
              <h3 className="font-medium">{skillGroup?.skillCategory}</h3>
              <div className="flex flex-wrap gap-2">
                {skillGroup?.skillTags?.map((skill, skillIndex) => (
                  <Badge
                    key={skillIndex}
                    variant="secondary"
                    className="text-xs"
                  >
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </SectionWrapper>
  );
}

function LanguagesSection() {
  const languages = useResumeStore((state) => state.languages);
  const settings = useResumeStore((state) => state.settings);

  return (
    <SectionWrapper sectionKey="languages">
      <section>
        <SectionHeading
          Icon={Languages}
          heading={languages?.title ?? "Languages"}
          color={settings?.color}
        />
        <div className="mt-4 flex flex-col gap-4">
          {languages?.items?.map((lang, index) => (
            <div key={index} className="flex items-center justify-between">
              <span className="text-sm">{lang?.language}</span>
              <Badge variant="outline" className="text-xs">
                {lang?.proficiency}
              </Badge>
            </div>
          ))}
        </div>
      </section>
    </SectionWrapper>
  );
}

function ProjectsSection() {
  const projects = useResumeStore((state) => state.projects);
  const settings = useResumeStore((state) => state.settings);

  return (
    <SectionWrapper sectionKey="projects">
      <section>
        <SectionHeading
          Icon={FolderGit}
          heading={projects?.title ?? "Projects"}
          color={settings?.color}
        />
        <div className="mt-4 flex flex-col gap-4">
          {projects?.items?.map((project, index) => (
            <Card key={index} className="p-4 shadow-none">
              <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-start">
                <div className="space-y-1">
                  <h3 className="flex items-center gap-2 font-semibold">
                    {project?.projectName}
                    {project?.projectLink && (
                      <a
                        href={project.projectLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: settings?.color }}
                      >
                        <LinkIcon className="h-4 w-4 shrink-0" />
                      </a>
                    )}
                  </h3>
                  {(project?.city ?? project?.country) && (
                    <div className="text-sm text-muted-foreground">
                      {[project?.city, project?.country]
                        .filter(Boolean)
                        .join(", ")}
                    </div>
                  )}
                </div>
                <div className="whitespace-nowrap text-sm text-muted-foreground">
                  {prettyDate(project?.startDate)} -{" "}
                  {project?.isCurrent
                    ? "Present"
                    : prettyDate(project?.endDate)}
                </div>
              </div>
              <p
                dangerouslySetInnerHTML={{
                  __html: project?.description ?? "",
                }}
                className="mt-2 text-pretty text-sm text-muted-foreground"
              />
            </Card>
          ))}
        </div>
      </section>
    </SectionWrapper>
  );
}

function CertificationsSection() {
  const certifications = useResumeStore((state) => state.certifications);
  const settings = useResumeStore((state) => state.settings);

  return (
    <SectionWrapper sectionKey="certifications">
      <section>
        <SectionHeading
          Icon={Award}
          heading={certifications?.title ?? "Certifications"}
          color={settings?.color}
        />
        <div className="mt-4 flex flex-col gap-4">
          {certifications?.items?.map((cert, index) => (
            <Card key={index} className="p-4 shadow-none">
              <div className="space-y-2">
                <div className="flex flex-col gap-1">
                  <h3 className="font-semibold">{cert?.certificationName}</h3>
                  <div className="text-sm text-muted-foreground">
                    {cert?.certificationAuthority}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {prettyDate(cert?.certificationDate)}
                  </div>
                </div>
                {cert?.description && (
                  <p className="text-pretty text-sm">{cert.description}</p>
                )}
                {cert?.certificationLink && (
                  <a
                    href={cert.certificationLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-sm"
                    style={{ color: settings?.color }}
                  >
                    <LinkIcon className="h-4 w-4 shrink-0" />
                    View Certificate
                  </a>
                )}
              </div>
            </Card>
          ))}
        </div>
      </section>
    </SectionWrapper>
  );
}

function AchievementsSection() {
  const achievements = useResumeStore((state) => state.achievements);
  const settings = useResumeStore((state) => state.settings);
  return (
    <SectionWrapper sectionKey="achievements">
      <section>
        <SectionHeading
          Icon={Award}
          heading={achievements?.title ?? "Achievements"}
          color={settings?.color}
        />
        <div className="mt-4 flex flex-col gap-4">
          {achievements?.items?.map((achievement, index) => (
            <Card key={index} className="p-4 shadow-none">
              <div className="flex items-start justify-between">
                <h3 className="font-semibold">
                  {achievement?.achievementTitle}
                </h3>
                <div className="text-sm text-muted-foreground">
                  {prettyDate(achievement?.achievementDate)}
                </div>
              </div>
              <div
                dangerouslySetInnerHTML={{
                  __html: achievement?.achievementDescription ?? "",
                }}
                className="mt-2 text-pretty text-sm"
              ></div>
            </Card>
          ))}
        </div>
      </section>
    </SectionWrapper>
  );
}

function GoalsSection() {
  const goals = useResumeStore((state) => state.goals);
  const settings = useResumeStore((state) => state.settings);

  return (
    <SectionWrapper sectionKey="goals">
      <section>
        <SectionHeading
          Icon={Target}
          heading={goals?.title ?? "Goals"}
          color={settings?.color}
        />
        <div className="mt-4 flex flex-col gap-4">
          {goals?.items?.map((item, index) => (
            <div key={index} className="flex items-start gap-2">
              <Dot className="mt-1 h-4 w-4 shrink-0" />
              <p>{item.goal}</p>
            </div>
          ))}
        </div>
      </section>
    </SectionWrapper>
  );
}

function VoluntaryWorkSection() {
  const voluntaryWork = useResumeStore((state) => state.voluntaryWork);
  const settings = useResumeStore((state) => state.settings);

  return (
    <SectionWrapper sectionKey="voluntaryWork">
      <section>
        <SectionHeading
          Icon={Heart}
          heading={voluntaryWork?.title ?? "Voluntary Work"}
          color={settings?.color}
        />
        <div className="mt-4 flex flex-col gap-4">
          {voluntaryWork?.items?.map((work, index) => (
            <Card key={index} className="p-4 shadow-none">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold">{work?.role}</h3>
                  <div className="text-sm text-muted-foreground">
                    {work?.organizationName}
                  </div>
                </div>
                <div className="text-sm text-muted-foreground">
                  {prettyDate(work?.startDate)} -{" "}
                  {work?.isCurrent ? "Present" : prettyDate(work?.endDate)}
                </div>
              </div>
              {work?.description && (
                <p className="mt-2 text-sm">{work.description}</p>
              )}
            </Card>
          ))}
        </div>
      </section>
    </SectionWrapper>
  );
}

function AwardsSection() {
  const awards = useResumeStore((state) => state.awards);
  const settings = useResumeStore((state) => state.settings);

  return (
    <SectionWrapper sectionKey="awards">
      <section>
        <SectionHeading
          Icon={Trophy}
          heading={awards?.title ?? "Awards"}
          color={settings?.color}
        />
        <div className="mt-4 flex flex-col gap-4">
          {awards?.items?.map((award, index) => (
            <Card key={index} className="p-4 shadow-none">
              <div className="flex items-start justify-between">
                <h3 className="font-semibold">{award?.title}</h3>
                <div className="text-sm text-muted-foreground">
                  {prettyDate(award?.date)}
                </div>
              </div>
              <div className="text-sm text-muted-foreground">
                {award?.issuer}
              </div>
              <div
                dangerouslySetInnerHTML={{
                  __html: award?.description ?? "",
                }}
                className="mt-2 text-pretty text-sm"
              ></div>
              {award?.url && (
                <a
                  href={award.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-flex items-center gap-1 text-sm"
                  style={{ color: settings?.color }}
                >
                  <LinkIcon className="h-4 w-4" />
                  View Award
                </a>
              )}
            </Card>
          ))}
        </div>
      </section>
    </SectionWrapper>
  );
}

function ReferencesSection() {
  const references = useResumeStore((state) => state.references);
  const settings = useResumeStore((state) => state.settings);

  return (
    <SectionWrapper sectionKey="references">
      <section>
        <SectionHeading
          Icon={Users}
          heading={references?.title ?? "References"}
          color={settings?.color}
        />
        <div className="mt-4 flex flex-col gap-4">
          {references?.items?.map((ref, index) => (
            <Card key={index} className="p-4 shadow-none">
              <h3 className="font-semibold">{ref?.name}</h3>
              <div className="text-sm text-muted-foreground">
                {ref?.position} {ref?.company && `at ${ref.company}`}
              </div>
              {ref?.relationship && (
                <div className="mt-1 text-sm">{ref.relationship}</div>
              )}
              <div className="mt-2 flex flex-col gap-1 text-sm">
                {ref?.email && (
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    {ref.email}
                  </div>
                )}
                {ref?.phoneNumber && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    {ref.phoneNumber}
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      </section>
    </SectionWrapper>
  );
}

function PublicationsSection() {
  const publications = useResumeStore((state) => state.publications);
  const settings = useResumeStore((state) => state.settings);

  return (
    <SectionWrapper sectionKey="publications">
      <section>
        <SectionHeading
          Icon={BookOpen}
          heading={publications?.title ?? "Publications"}
          color={settings?.color}
        />
        <div className="mt-4 flex flex-col gap-4">
          {publications?.items?.map((pub, index) => (
            <Card key={index} className="p-4 shadow-none">
              <div className="flex items-start justify-between">
                <h3 className="font-semibold">{pub?.title}</h3>
                <div className="text-sm text-muted-foreground">
                  {prettyDate(pub?.date)}
                </div>
              </div>
              {pub?.description && (
                <p className="mt-2 text-sm">{pub.description}</p>
              )}
              {pub?.url && (
                <a
                  href={pub.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-flex items-center gap-1 text-sm"
                  style={{ color: settings?.color }}
                >
                  <LinkIcon className="h-4 w-4" />
                  View Publication
                </a>
              )}
            </Card>
          ))}
        </div>
      </section>
    </SectionWrapper>
  );
}

function SocialMediaSection() {
  const socialMedia = useResumeStore((state) => state.socialMedia);
  const settings = useResumeStore((state) => state.settings);

  return (
    <SectionWrapper sectionKey="socialMedia">
      <section>
        <SectionHeading
          Icon={Share2}
          heading={socialMedia?.title ?? "Social Media"}
          color={settings?.color}
        />
        <div className="mt-4 flex flex-col gap-4">
          {socialMedia?.items?.map((item, index) => (
            <a
              key={index}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm"
              style={{ color: settings?.color }}
            >
              <SocialIcon
                platform={item.platform}
                className="h-4 w-4 shrink-0"
              />
              <span className="truncate">{item.platform}</span>
            </a>
          ))}
        </div>
      </section>
    </SectionWrapper>
  );
}

export const SectionHeading = ({
  Icon,
  heading,
  color,
}: {
  Icon: LucideIcon;
  heading: string;
  color?: string;
}) => {
  return (
    <div className="flex items-center gap-2 text-2xl font-semibold">
      <Icon className="size-5 shrink-0" />
      <h3 className="text-lg" style={{ color }}>
        {heading}
      </h3>
    </div>
  );
};
