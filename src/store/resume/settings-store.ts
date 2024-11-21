
import { create } from "zustand";
import { DEFAULT_SECTIONS, type ResumeSettings, type SectionKeys } from "@/server/db/schema";

interface SettingsStore {
    order: SectionKeys[];
    setOrder: (order: SectionKeys[]) => void;
    settings: Partial<ResumeSettings>;
    updateSettings: (data: Partial<ResumeSettings>) => void;
}

export const useSettingsStore = create<SettingsStore>((set) => ({
    settings: {},
    order: DEFAULT_SECTIONS,
    setOrder: (order) => set(() => ({
        order
    })),
    updateSettings: (data) => set((state) => ({
        settings: { ...state.settings, ...data }
    })),
}));