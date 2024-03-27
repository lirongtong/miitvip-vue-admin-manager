import { defineStore } from 'pinia'
import type { MenuItem, DropdownItem } from '../utils/types'

/**
 * Menu Store States.
 * @param menus 所有选单的 key 值
 * @param dropdowns 下拉菜单 ( Layout Header )
 * @param accordion 手风琴模式
 * @param openKeys 打开的子菜单 key 值数组
 * @param activeKeys 当前选中的菜单项 key 值数组
 * @param relationshipChain 选中菜单的关系链
 * @param drawer 抽屉式菜单的状态
 */
export const useMenuStore = defineStore('menus', {
    state: () => ({
        menus: [] as MenuItem[],
        dropdowns: [] as Partial<DropdownItem>[],
        accordion: true,
        openKeys: [] as (string | number)[],
        activeKeys: [] as (string | number)[],
        relationshipChain: [] as string[],
        drawer: false
    }),
    actions: {
        updateMenus(menus: MenuItem[]) {
            this.menus = menus
        },
        updateDropdownMenus(menus: Partial<DropdownItem>[]) {
            this.dropdowns = menus
        }
    }
})

export default useMenuStore
