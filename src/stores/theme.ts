import { defineStore } from 'pinia'
import { $tools } from '../utils/tools'

export const useThemeStore = defineStore('themes', {
    state: () => ({ properties: {} }) as Record<string, any>,
    actions: {
        updateProperties(theme: string) {
            $tools.createThemeProperties(theme)
        }
    }
})

export default useThemeStore
