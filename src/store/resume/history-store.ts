import { create } from 'zustand'
import type { ResumeDataStore } from './data-store'

// Define a custom event name
const HISTORY_CHANGE_EVENT = 'resume-history-change';

interface HistoryStore {
    past: ResumeDataStore[]
    future: ResumeDataStore[]
    canUndo: boolean
    canRedo: boolean
    saveState: (state: ResumeDataStore) => void
    undo: (restoreCallback: (state: ResumeDataStore) => void) => void
    redo: (restoreCallback: (state: ResumeDataStore) => void) => void
    dispatchHistoryChange: () => void
}

export const useHistoryStore = create<HistoryStore>((set) => ({
    past: [],
    future: [],
    canUndo: false,
    canRedo: false,

    saveState: (currentState) => set(state => {
        const newPast = [...state.past, currentState]

        return {
            past: newPast,
            future: [],
            canUndo: newPast.length > 0,
            canRedo: false,
        }
    }),

    dispatchHistoryChange: () => {
        // Dispatch a custom event when history changes
        if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent(HISTORY_CHANGE_EVENT));
        }
    },

    undo: (restoreCallback) => set((state) => {
        if (state.past.length === 0) return state

        const previous = state.past[state.past.length - 1]
        const newPast = state.past.slice(0, -1)

        if (!previous) {
            console.log("no state to restore");
            return state;
        }

        restoreCallback(previous)
        // Dispatch event after state restoration
        useHistoryStore.getState().dispatchHistoryChange();

        return {
            past: newPast,
            future: [previous, ...state.future],
            canUndo: newPast.length > 0,
            canRedo: true,
        }
    }),

    redo: (restoreCallback) => set((state) => {
        if (state.future.length === 0) return state

        const next = state.future[0]
        const newFuture = state.future.slice(1)

        if (!next) {
            console.log("no state to restore");
            return state;
        }

        restoreCallback(next)
        // Dispatch event after state restoration
        useHistoryStore.getState().dispatchHistoryChange();

        return {
            past: [...state.past, next],
            future: newFuture,
            canUndo: true,
            canRedo: newFuture.length > 0,
        }
    }),
}))

// Export the event name for components to use
export { HISTORY_CHANGE_EVENT };