import { defineStore } from 'pinia'
import { $g } from '../utils/global'
import { $storage } from '../utils/storage'

export const useHistoricalStore = defineStore('historical', {
    state: () => ({
        routes: JSON.parse($storage.get($g.caches.storages?.routes) || '{}')
    }),
    actions: {
        setRoutes(routes?: Record<string, any>) {
            this.routes = routes
            $storage.set($g.caches.storages?.routes, JSON.stringify(routes))
        }
    }
})

export default useHistoricalStore
