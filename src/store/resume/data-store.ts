import { create } from 'zustand'
import type { ResumeData, } from '@/server/db/schema'
import { DEFAULT_DATA } from '@/server/db/schema'
import type { StateCreator } from 'zustand'
import { devtools } from 'zustand/middleware'
import { DEFAULT_SECTIONS, type ResumeSettings, type SectionKeys } from "@/server/db/schema"


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

type OrderSlice = {
    order: SectionKeys[]
    setOrder: (order: SectionKeys[]) => void
}

type SettingsSlice = {
    settings: Partial<ResumeSettings>
    updateSettings: (data: Partial<ResumeSettings>) => void
}

// Add new types for history slice
type HistorySlice = {
    past: ResumeDataStore[]
    future: ResumeDataStore[]
    undo: () => void
    redo: () => void
    canUndo: () => boolean
    canRedo: () => boolean
    saveState: () => void // New method to manually save state
    ignoreNext: () => void // Helper to ignore next state change
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
    languages: DEFAULT_DATA.languages,
    languagesVisible: false,
    updateLanguages: (data) => set((state) => ({
        languages: { ...state.languages, ...data }
    })),
    updateLanguagesVisibility: (visible) => set(() => ({ languagesVisible: visible })),
})

const createAchievementsSlice: StateCreator<ResumeStore, [], [], AchievementsSlice> = (set) => ({
    achievements: DEFAULT_DATA.achievements,
    achievementsVisible: false,
    updateAchievements: (data) => set((state) => ({
        achievements: { ...state.achievements, ...data }
    })),
    updateAchievementsVisibility: (visible) => set(() => ({ achievementsVisible: visible })),
})

const createAwardsSlice: StateCreator<ResumeStore, [], [], AwardsSlice> = (set) => ({
    awards: DEFAULT_DATA.awards,
    awardsVisible: false,
    updateAwards: (data) => set((state) => ({
        awards: { ...state.awards, ...data }
    })),
    updateAwardsVisibility: (visible) => set(() => ({ awardsVisible: visible })),
})

const createCertificationsSlice: StateCreator<ResumeStore, [], [], CertificationsSlice> = (set) => ({
    certifications: DEFAULT_DATA.certifications,
    certificationsVisible: false,
    updateCertifications: (data) => set((state) => ({
        certifications: { ...state.certifications, ...data }
    })),
    updateCertificationsVisibility: (visible) => set(() => ({ certificationsVisible: visible })),
})

const createReferencesSlice: StateCreator<ResumeStore, [], [], ReferencesSlice> = (set) => ({
    references: DEFAULT_DATA.references,
    referencesVisible: false,
    updateReferences: (data) => set((state) => ({
        references: { ...state.references, ...data }
    })),
    updateReferencesVisibility: (visible) => set(() => ({ referencesVisible: visible })),
})

const createPublicationsSlice: StateCreator<ResumeStore, [], [], PublicationsSlice> = (set) => ({
    publications: DEFAULT_DATA.publications,
    publicationsVisible: false,
    updatePublications: (data) => set((state) => ({
        publications: { ...state.publications, ...data }
    })),
    updatePublicationsVisibility: (visible) => set(() => ({ publicationsVisible: visible })),
})

const createSocialMediaSlice: StateCreator<ResumeStore, [], [], SocialMediaSlice> = (set) => ({
    socialMedia: DEFAULT_DATA.socialMedia,
    socialMediaVisible: false,
    updateSocialMedia: (data) => set((state) => ({
        socialMedia: { ...state.socialMedia, ...data }
    })),
    updateSocialMediaVisibility: (visible) => set(() => ({ socialMediaVisible: visible })),
})

const createVoluntaryWorkSlice: StateCreator<ResumeStore, [], [], VoluntaryWorkSlice> = (set) => ({
    voluntaryWork: DEFAULT_DATA.voluntaryWork,
    voluntaryWorkVisible: false,
    updateVoluntaryWork: (data) => set((state) => ({
        voluntaryWork: { ...state.voluntaryWork, ...data }
    })),
    updateVoluntaryWorkVisibility: (visible) => set(() => ({ voluntaryWorkVisible: visible })),
})

const createGoalsSlice: StateCreator<ResumeStore, [], [], GoalsSlice> = (set) => ({
    goals: DEFAULT_DATA.goals,
    goalsVisible: false,
    updateGoals: (data) => set((state) => ({
        goals: { ...state.goals, ...data }
    })),
    updateGoalsVisibility: (visible) => set(() => ({ goalsVisible: visible })),
})

const createGraphsSlice: StateCreator<ResumeStore, [], [], GraphsSlice> = (set) => ({
    graphs: DEFAULT_DATA.graphs,
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
    order: SectionKeys[]
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
    GraphsSlice,
    CustomSectionsSlice,
    OrderSlice,
    SettingsSlice {
    getData: () => ResumeDataStore
    updateData: (data: Partial<ResumeData>) => void
    // setFullData: (data: Partial<ResumeData>) => void,
    updateAll: (data: ResumeDataStore) => void,
    // data: Partial<ResumeData>
}

export const useResumeStore = create<ResumeStore, [["zustand/devtools", never]]>(devtools((set, get, ...rest) => ({
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
    ...createOrderSlice(set, get, ...rest),
    ...createSettingsSlice(set, get, ...rest),

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
            graphs: get()?.graphs,
            customSections: get()?.customSections,
        },
        settings: get().settings,
        order: get().order,
    }),

    updateAll: (data) => set(() => {

        const resumeData = data.data;
        const resumeSettings = data.settings;
        const resumeOrder = data.order;

        return {
            ...resumeData,
            ...resumeSettings,
            ...resumeOrder
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
}), {
    name: "resume-store",
    store: "resume-store"
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