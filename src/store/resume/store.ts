// import type { StateCreator } from 'zustand'
// import { createDataSlice } from './data-slice'
// import type { DataSlice } from './data-slice'
// import type { ResumeData, SectionKeys, ResumeSettings } from '@/server/db/schema'


// interface SettingsSlice {
//     settings: Partial<ResumeSettings>
//     updateSettings: (settings: Partial<ResumeSettings>) => void
//     resetSettings: () => void
// }

// const createSettingsSlice: StateCreator<ResumeStore, [], [], SettingsSlice> = (set) => ({
//     settings: {},
//     updateSettings: (newSettings) =>
//         set((state) => ({
//             settings: { ...state.settings, ...newSettings },
//         })),
//     resetSettings: () => set({ settings: {} }),
// })


// export interface ResumeStore extends DataSlice, SettingsSlice {
//     order: SectionKeys[]
//     setOrder: (order: SectionKeys[]) => void
//     resetAll: () => void
// }

// export const useResumeStore = create<ResumeStore>((set, ...rest) => ({
//     ...createDataSlice(set, ...rest),
//     ...createSettingsSlice(set, ...rest),
//     order: [],
//     setOrder: (order) => set({ order }),

//     resetAll: () => set({
//         data: {},
//         settings: {},
//         order: [],
//     }),
// }))