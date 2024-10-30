import { array } from 'vue-types'
import { PropTypes } from '../../../utils/types'

/**
 * +===========================+
 * |       导航项树形结构       |
 * +===========================+
 * @param id 导航项唯一标识
 * @param pid 父级导航项唯一标识
 * @param type 导航项类型 ( 一级导航 / 子导航 / 按钮导航 )
 * @param name 导航项记录名称 ( 英文 )
 * @param path 路由地址
 * @param page 路由组件名称
 * @param title 导航项显示名称
 * @param value 导航项唯一标识 ( 中文 )
 * @param cid 导航项所属应用ID
 * @param icon 图标名称
 * @param weight 权重
 * @param lang 语言标识
 * @param children 子导航项
 */
export interface NavTreeItem {
    [key: string | number]: any
    id: string | number
    pid: string | number
    type: string | number
    name: string
    path: string
    page: string
    title: string | number
    value: string | number
    cid: string | number
    icon: string | number
    weight: number
    lang: string
    children: Partial<NavTreeItem>[]
}
/**
 * +=========================+
 * |       树形导航结构       |
 * +=========================+
 * @param title 导航显示名称
 * @param value 导航值
 * @param children 子导航项
 */
export interface NavTree {
    [key: string | number]: any
    title: string
    value: string | number
    children?: Partial<NavTreeItem>[]
}

/**
 * +=========================+
 * |       导航配置属性       |
 * +=========================+
 * @param paginationLocale Antdv 分页组件多语言配置
 * @param data 自定义导航数据
 * @param getNavsAction 获取导航数据的接口地址或自定义方法
 * @param getNavsMethod 获取导航数据的接口请求方式 ( string 时有效 )
 * @param getNavsParams 获取导航数据的接口参数
 * @param createNavsAction 新增导航的接口地址或自定义方法
 * @param createNavsMethod 新增导航的接口请求方式 ( string 时有效 )
 * @param createNavsParams 新增导航的接口参数
 * @param updateNavsAction 更新导航的接口地址或自定义方法
 * @param updateNavsMethod 更新导航的接口请求方式 ( string 时有效 )
 * @param updateNavsParams 更新导航的接口参数
 * @param deleteNavsAction 删除导航的接口地址或自定义方法
 * @param deleteNavsMethod 删除导航的接口请求方式 ( string 时有效 )
 * @param deleteNavsParams 删除导航的接口参数
 */
export interface NavTreeProperties {
    [key: string | number]: any
    paginationLocale: any
    data: Partial<NavTreeItem>[]
    getNavsAction: string | Function
    getNavsMethod: string
    getNavsParams: Record<any, any>
    createNavsAction: string | Function
    createNavsMethod: string
    createNavsParams: Record<any, any>
    updateNavsAction: string | Function
    updateNavsMethod: string
    updateNavsParams: Record<any, any>
    deleteNavsAction: string | Function
    deleteNavsMethod: string
    deleteNavsParams: Record<any, any>
}

export const NavTreeProps = () => ({
    paginationLocale: PropTypes.any,
    data: array<Partial<NavTreeItem>[]>().def([]),
    getNavsAction: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
    getNavsMethod: PropTypes.string.def('get'),
    getNavsParams: PropTypes.object.def({}),
    createNavsAction: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
    createNavsMethod: PropTypes.string.def('post'),
    createNavsParams: PropTypes.object.def({}),
    updateNavsAction: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
    updateNavsMethod: PropTypes.string.def('put'),
    updateNavsParams: PropTypes.object.def({}),
    deleteNavsAction: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
    deleteNavsMethod: PropTypes.string.def('delete'),
    deleteNavsParams: PropTypes.object.def({})
})
