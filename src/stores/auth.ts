import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: {} as Record<string, any>,
        token: {
            access: null as string | null,
            refresh: null as string | null
        },
        auto: false
    }),
    actions: {
        login: async () => {}
    }
})
