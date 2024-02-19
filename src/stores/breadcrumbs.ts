import { defineStore } from 'pinia'

export const useBreadcrumbsStore = defineStore('breadcrumbs', {
    state: () => ({
        breadcrumbs: [] as any[]
    })
})

export default useBreadcrumbsStore
