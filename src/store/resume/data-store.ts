import { create } from 'zustand'
import type { ResumeData, } from '@/server/db/schema'
import { DEFAULT_DATA } from '@/server/db/schema'
import type { StateCreator } from 'zustand'


// Individual section slices
type PersonalInfoSlice = {
    personalInfo: Partial<ResumeData['personalInfo']>
    updatePersonalInfo: (data: Partial<ResumeData['personalInfo']>) => void
}
type WorkExperienceSlice = {
    workExperience: Partial<ResumeData['workExperience']>
    updateWorkExperience: (data: Partial<ResumeData['workExperience']>) => void
}
type EducationSlice = {
    education: Partial<ResumeData['education']>
    updateEducation: (data: Partial<ResumeData['education']>) => void
}
type SkillsSlice = {
    skills: Partial<ResumeData['skills']>
    updateSkills: (data: Partial<ResumeData['skills']>) => void
}
type ProjectsSlice = {
    projects: Partial<ResumeData['projects']>
    updateProjects: (data: Partial<ResumeData['projects']>) => void
}
type LanguagesSlice = {
    languages: Partial<ResumeData['languages']>
    updateLanguages: (data: Partial<ResumeData['languages']>) => void
}
type AwardsSlice = {
    awards: Partial<ResumeData['awards']>
    updateAwards: (data: Partial<ResumeData['awards']>) => void
}
type CertificationsSlice = {
    certifications: Partial<ResumeData['certifications']>
    updateCertifications: (data: Partial<ResumeData['certifications']>) => void
}
type ReferencesSlice = {
    references: Partial<ResumeData['references']>
    updateReferences: (data: Partial<ResumeData['references']>) => void
}
type PublicationsSlice = {
    publications: Partial<ResumeData['publications']>
    updatePublications: (data: Partial<ResumeData['publications']>) => void
}
type SocialMediaSlice = {
    socialMedia: Partial<ResumeData['socialMedia']>
    updateSocialMedia: (data: Partial<ResumeData['socialMedia']>) => void
}
type VoluntaryWorkSlice = {
    voluntaryWork: Partial<ResumeData['voluntaryWork']>
    updateVoluntaryWork: (data: Partial<ResumeData['voluntaryWork']>) => void
}
type GoalsSlice = {
    goals: Partial<ResumeData['goals']>
    updateGoals: (data: Partial<ResumeData['goals']>) => void
}
type GraphsSlice = {
    graphs: Partial<ResumeData['graphs']>
    updateGraphs: (data: Partial<ResumeData['graphs']>) => void
}
type CustomSectionsSlice = {
    customSections: Partial<ResumeData['customSections']>
    updateCustomSections: (data: Partial<ResumeData['customSections']>) => void
}

type AchievementsSlice = {
    achievements: Partial<ResumeData['achievements']>
    updateAchievements: (data: Partial<ResumeData['achievements']>) => void
}



const createPersonalInfoSlice: StateCreator<ResumeStore, [], [], PersonalInfoSlice> = (set) => ({
    personalInfo: DEFAULT_DATA.personalInfo,
    updatePersonalInfo: (data) => set((state) => ({
        personalInfo: { ...state.personalInfo, ...data }
    })),
})

const createWorkExperienceSlice: StateCreator<ResumeStore, [], [], WorkExperienceSlice> = (set) => ({
    workExperience: DEFAULT_DATA.workExperience,
    updateWorkExperience: (data) => set((state) => ({
        workExperience: { ...state.workExperience, ...data }
    })),
})

const createEducationSlice: StateCreator<ResumeStore, [], [], EducationSlice> = (set) => ({
    education: DEFAULT_DATA.education,
    updateEducation: (data) => set((state) => ({
        education: { ...state.education, ...data }
    })),
})

const createSkillsSlice: StateCreator<ResumeStore, [], [], SkillsSlice> = (set) => ({
    skills: DEFAULT_DATA.skills,
    updateSkills: (data) => set((state) => ({
        skills: { ...state.skills, ...data }
    })),
})

const createProjectsSlice: StateCreator<ResumeStore, [], [], ProjectsSlice> = (set) => ({
    projects: DEFAULT_DATA.projects,
    updateProjects: (data) => set((state) => ({
        projects: { ...state.projects, ...data }
    })),
})

const createLanguagesSlice: StateCreator<ResumeStore, [], [], LanguagesSlice> = (set) => ({
    languages: undefined,
    updateLanguages: (data) => set((state) => ({
        languages: { ...state.languages, ...data }
    })),
})

const createAchievementsSlice: StateCreator<ResumeStore, [], [], AchievementsSlice> = (set) => ({
    achievements: undefined,
    updateAchievements: (data) => set((state) => ({
        achievements: { ...state.achievements, ...data }
    })),
})

const createAwardsSlice: StateCreator<ResumeStore, [], [], AwardsSlice> = (set) => ({
    awards: undefined,
    updateAwards: (data) => set((state) => ({
        awards: { ...state.awards, ...data }
    })),
})

const createCertificationsSlice: StateCreator<ResumeStore, [], [], CertificationsSlice> = (set) => ({
    certifications: undefined,
    updateCertifications: (data) => set((state) => ({
        certifications: { ...state.certifications, ...data }
    })),
})

const createReferencesSlice: StateCreator<ResumeStore, [], [], ReferencesSlice> = (set) => ({
    references: undefined,
    updateReferences: (data) => set((state) => ({
        references: { ...state.references, ...data }
    })),
})

const createPublicationsSlice: StateCreator<ResumeStore, [], [], PublicationsSlice> = (set) => ({
    publications: undefined,
    updatePublications: (data) => set((state) => ({
        publications: { ...state.publications, ...data }
    })),
})

const createSocialMediaSlice: StateCreator<ResumeStore, [], [], SocialMediaSlice> = (set) => ({
    socialMedia: undefined,
    updateSocialMedia: (data) => set((state) => ({
        socialMedia: { ...state.socialMedia, ...data }
    })),
})

const createVoluntaryWorkSlice: StateCreator<ResumeStore, [], [], VoluntaryWorkSlice> = (set) => ({
    voluntaryWork: undefined,
    updateVoluntaryWork: (data) => set((state) => ({
        voluntaryWork: { ...state.voluntaryWork, ...data }
    })),
})

const createGoalsSlice: StateCreator<ResumeStore, [], [], GoalsSlice> = (set) => ({
    goals: undefined,
    updateGoals: (data) => set((state) => ({
        goals: { ...state.goals, ...data }
    })),
})

const createGraphsSlice: StateCreator<ResumeStore, [], [], GraphsSlice> = (set) => ({
    graphs: undefined,
    updateGraphs: (data) => set((state) => ({
        graphs: { ...state.graphs, ...data }
    })),
})

const createCustomSectionsSlice: StateCreator<ResumeStore, [], [], CustomSectionsSlice> = (set) => ({
    customSections: undefined,
    updateCustomSections: (data) => set((state) => ({
        customSections: { ...state.customSections, ...data }
    })),
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
        ...get().personalInfo,
        ...get().workExperience,
        ...get().education,
        ...get().skills,
        ...get().projects,
        ...get().languages,
        ...get().achievements,
        ...get().awards,
        ...get().certifications,
        ...get().references,
        ...get().publications,
        ...get().socialMedia,
        ...get().voluntaryWork,
        ...get().goals,
        ...get().graphs,
        ...get().customSections,
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