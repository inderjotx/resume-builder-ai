import { create } from 'zustand'
import type { ResumeDataStore } from './data-store'

// Define a custom event name
const HISTORY_CHANGE_EVENT = 'resume-history-change';

interface HistoryStore {
    past: ResumeDataStore[]
    future: ResumeDataStore[]
    canUndo: boolean
    isCurrentState: boolean
    canRedo: boolean
    saveState: (state: ResumeDataStore) => void
    undo: (restoreCallback: (state: ResumeDataStore) => void) => void
    redo: (restoreCallback: (state: ResumeDataStore) => void) => void
    dispatchHistoryChange: () => void
    isUndoRedoOperation: boolean
    setIsUndoRedoOperation: (value: boolean) => void
}

export const useHistoryStore = create<HistoryStore>((set) => ({
    past: [],
    future: [],
    canUndo: false,
    isCurrentState: true,
    canRedo: false,
    isUndoRedoOperation: false,
    setIsUndoRedoOperation: (value) => set({ isUndoRedoOperation: value }),

    saveState: (currentState) => set(state => {
        if (state.isUndoRedoOperation) return state

        const newPast = [...state.past, currentState]
        console.log("saving new data")
        return {
            past: newPast,
            future: state.future,
            canUndo: newPast.length > 0,
            canRedo: false,
            isCurrentState: true,
        }
    }),

    dispatchHistoryChange: () => {
        // Dispatch a custom event when history changes
        if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent(HISTORY_CHANGE_EVENT));
        }
    },

    undo: (restoreCallback) => set((state) => {
        // Need at least 2 states in past: current + previous
        if (state.past.length < 2) {
            console.log("Not enough states to undo");
            return state;
        }



        let previousState
        let currentState
        if (state.isCurrentState) {
            previousState = state.past[state.past.length - 2]
            currentState = state.past[state.past.length - 1]
        } else {
            previousState = state.past[state.past.length - 1]
            currentState = previousState
        }

        // const previous = state.past[state.past.length - 2]
        // Remove current state from past
        const newPast = state.past.slice(0, -1)

        if (!previousState) {
            console.log("No previous state to restore");
            return state;
        }



        state.setIsUndoRedoOperation(true)

        setTimeout(() => {
            state.setIsUndoRedoOperation(false)
        }, 5000)

        restoreCallback(previousState)

        setTimeout(() => {
            state.dispatchHistoryChange();
        }, 100)

        return {
            past: newPast,
            future: [currentState, ...state.future], // Current state goes to future
            canUndo: newPast.length > 1,  // Need 2 states to undo again
            canRedo: true,
            isCurrentState: false,
        }
    }),

    redo: (restoreCallback) => set((state) => {
        if (state.future.length === 0) {
            console.log("Not enough states to redo");
            return state;
        }

        const next = state.future[0]
        const newFuture = state.future.slice(1)

        if (!next) {
            console.log("no state to restore");
            return state;
        }


        // Set flag before restoration
        state.setIsUndoRedoOperation(true)

        // Reset flag after a short delay
        setTimeout(() => {
            state.setIsUndoRedoOperation(false)
        }, 5000)

        restoreCallback(next)

        setTimeout(() => {
            state.dispatchHistoryChange();
        }, 100)

        return {
            past: [...state.past, next],
            future: newFuture,
            canUndo: true,
            canRedo: newFuture.length > 0,
            isCurrentState: false,
        }

    }),
}))

// Export the event name for components to use
export { HISTORY_CHANGE_EVENT };