import { create } from "zustand"

interface paramState {
    theme: string,
    setTheme: (by:string) => void
}

const appSettingsStore = (set:any) => ({
    theme: "dark",
    setTheme: (value:string) => set({ theme: value })
})

const useAppSettings = create<paramState>(appSettingsStore)
export default useAppSettings