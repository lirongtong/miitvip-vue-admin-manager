import { defineStore } from 'pinia'
import { $g } from '../utils/global'
import { $storage } from '../utils/storage'

export const useHistoricalStore = defineStore('historical', {
    state: () => ({
        routes: ($storage.get($g.caches.storages?.routes) || {}) as Record<string, any>
    }),
    actions: {
        setRoutes(routes?: Record<string, any>) {
            this.routes = routes
            $storage.set($g.caches.storages?.routes, routes)
        }
    }
})

export default useHistoricalStore
