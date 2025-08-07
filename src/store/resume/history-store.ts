import { create } from 'zustand'
import type { ResumeDataStore } from './data-store'

// Define a custom event name
const HISTORY_CHANGE_EVENT = 'resume-history-change';

// Add this helper function nea
const dispatchHistoryChange = () => {
    window.dispatchEvent(new Event(HISTORY_CHANGE_EVENT));
};

interface HistoryStore {
    past: ResumeDataStore[]
    future: ResumeDataStore[]
    canUndo: boolean
    canRedo: boolean
    saveState: (state: ResumeDataStore) => void
    undo: (restoreCallback: (state: ResumeDataStore) => void) => void
    redo: (restoreCallback: (state: ResumeDataStore) => void) => void
    isUndoRedoOperation: boolean
    // dispatchHistoryChange: () => void
    setIsUndoRedoOperation: (value: boolean) => void
}

export const useHistoryStore = create<HistoryStore>((set) => ({
    past: [],
    future: [],
    canUndo: false,
    canRedo: false,
    isUndoRedoOperation: false,
    setIsUndoRedoOperation: (value) => set({ isUndoRedoOperation: value }),

    saveState: (currentState) => set(state => {
        if (state.isUndoRedoOperation) return state

        return {
            past: [...state.past, currentState],
            future: [],
            canUndo: true,
            canRedo: false,
        }
    }),

    undo: (restoreCallback) => set((state) => {
        if (state.past.length < 2) return state;

        const newPast = state.past.slice(0, -1)
        const currentState = state.past[state.past.length - 1]
        const previousState = newPast[newPast.length - 1]

        if (!previousState) return state;

        state.setIsUndoRedoOperation(true)

        setTimeout(() => {
            state.setIsUndoRedoOperation(false)
            dispatchHistoryChange()
        }, 100)

        restoreCallback(previousState)

        return {
            past: newPast,
            future: [currentState, ...state.future],
            canUndo: newPast.length > 0,
            canRedo: true,
        }
    }),

    redo: (restoreCallback) => set((state) => {
        if (state.future.length === 0) return state;

        const nextState = state.future[0]
        const newFuture = state.future.slice(1)

        if (!nextState) return state;

        state.setIsUndoRedoOperation(true)

        setTimeout(() => {
            state.setIsUndoRedoOperation(false)
            dispatchHistoryChange()
        }, 100)

        restoreCallback(nextState)

        return {
            past: [...state.past, nextState],
            future: newFuture,
            canUndo: true,
            canRedo: newFuture.length > 0,
        }
    }),
}))

// Export the event name for components to use
export { HISTORY_CHANGE_EVENT };