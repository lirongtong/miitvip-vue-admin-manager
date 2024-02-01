import { defineStore } from 'pinia'
import { MenuItem } from '../utils/types'

export const useMenuStore = defineStore('menus', {
    state: () => ({
        menus: [] as MenuItem[],
        accordion: false,
        openKeys: [] as (string | number)[],
        activeKeys: [] as (string | number)[],
        relationshipChain: [] as string[]
    }),
    actions: {
        updateMenus(menus: MenuItem[]) {
            this.menus = menus
        }
    }
})

export default useMenuStore
