import { defineStore } from 'pinia'
import { $g } from '../utils/global'
import { $storage } from '../utils/storage'

export const useLayoutStore = defineStore('layout', {
    state: () => ({
        collapsed: ($storage.get($g.caches.storages?.collapsed) || false) as boolean
    }),
    actions: {
        updateCollapsed() {
            this.collapsed = !this.collapsed
            $storage.set($g.caches.storages?.collapsed, this.collapsed)
        }
    }
})

export default useLayoutStore
