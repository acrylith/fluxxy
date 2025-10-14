import { create } from "zustand"

interface paramState {
    theme: string,
    sidebarOpened: boolean,
    setTheme: (by:string) => void
    sidebarToggle: () => void
}

const appSettingsStore = (set:any) => ({
    theme: "dark",
    sidebarOpened: false,
    setTheme: (value:string) => set({ theme: value }),
    sidebarToggle: () => set((state: paramState) => ({ ...state, sidebarOpened: !state.sidebarOpened }))
})

const useAppSettings = create<paramState>(appSettingsStore)
export default useAppSettings