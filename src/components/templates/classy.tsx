import type { SectionKeys } from "@/server/db/schema";
import { SocialMediaPlatform } from "@/server/db/schema";
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
  BarChart,
  Trophy,
  Users,
  BookOpen,
  Share2,
  FileText,
  Dot,
  Globe,
  Heading,
} from "lucide-react";

import {
  LinkedinIcon,
  TwitterIcon,
  FacebookIcon,
  InstagramIcon,
  YoutubeIcon,
} from "lucide-react";

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

export function ClassyTemplate() {
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
    graphs: GraphsSection,
    awards: AwardsSection,
    references: ReferencesSection,
    publications: PublicationsSection,
    socialMedia: SocialMediaSection,
    customSections: CustomSectionsSection,
  };

  return (
    <div className="mx-auto aspect-[1/1.4142] max-w-4xl border bg-white p-6 shadow-lg lg:w-[600px]">
      {order?.map((section) => {
        const SectionComponent = sectionMap[section];
        return <SectionComponent key={section} />;
      })}
    </div>
  );
}

function HeaderSection() {
  const personalInfo = useResumeStore((state) => state.personalInfo);
  const settings = useResumeStore((state) => state.settings);
  const personalInfoVisible = useResumeStore(
    (state) => state.personalInfoVisible,
  );

  if (!personalInfoVisible) return null;

  return (
    <header className="mb-8">
      <h2
        className="flex items-center gap-2 text-2xl font-semibold"
        style={{ color: settings?.color }}
      >
        <Heading />
        {personalInfo?.title}
      </h2>
      <h1 className="text-4xl font-bold" style={{ color: settings?.color }}>
        {personalInfo?.titleAfter} {personalInfo?.firstName}{" "}
        {personalInfo?.lastName}
      </h1>
      <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
        {personalInfo?.email && (
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            <span>{personalInfo.email}</span>
          </div>
        )}
        {personalInfo?.phoneNumber && (
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4" />
            <span>{personalInfo.phoneNumber}</span>
          </div>
        )}
        {personalInfo?.location && (
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            <span>{personalInfo.location}</span>
          </div>
        )}
        {personalInfo?.website && (
          <div className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            <a href={personalInfo.website} className="hover:text-primary">
              {personalInfo.website}
            </a>
          </div>
        )}
      </div>
      {personalInfo?.bio && (
        <p className="mt-4 truncate text-wrap text-muted-foreground">
          {personalInfo.bio}
        </p>
      )}
    </header>
  );
}

function WorkExperienceSection() {
  const workExperience = useResumeStore((state) => state.workExperience);
  const settings = useResumeStore((state) => state.settings);
  const workExperienceVisible = useResumeStore(
    (state) => state.workExperienceVisible,
  );

  if (!workExperienceVisible) return null;

  return (
    <section className="mb-8">
      <h2
        className="mb-4 flex items-center gap-2 text-2xl font-semibold"
        style={{ color: settings?.color }}
      >
        <Briefcase className="h-5 w-5" />
        {workExperience?.title}
      </h2>
      <div className="space-y-4">
        {workExperience?.items?.map((job, index) => (
          <Card key={index} className="p-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold">{job?.position}</h3>
                <div className="text-sm text-muted-foreground">
                  <span className="font-medium">{job?.companyName}</span>
                  {job?.city && job?.country && (
                    <span>
                      {" "}
                      · {job.city}, {job.country}
                    </span>
                  )}
                </div>
              </div>
              <div className="text-sm text-muted-foreground">
                {job?.startDate} - {job?.isCurrent ? "Present" : job?.endDate}
              </div>
            </div>
            <p className="mt-2 text-sm">{job?.description}</p>
          </Card>
        ))}
      </div>
    </section>
  );
}

function EducationSection() {
  const education = useResumeStore((state) => state.education);
  const settings = useResumeStore((state) => state.settings);
  const educationVisible = useResumeStore((state) => state.educationVisible);

  if (!educationVisible) return null;

  return (
    <section className="mb-8">
      <h2
        className="mb-4 flex items-center gap-2 text-2xl font-semibold"
        style={{ color: settings?.color }}
      >
        <GraduationCap className="size-6" />
        {education?.title}
      </h2>
      <div className="space-y-4">
        {education?.items?.map((edu, index) => (
          <Card key={index} className="p-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold">{edu?.degree}</h3>
                <div className="text-sm text-muted-foreground">
                  <span className="font-medium">{edu?.institutionName}</span>
                  {edu?.city && <span> · {edu.city}</span>}
                </div>
                <div className="text-sm">{edu?.fieldOfStudy}</div>
              </div>
              <div className="text-sm text-muted-foreground">
                {edu?.startDate} -{" "}
                {edu?.isCurrentlyStudying ? "Present" : edu?.endDate}
              </div>
            </div>
            <p className="mt-2 text-sm">{edu?.description}</p>
          </Card>
        ))}
      </div>
    </section>
  );
}

function SkillsSection() {
  const skills = useResumeStore((state) => state.skills);
  const settings = useResumeStore((state) => state.settings);
  const skillsVisible = useResumeStore((state) => state.skillsVisible);

  if (!skillsVisible) return null;

  return (
    <section className="mb-8">
      <h2
        className="mb-4 flex items-center gap-2 text-2xl font-semibold"
        style={{ color: settings?.color }}
      >
        <Wrench className="h-5 w-5" />
        {skills?.title}
      </h2>
      <div className="space-y-4">
        {skills?.items?.map((skillGroup, index) => (
          <div key={index}>
            <h3 className="mb-2 font-medium">{skillGroup?.skillCategory}</h3>
            <div className="flex flex-wrap gap-2">
              {skillGroup?.skillTags?.map((skill, skillIndex) => (
                <Badge key={skillIndex} variant="secondary">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function LanguagesSection() {
  const languages = useResumeStore((state) => state.languages);
  const settings = useResumeStore((state) => state.settings);
  const languagesVisible = useResumeStore((state) => state.languagesVisible);

  if (!languagesVisible) return null;

  return (
    <section className="mb-8">
      <h2
        className="mb-4 flex items-center gap-2 text-2xl font-semibold"
        style={{ color: settings?.color }}
      >
        <Languages className="h-5 w-5" />
        {languages?.title}
      </h2>
      <div className="grid grid-cols-2 gap-4">
        {languages?.items?.map((lang, index) => (
          <div key={index} className="flex items-center justify-between">
            <span>{lang?.language}</span>
            <Badge variant="outline">{lang?.proficiency}</Badge>
          </div>
        ))}
      </div>
    </section>
  );
}

function ProjectsSection() {
  const projects = useResumeStore((state) => state.projects);
  const settings = useResumeStore((state) => state.settings);
  const projectsVisible = useResumeStore((state) => state.projectsVisible);

  if (!projectsVisible) return null;

  return (
    <section className="mb-8">
      <h2
        className="mb-4 flex items-center gap-2 text-2xl font-semibold"
        style={{ color: settings?.color }}
      >
        <FolderGit className="h-5 w-5" />
        {projects?.title}
      </h2>
      <div className="space-y-4">
        {projects?.items?.map((project, index) => (
          <Card key={index} className="p-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="flex items-center gap-2 font-semibold">
                  {project?.projectName}
                  {project?.projectLink && (
                    <a
                      href={project.projectLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:text-primary/80"
                    >
                      <LinkIcon className="h-4 w-4" />
                    </a>
                  )}
                </h3>
                {(project?.city ?? project?.country) && (
                  <div className="text-sm text-muted-foreground">
                    {project?.city}, {project?.country}
                  </div>
                )}
              </div>
              <div className="text-sm text-muted-foreground">
                {project?.startDate} -{" "}
                {project?.isCurrent ? "Present" : project?.endDate}
              </div>
            </div>
            <p className="mt-2 text-sm">{project?.description}</p>
          </Card>
        ))}
      </div>
    </section>
  );
}

function CertificationsSection() {
  const certifications = useResumeStore((state) => state.certifications);
  const settings = useResumeStore((state) => state.settings);
  const certificationsVisible = useResumeStore(
    (state) => state.certificationsVisible,
  );

  if (!certificationsVisible) return null;

  return (
    <section className="mb-8">
      <h2
        className="mb-4 flex items-center gap-2 text-2xl font-semibold"
        style={{ color: settings?.color }}
      >
        <Award className="h-5 w-5" />
        {certifications?.title}
      </h2>
      <div className="space-y-4">
        {certifications?.items?.map((cert, index) => (
          <Card key={index} className="p-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold">{cert?.certificationName}</h3>
                <div className="text-sm text-muted-foreground">
                  {cert?.certificationAuthority}
                </div>
              </div>
              <div className="text-sm text-muted-foreground">
                {cert?.certificationDate}
              </div>
            </div>
            {cert?.description && (
              <p className="mt-2 text-sm">{cert.description}</p>
            )}
            {cert?.certificationLink && (
              <a
                href={cert.certificationLink}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-flex items-center gap-1 text-sm text-primary hover:text-primary/80"
              >
                <LinkIcon className="h-4 w-4" />
                View Certificate
              </a>
            )}
          </Card>
        ))}
      </div>
    </section>
  );
}

function AchievementsSection() {
  const achievements = useResumeStore((state) => state.achievements);
  const settings = useResumeStore((state) => state.settings);
  const achievementsVisible = useResumeStore(
    (state) => state.achievementsVisible,
  );

  // if (!achievementsVisible) return null;

  return (
    <section className="mb-8">
      <h2
        className="mb-4 flex items-center gap-2 text-2xl font-semibold"
        style={{ color: settings?.color }}
      >
        <Award className="h-5 w-5" />
        {achievements?.title}
      </h2>
      <div className="space-y-4">
        {achievements?.items?.map((achievement, index) => (
          <Card key={index} className="p-4">
            <div className="flex items-start justify-between">
              <h3 className="font-semibold">{achievement?.achievementTitle}</h3>
              <div className="text-sm text-muted-foreground">
                {achievement?.achievementDate}
              </div>
            </div>
            <p className="mt-2 text-sm">
              {achievement?.achievementDescription}
            </p>
          </Card>
        ))}
      </div>
    </section>
  );
}

function GoalsSection() {
  const goals = useResumeStore((state) => state.goals);
  const settings = useResumeStore((state) => state.settings);
  const goalsVisible = useResumeStore((state) => state.goalsVisible);

  if (!goalsVisible) return null;

  return (
    <section className="mb-8">
      <h2
        className="mb-4 flex items-center gap-2 text-2xl font-semibold"
        style={{ color: settings?.color }}
      >
        <Target className="h-5 w-5" />
        {goals?.title ?? "Goals"}
      </h2>
      <div className="space-y-2">
        {goals?.items?.map((item, index) => (
          <div key={index} className="flex items-start gap-2">
            <Dot className="mt-1 h-4 w-4 shrink-0" />
            <p>{item.goal}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function VoluntaryWorkSection() {
  const voluntaryWork = useResumeStore((state) => state.voluntaryWork);
  const settings = useResumeStore((state) => state.settings);
  const voluntaryWorkVisible = useResumeStore(
    (state) => state.voluntaryWorkVisible,
  );

  if (!voluntaryWorkVisible) return null;

  return (
    <section className="mb-8">
      <h2
        className="mb-4 flex items-center gap-2 text-2xl font-semibold"
        style={{ color: settings?.color }}
      >
        <Heart className="h-5 w-5" />
        {voluntaryWork?.title ?? "Voluntary Work"}
      </h2>
      <div className="space-y-4">
        {voluntaryWork?.items?.map((work, index) => (
          <Card key={index} className="p-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold">{work?.role}</h3>
                <div className="text-sm text-muted-foreground">
                  {work?.organizationName}
                </div>
              </div>
              <div className="text-sm text-muted-foreground">
                {work?.startDate} -{" "}
                {work?.isCurrent ? "Present" : work?.endDate}
              </div>
            </div>
            {work?.description && (
              <p className="mt-2 text-sm">{work.description}</p>
            )}
          </Card>
        ))}
      </div>
    </section>
  );
}

function GraphsSection() {
  const graphs = useResumeStore((state) => state.graphs);
  const settings = useResumeStore((state) => state.settings);
  const graphsVisible = useResumeStore((state) => state.graphsVisible);

  if (!graphsVisible) return null;

  return (
    <section className="mb-8">
      <h2
        className="mb-4 flex items-center gap-2 text-2xl font-semibold"
        style={{ color: settings?.color }}
      >
        <BarChart className="h-5 w-5" />
        {graphs?.title}
      </h2>
      <div className="space-y-4">
        {graphs?.items?.map((graph, index) => (
          <div key={index}>
            {/* Note: You'll need to implement actual graph rendering based on graphType and graphData */}
            <div className="rounded-lg border p-4">
              <div>{graph.graphType}</div>
              <div>{graph.graphData}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function AwardsSection() {
  const awards = useResumeStore((state) => state.awards);
  const settings = useResumeStore((state) => state.settings);
  const awardsVisible = useResumeStore((state) => state.awardsVisible);

  if (!awardsVisible) return null;

  return (
    <section className="mb-8">
      <h2
        className="mb-4 flex items-center gap-2 text-2xl font-semibold"
        style={{ color: settings?.color }}
      >
        <Trophy className="h-5 w-5" />
        {awards?.title}
      </h2>
      <div className="space-y-4">
        {awards?.items?.map((award, index) => (
          <Card key={index} className="p-4">
            <div className="flex items-start justify-between">
              <h3 className="font-semibold">{award?.title}</h3>
              <div className="text-sm text-muted-foreground">{award?.date}</div>
            </div>
            <div className="text-sm text-muted-foreground">{award?.issuer}</div>
            {award?.description && (
              <p className="mt-2 text-sm">{award.description}</p>
            )}
            {award?.url && (
              <a
                href={award.url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-flex items-center gap-1 text-sm text-primary hover:text-primary/80"
              >
                <LinkIcon className="h-4 w-4" />
                View Award
              </a>
            )}
          </Card>
        ))}
      </div>
    </section>
  );
}

function ReferencesSection() {
  const references = useResumeStore((state) => state.references);
  const settings = useResumeStore((state) => state.settings);
  const referencesVisible = useResumeStore((state) => state.referencesVisible);

  if (!referencesVisible) return null;

  return (
    <section className="mb-8">
      <h2
        className="mb-4 flex items-center gap-2 text-2xl font-semibold"
        style={{ color: settings?.color }}
      >
        <Users className="h-5 w-5" />
        {references?.title}
      </h2>
      <div className="grid gap-4 md:grid-cols-2">
        {references?.items?.map((ref, index) => (
          <Card key={index} className="p-4">
            <h3 className="font-semibold">{ref?.name}</h3>
            <div className="text-sm text-muted-foreground">
              {ref?.position} {ref?.company && `at ${ref.company}`}
            </div>
            {ref?.relationship && (
              <div className="mt-1 text-sm">{ref.relationship}</div>
            )}
            <div className="mt-2 space-y-1 text-sm">
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
  );
}

function PublicationsSection() {
  const publications = useResumeStore((state) => state.publications);
  const settings = useResumeStore((state) => state.settings);
  const publicationsVisible = useResumeStore(
    (state) => state.publicationsVisible,
  );

  if (!publicationsVisible) return null;

  return (
    <section className="mb-8">
      <h2
        className="mb-4 flex items-center gap-2 text-2xl font-semibold"
        style={{ color: settings?.color }}
      >
        <BookOpen className="h-5 w-5" />
        {publications?.title}
      </h2>
      <div className="space-y-4">
        {publications?.items?.map((pub, index) => (
          <Card key={index} className="p-4">
            <div className="flex items-start justify-between">
              <h3 className="font-semibold">{pub?.title}</h3>
              <div className="text-sm text-muted-foreground">{pub?.date}</div>
            </div>
            {pub?.description && (
              <p className="mt-2 text-sm">{pub.description}</p>
            )}
            {pub?.url && (
              <a
                href={pub.url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-flex items-center gap-1 text-sm text-primary hover:text-primary/80"
              >
                <LinkIcon className="h-4 w-4" />
                View Publication
              </a>
            )}
          </Card>
        ))}
      </div>
    </section>
  );
}

function SocialMediaSection() {
  const socialMedia = useResumeStore((state) => state.socialMedia);
  const settings = useResumeStore((state) => state.settings);
  const socialMediaVisible = useResumeStore(
    (state) => state.socialMediaVisible,
  );

  if (!socialMediaVisible) return null;

  return (
    <section className="mb-8">
      <h2
        className="mb-4 flex items-center gap-2 text-2xl font-semibold"
        style={{ color: settings?.color }}
      >
        <Share2 className="h-5 w-5" />
        {socialMedia?.title}
      </h2>
      <div className="grid gap-4 sm:grid-cols-2">
        {socialMedia?.items?.map((item, index) => (
          <a
            key={index}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-primary hover:text-primary/80"
          >
            <SocialIcon platform={item.platform} />
            <span>{item.platform}</span>
          </a>
        ))}
      </div>
    </section>
  );
}

function CustomSectionsSection() {
  const customSections = useResumeStore((state) => state.customSections);
  const settings = useResumeStore((state) => state.settings);
  const customSectionsVisible = useResumeStore(
    (state) => state.customSectionsVisible,
  );

  if (!customSectionsVisible) return null;

  return (
    <section className="mb-8">
      <h2
        className="mb-4 flex items-center gap-2 text-2xl font-semibold"
        style={{ color: settings?.color }}
      >
        <FileText className="h-5 w-5" />
        {customSections?.title}
      </h2>
      <div className="space-y-4">
        {customSections?.items?.map((section, index) => (
          <Card key={index} className="p-4">
            <h3 className="font-semibold">{section?.title}</h3>
            <div className="mt-2">
              {/* Render content based on its type */}
              {typeof section?.content === "string" ? (
                <p className="text-sm">{section?.content}</p>
              ) : (
                <pre className="text-sm">
                  {JSON.stringify(section?.content, null, 2)}
                </pre>
              )}
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}
