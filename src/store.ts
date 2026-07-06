import { create } from "zustand"

interface AppState {
  isLoading: boolean
  finishLoading: () => void
}

export const useAppStore = create<AppState>((set) => ({
  isLoading: true,
  finishLoading: () => set({ isLoading: false }),
}))
