import { defineStore } from 'pinia'
import type { SearchData } from '../utils/types'

export const useSearchStore = defineStore('search', {
    state: () => ({ data: [] as Partial<SearchData>[] }) as Record<string, any>,
    actions: {
        updateData(data?: Partial<SearchData>[]) {
            this.data = data || []
        }
    }
})
export default useSearchStore
