import type { SectionKeys } from "@/server/db/schema";
import { prettyDate } from "@/lib/utils";
import Image from "next/image";
import { useResumeStore } from "@/store/resume/data-store";
import {
  Mail, Phone, MapPin, Globe, Calendar, Flag,
  type LucideIcon,
} from "lucide-react";

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
      className="group relative cursor-pointer break-inside-avoid"
      onClick={() => setActiveSection(sectionKey)}
    >
      {children}
      <div className="pointer-events-none absolute bottom-2 right-2 hidden bg-indigo-400 px-2 py-1 text-xs text-white group-hover:block">
        Edit
      </div>
    </div>
  );
}

export function BaseTemplate({
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
      className="mx-auto w-full max-w-4xl bg-white p-4 md:aspect-[1/1.4142]"
      id="resume-container"
    >
      <div className="flex flex-col" id="resume-content">
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

  return (
    <SectionWrapper sectionKey="personalInfo">
      <header id="personal-info">
        <div id="personal-info-main">
          <div id="personal-info-image">
            <Image
              src={personalInfo?.imageUrl ?? "/avatars/user-image.png"}
              alt="Profile"
              fill
              className="object-cover"
            />
          </div>

          <div id="personal-info-primary">
            <h1 id="personal-info-name">
              {personalInfo?.firstName} {personalInfo?.lastName}
            </h1>

            {personalInfo?.email && (
              <div id="personal-info-email">
                <Mail className="shrink-0" />
                <span>{personalInfo.email}</span>
              </div>
            )}
            {personalInfo?.phoneNumber && (
              <div id="personal-info-phone">
                <Phone className="shrink-0" />
                <span>{personalInfo.phoneNumber}</span>
              </div>
            )}
            {(personalInfo?.city ?? personalInfo?.country) && (
              <div id="personal-info-location">
                <MapPin className="shrink-0" />
                <span>
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

        <div id="personal-info-secondary">
          {personalInfo?.website && (
            <div id="personal-info-website">
              <Globe className="shrink-0" />
              <a href={personalInfo.website}>{personalInfo.website}</a>
            </div>
          )}
          {personalInfo?.dateOfBirth && (
            <div id="personal-info-dob">
              <Calendar className="shrink-0" />
              <span>{personalInfo.dateOfBirth}</span>
            </div>
          )}
          {personalInfo?.nationality && (
            <div id="personal-info-nationality">
              <Flag className="shrink-0" />
              <span>{personalInfo.nationality}</span>
            </div>
          )}
        </div>

        {personalInfo?.bio && (
          <div
            id="personal-info-bio"
            dangerouslySetInnerHTML={{ __html: personalInfo.bio }}
          />
        )}
      </header>
    </SectionWrapper>
  );
}

function WorkExperienceSection() {
  const workExperience = useResumeStore((state) => state.workExperience);

  return (
    <SectionWrapper sectionKey="workExperience">
      <section id="work-experience">
        <h2 id="work-experience-title">
          {workExperience?.title ?? "Work Experience"}
        </h2>
        <div id="work-experience-items">
          {workExperience?.items?.map((job, index) => (
            <div key={index} id={`work-item-${index}`}>
              <div id={`work-item-${index}-header`}>
                <div>
                  <h3>{job?.position}</h3>
                  <div>
                    <span>{job?.companyName}</span>
                    {job?.city && job?.country && (
                      <span>
                        · {job.city}, {job.country}
                      </span>
                    )}
                  </div>
                </div>
                <div>
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

  return (
    <SectionWrapper sectionKey="education">
      <section id="education">
        <h2 id="education-title">{education?.title ?? "Education"}</h2>
        <div id="education-items">
          {education?.items?.map((edu, index) => (
            <div key={index} id={`education-item-${index}`}>
              <div id={`education-item-${index}-header`}>
                <div>
                  <h3>{edu?.degree}</h3>
                  <div>
                    <span>{edu?.institutionName}</span>
                    {edu?.city && <span>· {edu.city}</span>}
                  </div>
                  <div>{edu?.fieldOfStudy}</div>
                </div>
                <div>
                  {prettyDate(edu?.startDate)} -{" "}
                  {edu?.isCurrentlyStudying ? "Present" : prettyDate(edu?.endDate)}
                </div>
              </div>
              <div
                dangerouslySetInnerHTML={{
                  __html: edu?.description ?? "",
                }}
              />
            </div>
          ))}
        </div>
      </section>
    </SectionWrapper>
  );
}

function SkillsSection() {
  const skills = useResumeStore((state) => state.skills);

  return (
    <SectionWrapper sectionKey="skills">
      <section id="skills">
        <h2 id="skills-title">{skills?.title ?? "Skills"}</h2>
        <div id="skills-items">
          {skills?.items?.map((skillGroup, index) => (
            <div key={index} id={`skill-group-${index}`}>
              <h3>{skillGroup?.skillCategory}</h3>
              <div id={`skill-group-${index}-tags`}>
                {skillGroup?.skillTags?.map((skill, skillIndex) => (
                  <span key={skillIndex} className="skill-tag">
                    {skill}
                  </span>
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

  return (
    <SectionWrapper sectionKey="languages">
      <section id="languages">
        <h2 id="languages-title">{languages?.title ?? "Languages"}</h2>
        <div id="languages-items">
          {languages?.items?.map((lang, index) => (
            <div key={index} id={`language-item-${index}`}>
              <span>{lang?.language}</span>
              <span>{lang?.proficiency}</span>
            </div>
          ))}
        </div>
      </section>
    </SectionWrapper>
  );
}

function ProjectsSection() {
  const projects = useResumeStore((state) => state.projects);

  return (
    <SectionWrapper sectionKey="projects">
      <section id="projects">
        <h2 id="projects-title">{projects?.title ?? "Projects"}</h2>
        <div id="projects-items">
          {projects?.items?.map((project, index) => (
            <div key={index} id={`project-item-${index}`}>
              <div id={`project-item-${index}-header`}>
                <div>
                  <h3>
                    {project?.projectName}
                    {project?.projectLink && (
                      <a
                        href={project.projectLink}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <LinkIcon className="shrink-0" />
                      </a>
                    )}
                  </h3>
                  {(project?.city ?? project?.country) && (
                    <div>
                      {[project?.city, project?.country].filter(Boolean).join(", ")}
                    </div>
                  )}
                </div>
                <div>
                  {prettyDate(project?.startDate)} -{" "}
                  {project?.isCurrent ? "Present" : prettyDate(project?.endDate)}
                </div>
              </div>
              <div
                dangerouslySetInnerHTML={{
                  __html: project?.description ?? "",
                }}
              />
            </div>
          ))}
        </div>
      </section>
    </SectionWrapper>
  );
}

function CertificationsSection() {
  const certifications = useResumeStore((state) => state.certifications);

  return (
    <SectionWrapper sectionKey="certifications">
      <section id="certifications">
        <h2 id="certifications-title">
          {certifications?.title ?? "Certifications"}
        </h2>
        <div id="certifications-items">
          {certifications?.items?.map((cert, index) => (
            <div key={index} id={`certification-item-${index}`}>
              <div>
                <h3>{cert?.certificationName}</h3>
                <div>{cert?.certificationAuthority}</div>
                <div>{prettyDate(cert?.certificationDate)}</div>
              </div>
              {cert?.description && <div>{cert.description}</div>}
              {cert?.certificationLink && (
                <a
                  href={cert.certificationLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <LinkIcon className="shrink-0" />
                  View Certificate
                </a>
              )}
            </div>
          ))}
        </div>
      </section>
    </SectionWrapper>
  );
}

function AchievementsSection() {
  const achievements = useResumeStore((state) => state.achievements);

  return (
    <SectionWrapper sectionKey="achievements">
      <section id="achievements">
        <h2 id="achievements-title">
          {achievements?.title ?? "Achievements"}
        </h2>
        <div id="achievements-items">
          {achievements?.items?.map((achievement, index) => (
            <div key={index} id={`achievement-item-${index}`}>
              <div>
                <h3>{achievement?.achievementTitle}</h3>
                <div>{prettyDate(achievement?.achievementDate)}</div>
              </div>
              <div
                dangerouslySetInnerHTML={{
                  __html: achievement?.achievementDescription ?? "",
                }}
              />
            </div>
          ))}
        </div>
      </section>
    </SectionWrapper>
  );
}

function GoalsSection() {
  const goals = useResumeStore((state) => state.goals);

  return (
    <SectionWrapper sectionKey="goals">
      <section id="goals">
        <h2 id="goals-title">{goals?.title ?? "Goals"}</h2>
        <div id="goals-items">
          {goals?.items?.map((item, index) => (
            <div key={index} id={`goal-item-${index}`}>
              <span>{item.goal}</span>
            </div>
          ))}
        </div>
      </section>
    </SectionWrapper>
  );
}

function VoluntaryWorkSection() {
  const voluntaryWork = useResumeStore((state) => state.voluntaryWork);

  return (
    <SectionWrapper sectionKey="voluntaryWork">
      <section id="voluntary-work">
        <h2 id="voluntary-work-title">
          {voluntaryWork?.title ?? "Voluntary Work"}
        </h2>
        <div id="voluntary-work-items">
          {voluntaryWork?.items?.map((work, index) => (
            <div key={index} id={`voluntary-work-item-${index}`}>
              <div>
                <h3>{work?.role}</h3>
                <div>{work?.organizationName}</div>
              </div>
              <div>
                {prettyDate(work?.startDate)} -{" "}
                {work?.isCurrent ? "Present" : prettyDate(work?.endDate)}
              </div>
              {work?.description && <div>{work.description}</div>}
            </div>
          ))}
        </div>
      </section>
    </SectionWrapper>
  );
}

function AwardsSection() {
  const awards = useResumeStore((state) => state.awards);

  return (
    <SectionWrapper sectionKey="awards">
      <section id="awards">
        <h2 id="awards-title">{awards?.title ?? "Awards"}</h2>
        <div id="awards-items">
          {awards?.items?.map((award, index) => (
            <div key={index} id={`award-item-${index}`}>
              <div>
                <h3>{award?.title}</h3>
                <div>{prettyDate(award?.date)}</div>
              </div>
              <div>{award?.issuer}</div>
              <div
                dangerouslySetInnerHTML={{
                  __html: award?.description ?? "",
                }}
              />
              {award?.url && (
                <a
                  href={award.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <LinkIcon className="shrink-0" />
                  View Award
                </a>
              )}
            </div>
          ))}
        </div>
      </section>
    </SectionWrapper>
  );
}

function ReferencesSection() {
  const references = useResumeStore((state) => state.references);

  return (
    <SectionWrapper sectionKey="references">
      <section id="references">
        <h2 id="references-title">{references?.title ?? "References"}</h2>
        <div id="references-items">
          {references?.items?.map((ref, index) => (
            <div key={index} id={`reference-item-${index}`}>
              <h3>{ref?.name}</h3>
              <div>
                {ref?.position} {ref?.company && `at ${ref.company}`}
              </div>
              {ref?.relationship && <div>{ref.relationship}</div>}
              <div>
                {ref?.email && (
                  <div>
                    <Mail className="shrink-0" />
                    {ref.email}
                  </div>
                )}
                {ref?.phoneNumber && (
                  <div>
                    <Phone className="shrink-0" />
                    {ref.phoneNumber}
                  </div>
                )}
              </div>
            </div>
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
              className="flex items-center gap-2 text-sm text-primary hover:text-primary/80"
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
      <h3 className={cn("text-lg", color && `text-[${color}]`)}>{heading}</h3>
    </div>
  );
};

