import { object } from 'vue-types'
import { PropTypes, DefaultProps } from '../../utils/types'
import type { BreadcrumbProperties } from '../breadcrumb/props'

/**
 * 布局属性
 * @param showHistoryMenu 是否显示历史菜单
 * @param showBreadcrumbs 是否显示面包屑
 * @param contentSetting 内容组件的配置参数
 * @param header 顶栏<slot />
 * @param headerSetting 顶栏组件的配置参数
 * @param sider 侧边栏<slot />
 * @param siderSetting 侧边栏组件的配置参数
 * @param footer 页脚<slot />
 */
export interface LayoutProperties extends DefaultProps {
    showHistoryMenu: boolean
    showBreadcrumbs: boolean
    header: any
    sider: any
    footer: any
    headerSetting: Partial<LayoutHeaderProperties>
    siderSetting: Partial<LayoutSiderProperties>
    contentSetting: Partial<LayoutContentProperties>
}
export const LayoutProps = () => ({
    prefixCls: PropTypes.string,
    showHistoryMenu: PropTypes.bool.def(true),
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
 * @param stretch 展开/收起按钮配置<Slot />
 * @param notice 消息配置<Slot />
 * @param dropdown 下拉菜单配置<Slot />
 * @param breadcrumb 面包屑配置<Slot />
 * @param breadcrumbSetting 面包屑组件配置
 * @param custom 自定义配置<Slot />(置于右侧)
 */
export interface LayoutHeaderProperties extends DefaultProps {
    stretch: any
    notice: any
    dropdown: any
    breadcrumb: any
    custom: any
    breadcrumbSetting: Partial<BreadcrumbProperties>
}
export const LayoutHeaderProps = () => ({
    prefixCls: PropTypes.string,
    stretch: PropTypes.any,
    notice: PropTypes.any,
    dropdown: PropTypes.any,
    breadcrumb: PropTypes.any,
    breadcrumbSetting: object<Partial<BreadcrumbProperties>>(),
    custom: PropTypes.any
})

/**
 * 布局侧边属性
 * @param logo 图标
 * @param menu 菜单
 * @param background 背景色
 */
export interface LayoutSiderProperties extends DefaultProps {
    logo: any
    menu: any
    background: string
    logoSetting: Partial<LayoutSiderLogoProperties>
}
export const LayoutSiderProps = () => ({
    prefixCls: PropTypes.string,
    logo: PropTypes.any,
    logoSetting: object<Partial<LayoutSiderLogoProperties>>(),
    menu: PropTypes.any,
    background: PropTypes.string
})

/**
 * 布局侧边LOGO配置
 * @param circle 圆形显示LOGO
 * @param vertical 竖排
 */
export interface LayoutSiderLogoProperties extends DefaultProps {
    circle: boolean
    vertical: boolean
}
export const LayoutSiderLogoProps = () => ({
    prefixCls: PropTypes.string,
    circle: PropTypes.bool.def(true),
    vertical: PropTypes.bool.def(true)
})

/**
 * 布局内容属性
 * @param animation 切换动画
 * @param showHistoryMenu 显示历史菜单
 * @param footer 页脚配置 <Slot />
 */
export type LayoutContentProperties = {
    animation?: string
    showHistoryMenu?: boolean
    footer?: any
} & DefaultProps
export const LayoutContentProps = () => ({
    prefixCls: PropTypes.string,
    animation: PropTypes.string.def('page-slide'),
    showHistoryMenu: PropTypes.bool.def(true),
    footer: PropTypes.any
})
