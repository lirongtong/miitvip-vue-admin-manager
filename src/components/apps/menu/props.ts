import { array } from 'vue-types'
import { PropTypes } from '../../../utils/types'

/**
 * +===========================+
 * |       菜单项树形结构       |
 * +===========================+
 * @param id 序号
 * @param pid 父级序号
 * @param type 类型 ( 一级菜单 | 子菜单 | 按钮 )
 * @param name 名称 ( 唯一性 )
 * @param path 访问地址
 * @param page 前端组件页面
 * @param title 标题
 * @param sub_title 子标题
 * @param value 值 ( 适配 Antdv Table Tree 数据结构 )
 * @param icon 图标
 * @param weight 权重
 * @param lang 语言标识
 * @param children 子菜单项
 */
export interface MenuTreeItem {
    [key: string | number]: any
    id: string | number
    pid: string | number
    type: string | number
    name: string
    title: string
    sub_title: string
    path: string
    page: string
    value: string | number
    icon: string | number
    weight: number
    lang: string
    children: Partial<MenuTreeItem>[]
}
/**
 * +=========================+
 * |       树形菜单结构       |
 * +=========================+
 * @param title 菜单显示名称
 * @param value 菜单值 ( 适配 Antdv Table Tree 数据结构 )
 * @param children 子菜单项
 */
export interface MenuTree {
    [key: string | number]: any
    title: string
    value: string | number
    children?: Partial<MenuTreeItem>[]
}

/**
 * +=========================+
 * |       菜单配置属性       |
 * +=========================+
 * @param paginationLocale Antdv 分页组件多语言配置
 * @param data 自定义菜单数据
 * @param getMenusAction 获取菜单数据的接口地址或自定义方法
 * @param getMenusMethod 获取菜单数据的接口请求方式 ( string 时有效 )
 * @param getMenusParams 获取菜单数据的接口参数
 * @param createMenusAction 新增菜单的接口地址或自定义方法
 * @param createMenusMethod 新增菜单的接口请求方式 ( string 时有效 )
 * @param createMenusParams 新增菜单的接口参数
 * @param updateMenusAction 更新菜单的接口地址或自定义方法
 * @param updateMenusMethod 更新菜单的接口请求方式 ( string 时有效 )
 * @param updateMenusParams 更新菜单的接口参数
 * @param deleteMenusAction 删除菜单的接口地址或自定义方法
 * @param deleteMenusMethod 删除菜单的接口请求方式 ( string 时有效 )
 * @param deleteMenusParams 删除菜单的接口参数
 * @param checkNameExistAction 校验菜单名称是否存在的接口地址或自定义方法
 * @param checkNameExistMethod 校验菜单名称是否存在的接口请求方式 ( string 时有效 )
 * @param checkNameExistParams 校验菜单名称是否存在的接口参数
 */
export interface MenuTreeProperties {
    [key: string | number]: any
    paginationLocale: any
    data: Partial<MenuTreeItem>[]
    getMenusAction: string | Function
    getMenusMethod: string
    getMenusParams: Record<any, any>
    createMenusAction: string | Function
    createMenusMethod: string
    createMenusParams: Record<any, any>
    updateMenusAction: string | Function
    updateMenusMethod: string
    updateMenusParams: Record<any, any>
    deleteMenusAction: string | Function
    deleteMenusMethod: string
    deleteMenusParams: Record<any, any>
    checkNameExistAction: string | Function
    checkNameExistMethod: string
    checkNameExistParams: Record<any, any>
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
    deleteMenusParams: PropTypes.object.def({}),
    checkNameExistAction: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
    checkNameExistMethod: PropTypes.string.def('get'),
    checkNameExistParams: PropTypes.object.def({})
})
