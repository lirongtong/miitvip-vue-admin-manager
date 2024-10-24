import { array } from 'vue-types'
import { PropTypes } from '../../../utils/types'

/**
 * +===========================+
 * |       菜单项树形结构       |
 * +===========================+
 * @param id 菜单项唯一标识
 * @param pid 父级菜单项唯一标识
 * @param type 菜单项类型 ( 一级菜单 / 子菜单 / 按钮菜单 )
 * @param name 菜单项记录名称 ( 英文 )
 * @param path 路由地址
 * @param page 路由组件名称
 * @param title 菜单项显示名称
 * @param value 菜单项唯一标识 ( 中文 )
 * @param cid 菜单项所属应用ID
 * @param icon 图标名称
 * @param weight 权重
 * @param lang 语言标识
 * @param children 子菜单项
 */
export interface MenuTreeItem {
    [key: string | number]: any
    id: string | number
    pid: string | number
    type: string | number
    name: string | number
    path: string
    page: string
    title: string | number
    value: string | number
    cid: string | number
    icon: string | number
    weight: number
    lang: string | number
    children: Partial<MenuTreeItem>[]
}

export interface MenuTree {
    [key: string | number]: any
    title: string
    value: string | number
    children?: Partial<MenuTreeItem>[]
}

export const MenuTreeProps = () => ({
    paginationLocale: PropTypes.any,
    data: array<Partial<MenuTreeItem>[]>().def([]),
    getMenusAction: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
    getMenusMethod: PropTypes.string.def('get'),
    getMenusParams: PropTypes.object.def({}),
    createMenusAction: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
    createMenusMethod: PropTypes.string.def('post'),
    createMenusParams: PropTypes.object.def({}),
    updateMenusAction: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
    updateMenusMethod: PropTypes.string.def('put'),
    updateMenusParams: PropTypes.object.def({}),
    deleteMenusAction: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
    deleteMenusMethod: PropTypes.string.def('delete'),
    deleteMenusParams: PropTypes.object.def({})
})
