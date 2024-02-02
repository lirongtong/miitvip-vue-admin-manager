import { defineStore } from 'pinia'
import { MenuItem } from '../utils/types'

/**
 * Menu Store States.
 * @param menus 所有选单的 key 值
 * @param accordion 手风琴模式
 * @param openKeys 打开的子菜单 key 值数组
 * @param activeKeys 当前选中的菜单项 key 值数组
 * @param relationshipChain 选中菜单的关系链
 */
export const useMenuStore = defineStore('menus', {
    state: () => ({
        menus: [] as MenuItem[],
        accordion: true,
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