import { defineStore } from 'pinia'
import { MenuItem } from '../utils/types'

export const useMenuStore = defineStore('menus', {
    state: () => ({
        menus: [] as MenuItem[]
    }),
    actions: {
        updateMenus(menus: MenuItem[]) {
            this.menus = menus
        }
    }
})

export default useMenuStore
