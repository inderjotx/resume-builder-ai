import { type LinkedInProfileData } from "@/types/linkedin-profile.type";
import { linkedInProfile, type Proficiency, type ResumeData, resume } from "@/server/db/schema";
import { auth } from "@/server/auth";
import { db } from "@/server/db";
import { env } from "@/env";
import { and, eq } from "drizzle-orm";

export class ResumeService {

    public async saveLinkedInProfile(linkedId: string, userId: string, email: string) {
        const linkedinProfile = await ResumeService.getLinkedInProfile(linkedId);
        const resumeData = ResumeService.formatLinkedInProfileToData(linkedinProfile, email);

        await db.insert(linkedInProfile).values({
            data: resumeData,
            linkedInId: linkedId,
            userId: userId
        }).onConflictDoUpdate({
            target: [linkedInProfile.linkedInId],
            set: {
                linkedInId: linkedId,
                data: resumeData
            }
        });

        return resumeData;
    }

    private static async getLinkedInProfile(linkedId: string) {
        const linkedInProfile = await fetch(`${env.BACKEND_URL}/linkedin-profile/${linkedId}`);
        return linkedInProfile.json() as Promise<LinkedInProfileData>;
    }

    private static formatLinkedInProfileToData(linkedInProfile: LinkedInProfileData, email: string) {
        const imageUrlBase = linkedInProfile?.displayPictureUrl
        const imageUrl = linkedInProfile?.img_800_800 || linkedInProfile?.img_400_400 || linkedInProfile?.img_200_200


        const resumeData: ResumeData = {
            personalInfo: {
                firstName: linkedInProfile?.firstName,
                lastName: linkedInProfile?.lastName,
                email: email,
                country: linkedInProfile?.geoCountryName,
                city: linkedInProfile?.geoLocationName,
                imageUrl: imageUrlBase + imageUrl,
                bio: linkedInProfile?.headline
            },
            workExperience: {
                title: "Work Experience",
                items: linkedInProfile?.experience?.map((exp) => {
                    return {
                        companyName: exp?.companyName,
                        position: exp?.title,
                        startDate: this.formatDate(exp?.timePeriod?.startDate),
                        endDate: exp?.timePeriod?.endDate ? this.formatDate(exp?.timePeriod?.endDate) : undefined,
                        isCurrent: exp?.timePeriod?.endDate ? false : true,
                        description: exp?.description,
                        city: exp?.locationName,
                        country: exp?.geoLocationName,
                    }
                })
            },
            education: {
                title: "Education",
                items: linkedInProfile?.education?.map((edu) => {
                    return {
                        institutionName: edu?.schoolName,
                        degree: edu?.degreeName,
                        fieldOfStudy: edu?.fieldOfStudy,
                        startDate: this.formatDate(edu?.timePeriod?.startDate),
                        endDate: edu?.timePeriod?.endDate ? this.formatDate(edu?.timePeriod?.endDate) : undefined,
                        isCurrent: edu?.timePeriod?.endDate ? false : true,
                        description: edu?.description,
                        grade: edu?.grade,
                    }
                })
            },
            languages: {
                title: "Languages",
                items: linkedInProfile?.languages?.map((lang) => {
                    return {
                        language: lang?.name,
                        proficiency: lang?.proficiency as Proficiency,
                    }
                })
            },
            publications: {
                title: "Publications",
                items: linkedInProfile?.publications?.map((pub) => {
                    return {
                        title: pub?.name,
                        description: pub?.description,
                        url: pub?.url,
                        date: this.formatDate(pub?.date),
                    }
                })
            },
            certifications: {
                title: "Certifications",
                items: linkedInProfile?.certifications?.map((cert) => {
                    return {
                        title: cert?.name,
                        certificationAuthority: cert?.authority,
                        certificationDate: this.formatDate(cert?.timePeriod?.startDate),
                    }
                })
            },
            voluntaryWork: {
                title: "Volunteer Work",
                items: linkedInProfile?.volunteer?.map((vol) => {
                    return {
                        organizationName: vol?.company?.miniCompany?.name,
                        role: vol?.role,
                        startDate: this.formatDate(vol?.timePeriod?.startDate),
                        endDate: vol?.timePeriod?.endDate ? this.formatDate(vol?.timePeriod?.endDate) : undefined,
                        isCurrent: vol?.timePeriod?.endDate ? false : true,
                    }
                })
            },
            projects: {
                title: "Projects",
                items: linkedInProfile?.projects?.map((proj) => {
                    return {
                        projectName: proj?.title,
                        startDate: this.formatDate(proj?.timePeriod?.startDate),
                        endDate: proj?.timePeriod?.endDate ? this.formatDate(proj?.timePeriod?.endDate) : undefined,
                        isCurrent: proj?.timePeriod?.endDate ? false : true,
                        description: proj?.description,
                    }
                })
            },
            skills: {
                title: "Skills",
                items: linkedInProfile?.skills?.map((skill) => {
                    return {
                        skillCategory: skill?.name
                    }
                })
            },
            achievements: {
                title: "Achievements",
                items: linkedInProfile?.honors?.map((ach) => {
                    return {
                        achievementTitle: ach?.title,
                    }
                })
            }
        }


        return resumeData

    }


    private static formatDate(data: { month?: number, year: number, date?: number }) {
        return new Date(data.year, data?.month ?? 1, data?.date ?? 1).toISOString();
    }


    public async getResume(resumeId: string) {

        const session = await auth()

        if (!session?.user?.id) {
            return {
                success: false,
                data: null,
                error: "Unauthorized"
            }
        }

        const resumeData = await db.query.resume.findFirst({
            where: and(eq(resume.id, resumeId), eq(resume.userId, session.user.id))
        });

        if (!resumeData) {
            return {
                success: false,
                data: null,
                error: "Resume not found"
            }
        }
        return {
            success: true,
            data: resumeData,
            error: null
        };
    }
}



const resumeService = new ResumeService();
export default resumeService;
