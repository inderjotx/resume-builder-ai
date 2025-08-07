import { create } from 'zustand'
import type { ResumeData, } from '@/server/db/schema'
import { DEFAULT_DATA } from '@/server/db/schema'
import type { StateCreator } from 'zustand'
import { DEFAULT_SECTIONS, type ResumeSettings, type SectionKeys } from "@/server/db/schema"


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

type AchievementsSlice = {
    achievements: Partial<ResumeData['achievements']>
    updateAchievements: (data: Partial<ResumeData['achievements']>) => void
}

type OrderSlice = {
    order: { id: SectionKeys, title: string }[]
    setOrder: (order: { id: SectionKeys, title: string }[]) => void
}

type SettingsSlice = {
    settings: Partial<ResumeSettings>
    updateSettings: (data: Partial<ResumeSettings>) => void
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
    languages: DEFAULT_DATA.languages,
    updateLanguages: (data) => set((state) => ({
        languages: { ...state.languages, ...data }
    })),
})

const createAchievementsSlice: StateCreator<ResumeStore, [], [], AchievementsSlice> = (set) => ({
    achievements: DEFAULT_DATA.achievements,
    updateAchievements: (data) => set((state) => ({
        achievements: { ...state.achievements, ...data }
    })),
})

const createAwardsSlice: StateCreator<ResumeStore, [], [], AwardsSlice> = (set) => ({
    awards: DEFAULT_DATA.awards,
    updateAwards: (data) => set((state) => ({
        awards: { ...state.awards, ...data }
    })),
})

const createCertificationsSlice: StateCreator<ResumeStore, [], [], CertificationsSlice> = (set) => ({
    certifications: DEFAULT_DATA.certifications,
    updateCertifications: (data) => set((state) => ({
        certifications: { ...state.certifications, ...data }
    })),
})

const createReferencesSlice: StateCreator<ResumeStore, [], [], ReferencesSlice> = (set) => ({
    references: DEFAULT_DATA.references,
    updateReferences: (data) => set((state) => ({
        references: { ...state.references, ...data }
    })),
})

const createPublicationsSlice: StateCreator<ResumeStore, [], [], PublicationsSlice> = (set) => ({
    publications: DEFAULT_DATA.publications,
    updatePublications: (data) => set((state) => ({
        publications: { ...state.publications, ...data }
    })),
})

const createSocialMediaSlice: StateCreator<ResumeStore, [], [], SocialMediaSlice> = (set) => ({
    socialMedia: DEFAULT_DATA.socialMedia,
    updateSocialMedia: (data) => set((state) => ({
        socialMedia: { ...state.socialMedia, ...data }
    })),
})

const createVoluntaryWorkSlice: StateCreator<ResumeStore, [], [], VoluntaryWorkSlice> = (set) => ({
    voluntaryWork: DEFAULT_DATA.voluntaryWork,
    updateVoluntaryWork: (data) => set((state) => ({
        voluntaryWork: { ...state.voluntaryWork, ...data }
    })),
})

const createGoalsSlice: StateCreator<ResumeStore, [], [], GoalsSlice> = (set) => ({
    goals: DEFAULT_DATA.goals,
    updateGoals: (data) => set((state) => ({
        goals: { ...state.goals, ...data }
    })),
})


const createOrderSlice: StateCreator<ResumeStore, [], [], OrderSlice> = (set) => ({
    order: DEFAULT_SECTIONS,
    setOrder: (order) => set(() => ({ order })),
})

const createSettingsSlice: StateCreator<ResumeStore, [], [], SettingsSlice> = (set) => ({
    settings: {},
    updateSettings: (data) => set((state) => ({
        settings: { ...state.settings, ...data }
    })),
})

export interface ResumeDataStore {
    data: Partial<ResumeData>
    settings: Partial<ResumeSettings>
    order: { id: SectionKeys, title: string }[]
}

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
    OrderSlice,
    SettingsSlice {
    getData: () => ResumeDataStore
    updateData: (data: Partial<ResumeData>) => void
    // setFullData: (data: Partial<ResumeData>) => void,
    updateAll: (data: ResumeDataStore) => void,
    activeSection: SectionKeys
    setActiveSection: (section: SectionKeys) => void
    // data: Partial<ResumeData>
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
    ...createOrderSlice(set, get, ...rest),
    ...createSettingsSlice(set, get, ...rest),

    activeSection: "personalInfo",
    setActiveSection: (section) => set(() => ({ activeSection: section })),
    getData: () => ({
        data: {
            personalInfo: get()?.personalInfo,
            workExperience: get()?.workExperience,
            education: get()?.education,
            skills: get()?.skills,
            projects: get()?.projects,
            languages: get()?.languages,
            achievements: get()?.achievements,
            awards: get()?.awards,
            certifications: get()?.certifications,
            references: get()?.references,
            publications: get()?.publications,
            socialMedia: get()?.socialMedia,
            voluntaryWork: get()?.voluntaryWork,
            goals: get()?.goals,
        },
        settings: get().settings,
        order: get().order
    }),

    updateAll: (data) => set(() => {

        const resumeData = data.data;
        const resumeSettings = data.settings;
        const resumeOrder = data.order;


        return {
            ...resumeData,
            settings: resumeSettings,
            order: resumeOrder
        }


    }),

    updateData: (data) => set(() => {

        const updates: Partial<ResumeStore> = {};

        (Object.keys(data) as Array<keyof typeof data>).forEach(key => {
            if (data[key]) {
                updates[key] = data[key]
            }
        });

        return updates;
    }),
}))


export const useUpdateTitle = (id: keyof ResumeData) => {

    const store = useResumeStore.getState()



    const setTitle = (title: string) => {
        store.updateData({
            [id]: {
                title
            }
        })
    }


    return { setTitle, title: store[id]?.title ?? "" }
}
