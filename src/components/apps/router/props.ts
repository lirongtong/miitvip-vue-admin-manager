import { array } from 'vue-types'
import { PropTypes } from '../../../utils/types'

/**
 * +===========================+
 * |       路由项树形结构       |
 * +===========================+
 * @param id 路由项唯一标识
 * @param pid 父级路由项唯一标识
 * @param type 路由项类型 ( 顶层路由 / 子路由 )
 * @param name 路由项名称 ( 唯一性 )
 * @param path 路由地址
 * @param page 路由组件名称
 * @param title 路由项显示名称
 * @param weight 权重 ( 值越大越靠前 )
 * @param children 子路由项
 */
export interface RouterTreeItem {
    [key: string | number]: any
    id: string | number
    pid: string | number
    type: string | number
    name: string
    path: string
    page: string
    title: string
    weight: number
    children: Partial<RouterTreeItem>[]
}
/**
 * +=========================+
 * |       树形路由结构       |
 * +=========================+
 * @param title 路由显示名称
 * @param value 路由值
 * @param children 子路由项
 */
export interface RouterTree {
    [key: string | number]: any
    title: string
    value: string | number
    children?: Partial<RouterTreeItem>[]
}

/**
 * +=========================+
 * |       路由配置属性       |
 * +=========================+
 * @param paginationLocale Antdv 分页组件多语言配置
 * @param data 自定义路由数据
 * @param getRouterAction 获取路由数据的接口地址或自定义方法
 * @param getRouterMethod 获取路由数据的接口请求方式 ( string 时有效 )
 * @param getRouterParams 获取路由数据的接口参数
 * @param createRouterAction 新增路由的接口地址或自定义方法
 * @param createRouterMethod 新增路由的接口请求方式 ( string 时有效 )
 * @param createRouterParams 新增路由的接口参数
 * @param updateRouterAction 更新路由的接口地址或自定义方法
 * @param updateRouterMethod 更新路由的接口请求方式 ( string 时有效 )
 * @param updateRouterParams 更新路由的接口参数
 * @param deleteRouterAction 删除路由的接口地址或自定义方法
 * @param deleteRouterMethod 删除路由的接口请求方式 ( string 时有效 )
 * @param deleteRouterParams 删除路由的接口参数
 * @param checkRouterNameExistAction 校验路由名称是否存在的接口地址或自定义方法
 * @param checkRouterNameExistMethod 校验路由名称是否存在的接口请求方式 ( string 时有效 )
 * @param checkRouterNameExistParams 校验路由名称是否存在的接口参数
 */
export interface RouterTreeProperties {
    [key: string | number]: any
    paginationLocale: any
    data: Partial<RouterTreeItem>[]
    getRouterAction: string | Function
    getRouterMethod: string
    getRouterParams: Record<any, any>
    createRouterAction: string | Function
    createRouterMethod: string
    createRouterParams: Record<any, any>
    updateRouterAction: string | Function
    updateRouterMethod: string
    updateRouterParams: Record<any, any>
    deleteRouterAction: string | Function
    deleteRouterMethod: string
    deleteRouterParams: Record<any, any>
    checkRouterNameExistAction: string | Function
    checkRouterNameExistMethod: string
    checkRouterNameExistParams: Record<any, any>
}

export const RouterTreeProps = () => ({
    paginationLocale: PropTypes.any,
    data: array<Partial<RouterTreeItem>[]>().def([]),
    getRouterAction: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
    getRouterMethod: PropTypes.string.def('get'),
    getRouterParams: PropTypes.object.def({}),
    createRouterAction: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
    createRouterMethod: PropTypes.string.def('post'),
    createRouterParams: PropTypes.object.def({}),
    updateRouterAction: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
    updateRouterMethod: PropTypes.string.def('put'),
    updateRouterParams: PropTypes.object.def({}),
    deleteRouterAction: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
    deleteRouterMethod: PropTypes.string.def('delete'),
    deleteRouterParams: PropTypes.object.def({}),
    checkRouterNameExistAction: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
    checkRouterNameExistMethod: PropTypes.string.def('get'),
    checkRouterNameExistParams: PropTypes.object.def({})
})
