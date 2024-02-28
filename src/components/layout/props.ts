import { object } from 'vue-types'
import { PropTypes } from '../../utils/types'
import type { BreadcrumbProperties } from '../breadcrumb/props'
import type { SearchProperties } from '../search/props'
import type { NoticeProperties } from '../notice/props'

/**
 * 布局属性
 * @param showBreadcrumbs 是否显示面包屑
 * @param contentSetting 内容组件的配置参数
 * @param header 顶栏<slot />
 * @param headerSetting 顶栏组件的配置参数
 * @param sider 侧边栏<slot />
 * @param siderSetting 侧边栏组件的配置参数
 * @param footer 页脚<slot />
 */
export interface LayoutProperties {
    showBreadcrumbs: boolean
    header: any
    sider: any
    footer: any
    headerSetting: Partial<LayoutHeaderProperties>
    siderSetting: Partial<LayoutSiderProperties>
    contentSetting: Partial<LayoutContentProperties>
}
export const LayoutProps = () => ({
    showBreadcrumbs: PropTypes.bool.def(true),
    header: PropTypes.any,
    sider: PropTypes.any,
    footer: PropTypes.any,
    headerSetting: object<Partial<LayoutHeaderProperties>>(),
    siderSetting: object<Partial<LayoutSiderProperties>>(),
    contentSetting: object<Partial<LayoutContentProperties>>()
})

/**
 * 布局顶栏配置
 * @param notice 消息配置<Slot />
 * @param dropdown 下拉菜单配置<Slot />
 * @param breadcrumb 面包屑配置<Slot />
 * @param breadcrumbSetting 面包屑组件配置
 * @param search 搜索配置<Slot />
 * @param searchSetting 搜索组件属性配置
 * @param palette 调色板<Slot />
 * @param extra 额外的自定义配置<Slot />(置于右侧)
 */
export interface LayoutHeaderProperties {
    notice: any
    dropdown: any
    breadcrumb: any
    breadcrumbSetting: Partial<BreadcrumbProperties>
    search: any
    searchSetting: Partial<SearchProperties>
    palette: any
    extra: any
}
export const LayoutHeaderProps = () => ({
    notice: PropTypes.any,
    dropdown: PropTypes.any,
    breadcrumb: PropTypes.any,
    breadcrumbSetting: object<Partial<BreadcrumbProperties>>(),
    search: PropTypes.any,
    searchSetting: object<Partial<SearchProperties>>(),
    palette: PropTypes.any,
    extra: PropTypes.any
})

/**
 * 布局侧边属性
 * @param logo 图标
 * @param menu 菜单
 * @param background 背景色
 */
export interface LayoutSiderProperties {
    logo: any
    menu: any
    background: string
    logoSetting: Partial<LayoutSiderLogoProperties>
}
export const LayoutSiderProps = () => ({
    logo: PropTypes.any,
    logoSetting: object<Partial<LayoutSiderLogoProperties>>(),
    menu: PropTypes.any,
    background: PropTypes.string
})

/**
 * 布局侧边LOGO配置
 * @param circle 圆形显示LOGO
 * @param collapsed 展开/收起按钮配置<Slot />
 * @param notice 消息配置<Slot />
 */
export interface LayoutSiderLogoProperties {
    circle: boolean
    collapsed: any
    notice: any
    noticeSetting: NoticeProperties
}
export const LayoutSiderLogoProps = () => ({
    circle: PropTypes.bool.def(true),
    collapsed: PropTypes.any,
    notice: PropTypes.any,
    noticeSetting: object<NoticeProperties>()
})

/**
 * 布局内容属性
 * @param animation 切换动画
 * @param showHistoryMenu 显示历史菜单
 * @param footer 页脚配置 <Slot />
 */
export interface LayoutContentProperties {
    animation?: string
    showHistoryMenu?: boolean
    footer?: any
}
export const LayoutContentProps = () => ({
    animation: PropTypes.string.def('page-slide'),
    showHistoryMenu: PropTypes.bool.def(true),
    footer: PropTypes.any
})
