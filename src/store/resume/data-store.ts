import { create } from 'zustand'
import type { ResumeData, } from '@/server/db/schema'
import { DEFAULT_DATA } from '@/server/db/schema'
import type { StateCreator } from 'zustand'


type PersonalInfoSlice = {
    personalInfo: Partial<ResumeData['personalInfo']>
    personalInfoVisible: boolean
    updatePersonalInfo: (data: Partial<ResumeData['personalInfo']>) => void
    updatePersonalInfoVisibility: (visible: boolean) => void
}
type WorkExperienceSlice = {
    workExperience: Partial<ResumeData['workExperience']>
    workExperienceVisible: boolean
    updateWorkExperience: (data: Partial<ResumeData['workExperience']>) => void
    updateWorkExperienceVisibility: (visible: boolean) => void
}
type EducationSlice = {
    education: Partial<ResumeData['education']>
    educationVisible: boolean
    updateEducation: (data: Partial<ResumeData['education']>) => void
    updateEducationVisibility: (visible: boolean) => void
}
type SkillsSlice = {
    skills: Partial<ResumeData['skills']>
    skillsVisible: boolean
    updateSkills: (data: Partial<ResumeData['skills']>) => void
    updateSkillsVisibility: (visible: boolean) => void
}
type ProjectsSlice = {
    projects: Partial<ResumeData['projects']>
    projectsVisible: boolean
    updateProjects: (data: Partial<ResumeData['projects']>) => void
    updateProjectsVisibility: (visible: boolean) => void
}
type LanguagesSlice = {
    languages: Partial<ResumeData['languages']>
    languagesVisible: boolean
    updateLanguages: (data: Partial<ResumeData['languages']>) => void
    updateLanguagesVisibility: (visible: boolean) => void
}
type AwardsSlice = {
    awards: Partial<ResumeData['awards']>
    awardsVisible: boolean
    updateAwards: (data: Partial<ResumeData['awards']>) => void
    updateAwardsVisibility: (visible: boolean) => void
}
type CertificationsSlice = {
    certifications: Partial<ResumeData['certifications']>
    certificationsVisible: boolean
    updateCertifications: (data: Partial<ResumeData['certifications']>) => void
    updateCertificationsVisibility: (visible: boolean) => void
}
type ReferencesSlice = {
    references: Partial<ResumeData['references']>
    referencesVisible: boolean
    updateReferences: (data: Partial<ResumeData['references']>) => void
    updateReferencesVisibility: (visible: boolean) => void
}
type PublicationsSlice = {
    publications: Partial<ResumeData['publications']>
    publicationsVisible: boolean
    updatePublications: (data: Partial<ResumeData['publications']>) => void
    updatePublicationsVisibility: (visible: boolean) => void
}
type SocialMediaSlice = {
    socialMedia: Partial<ResumeData['socialMedia']>
    socialMediaVisible: boolean
    updateSocialMedia: (data: Partial<ResumeData['socialMedia']>) => void
    updateSocialMediaVisibility: (visible: boolean) => void
}
type VoluntaryWorkSlice = {
    voluntaryWork: Partial<ResumeData['voluntaryWork']>
    voluntaryWorkVisible: boolean
    updateVoluntaryWork: (data: Partial<ResumeData['voluntaryWork']>) => void
    updateVoluntaryWorkVisibility: (visible: boolean) => void
}
type GoalsSlice = {
    goals: Partial<ResumeData['goals']>
    goalsVisible: boolean
    updateGoals: (data: Partial<ResumeData['goals']>) => void
    updateGoalsVisibility: (visible: boolean) => void
}
type GraphsSlice = {
    graphs: Partial<ResumeData['graphs']>
    graphsVisible: boolean
    updateGraphs: (data: Partial<ResumeData['graphs']>) => void
    updateGraphsVisibility: (visible: boolean) => void
}
type CustomSectionsSlice = {
    customSections: Partial<ResumeData['customSections']>
    customSectionsVisible: boolean
    updateCustomSections: (data: Partial<ResumeData['customSections']>) => void
    updateCustomSectionsVisibility: (visible: boolean) => void
}

type AchievementsSlice = {
    achievements: Partial<ResumeData['achievements']>
    achievementsVisible: boolean
    updateAchievements: (data: Partial<ResumeData['achievements']>) => void
    updateAchievementsVisibility: (visible: boolean) => void
}



const createPersonalInfoSlice: StateCreator<ResumeStore, [], [], PersonalInfoSlice> = (set) => ({
    personalInfo: DEFAULT_DATA.personalInfo,
    personalInfoVisible: true,
    updatePersonalInfo: (data) => set((state) => ({
        personalInfo: { ...state.personalInfo, ...data }
    })),
    updatePersonalInfoVisibility: (visible) => set(() => ({ personalInfoVisible: visible })),
})

const createWorkExperienceSlice: StateCreator<ResumeStore, [], [], WorkExperienceSlice> = (set) => ({
    workExperience: DEFAULT_DATA.workExperience,
    workExperienceVisible: true,
    updateWorkExperience: (data) => set((state) => ({
        workExperience: { ...state.workExperience, ...data }
    })),
    updateWorkExperienceVisibility: (visible) => set(() => ({ workExperienceVisible: visible })),
})

const createEducationSlice: StateCreator<ResumeStore, [], [], EducationSlice> = (set) => ({
    education: DEFAULT_DATA.education,
    educationVisible: true,
    updateEducation: (data) => set((state) => ({
        education: { ...state.education, ...data }
    })),
    updateEducationVisibility: (visible) => set(() => ({ educationVisible: visible })),
})

const createSkillsSlice: StateCreator<ResumeStore, [], [], SkillsSlice> = (set) => ({
    skills: DEFAULT_DATA.skills,
    skillsVisible: false,
    updateSkills: (data) => set((state) => ({
        skills: { ...state.skills, ...data }
    })),
    updateSkillsVisibility: (visible) => set(() => ({ skillsVisible: visible })),
})

const createProjectsSlice: StateCreator<ResumeStore, [], [], ProjectsSlice> = (set) => ({
    projects: DEFAULT_DATA.projects,
    projectsVisible: false,
    updateProjects: (data) => set((state) => ({
        projects: { ...state.projects, ...data }
    })),
    updateProjectsVisibility: (visible) => set(() => ({ projectsVisible: visible })),
})

const createLanguagesSlice: StateCreator<ResumeStore, [], [], LanguagesSlice> = (set) => ({
    languages: undefined,
    languagesVisible: false,
    updateLanguages: (data) => set((state) => ({
        languages: { ...state.languages, ...data }
    })),
    updateLanguagesVisibility: (visible) => set(() => ({ languagesVisible: visible })),
})

const createAchievementsSlice: StateCreator<ResumeStore, [], [], AchievementsSlice> = (set) => ({
    achievements: undefined,
    achievementsVisible: false,
    updateAchievements: (data) => set((state) => ({
        achievements: { ...state.achievements, ...data }
    })),
    updateAchievementsVisibility: (visible) => set(() => ({ achievementsVisible: visible })),
})

const createAwardsSlice: StateCreator<ResumeStore, [], [], AwardsSlice> = (set) => ({
    awards: undefined,
    awardsVisible: false,
    updateAwards: (data) => set((state) => ({
        awards: { ...state.awards, ...data }
    })),
    updateAwardsVisibility: (visible) => set(() => ({ awardsVisible: visible })),
})

const createCertificationsSlice: StateCreator<ResumeStore, [], [], CertificationsSlice> = (set) => ({
    certifications: undefined,
    certificationsVisible: false,
    updateCertifications: (data) => set((state) => ({
        certifications: { ...state.certifications, ...data }
    })),
    updateCertificationsVisibility: (visible) => set(() => ({ certificationsVisible: visible })),
})

const createReferencesSlice: StateCreator<ResumeStore, [], [], ReferencesSlice> = (set) => ({
    references: undefined,
    referencesVisible: false,
    updateReferences: (data) => set((state) => ({
        references: { ...state.references, ...data }
    })),
    updateReferencesVisibility: (visible) => set(() => ({ referencesVisible: visible })),
})

const createPublicationsSlice: StateCreator<ResumeStore, [], [], PublicationsSlice> = (set) => ({
    publications: undefined,
    publicationsVisible: false,
    updatePublications: (data) => set((state) => ({
        publications: { ...state.publications, ...data }
    })),
    updatePublicationsVisibility: (visible) => set(() => ({ publicationsVisible: visible })),
})

const createSocialMediaSlice: StateCreator<ResumeStore, [], [], SocialMediaSlice> = (set) => ({
    socialMedia: undefined,
    socialMediaVisible: false,
    updateSocialMedia: (data) => set((state) => ({
        socialMedia: { ...state.socialMedia, ...data }
    })),
    updateSocialMediaVisibility: (visible) => set(() => ({ socialMediaVisible: visible })),
})

const createVoluntaryWorkSlice: StateCreator<ResumeStore, [], [], VoluntaryWorkSlice> = (set) => ({
    voluntaryWork: undefined,
    voluntaryWorkVisible: false,
    updateVoluntaryWork: (data) => set((state) => ({
        voluntaryWork: { ...state.voluntaryWork, ...data }
    })),
    updateVoluntaryWorkVisibility: (visible) => set(() => ({ voluntaryWorkVisible: visible })),
})

const createGoalsSlice: StateCreator<ResumeStore, [], [], GoalsSlice> = (set) => ({
    goals: undefined,
    goalsVisible: false,
    updateGoals: (data) => set((state) => ({
        goals: { ...state.goals, ...data }
    })),
    updateGoalsVisibility: (visible) => set(() => ({ goalsVisible: visible })),
})

const createGraphsSlice: StateCreator<ResumeStore, [], [], GraphsSlice> = (set) => ({
    graphs: undefined,
    graphsVisible: false,
    updateGraphs: (data) => set((state) => ({
        graphs: { ...state.graphs, ...data }
    })),
    updateGraphsVisibility: (visible) => set(() => ({ graphsVisible: visible })),
})

const createCustomSectionsSlice: StateCreator<ResumeStore, [], [], CustomSectionsSlice> = (set) => ({
    customSections: undefined,
    customSectionsVisible: false,
    updateCustomSections: (data) => set((state) => ({
        customSections: { ...state.customSections, ...data }
    })),
    updateCustomSectionsVisibility: (visible) => set(() => ({ customSectionsVisible: visible })),
})


// Main store type combining all slices
interface ResumeStore extends
    PersonalInfoSlice,
    WorkExperienceSlice,
    EducationSlice,
    SkillsSlice,
    ProjectsSlice,
    LanguagesSlice,
    AchievementsSlice,
    AwardsSlice,
    CertificationsSlice,
    ReferencesSlice,
    PublicationsSlice,
    SocialMediaSlice,
    VoluntaryWorkSlice,
    GoalsSlice,
    GraphsSlice,
    CustomSectionsSlice {
    setFullData: (data: Partial<ResumeData>) => void,
    data: Partial<ResumeData>
}

export const useResumeStore = create<ResumeStore>((set, get, ...rest) => ({
    ...createPersonalInfoSlice(set, get, ...rest),
    ...createWorkExperienceSlice(set, get, ...rest),
    ...createEducationSlice(set, get, ...rest),
    ...createSkillsSlice(set, get, ...rest),
    ...createProjectsSlice(set, get, ...rest),
    ...createLanguagesSlice(set, get, ...rest),
    ...createAchievementsSlice(set, get, ...rest),
    ...createAwardsSlice(set, get, ...rest),
    ...createCertificationsSlice(set, get, ...rest),
    ...createReferencesSlice(set, get, ...rest),
    ...createPublicationsSlice(set, get, ...rest),
    ...createSocialMediaSlice(set, get, ...rest),
    ...createVoluntaryWorkSlice(set, get, ...rest),
    ...createGoalsSlice(set, get, ...rest),
    ...createGraphsSlice(set, get, ...rest),
    ...createCustomSectionsSlice(set, get, ...rest),

    data: {
        ...get()?.personalInfo,
        ...get()?.workExperience,
        ...get()?.education,
        ...get()?.skills,
        ...get()?.projects,
        ...get()?.languages,
        ...get()?.achievements,
        ...get()?.awards,
        ...get()?.certifications,
        ...get()?.references,
        ...get()?.publications,
        ...get()?.socialMedia,
        ...get()?.voluntaryWork,
        ...get()?.goals,
        ...get()?.graphs,
        ...get()?.customSections,
    },


    setFullData: (data) => set(() => {
        const updates: Partial<ResumeStore> = {};

        (Object.keys(data) as Array<keyof typeof data>).forEach(key => {
            if (data[key]) {
                // @ts-expect-error
                updates[key] = data[key]
            }
        });

        return updates;
    }),
}))