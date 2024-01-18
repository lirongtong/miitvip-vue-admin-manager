import { type VueTypeValidableDef } from 'vue-types'
import { PropTypes, DefaultProps } from '../../utils/types'

/**
 * 布局属性
 * @param contentSetting 内容组件的配置参数
 * @param showHistoryMenu 是否显示历史菜单
 * @param showBreadcrumbs 是否显示面包屑
 * @param header 顶栏<slot />
 * @param headerSetting 顶栏组件的配置参数
 * @param sider 侧边栏<slot />
 * @param siderSetting 侧边栏组件的配置参数
 * @param footer 页脚<slot />
 */
export type LayoutProperties = {
    showHistoryMenu?: VueTypeValidableDef<boolean>
    showBreadcrumbs?: VueTypeValidableDef<boolean>
    contentSetting?: VueTypeValidableDef<LayoutContentProperties>
    header?: VueTypeValidableDef<any>
    headerSetting?: VueTypeValidableDef<LayoutHeaderProperties>
    sider?: VueTypeValidableDef<any>
    siderSetting?: VueTypeValidableDef<LayoutSiderProperties>
    footer?: VueTypeValidableDef<any>
}
export const LayoutProps = (): LayoutProperties & DefaultProps => ({
    prefixCls: PropTypes.string,
    showHistoryMenu: PropTypes.bool.def(true),
    showBreadcrumbs: PropTypes.bool.def(true),
    contentSetting: PropTypes.object,
    header: PropTypes.any,
    headerSetting: PropTypes.object,
    sider: PropTypes.any,
    siderSetting: PropTypes.object,
    footer: PropTypes.any
})

/**
 * 布局顶栏配置
 * @param stretch 展开/收起按钮配置<Slot />
 * @param notice 消息配置<Slot />
 * @param dropdown 下拉菜单配置<Slot />
 * @param breadcrumb 面包屑配置<Slot />
 * @param custom 自定义配置<Slot />(置于右侧)
 */
export type LayoutHeaderProperties = {
    stretch?: VueTypeValidableDef<any>
    notice?: VueTypeValidableDef<any>
    dropdown?: VueTypeValidableDef<any>
    breadcrumb?: VueTypeValidableDef<any>
    custom?: VueTypeValidableDef<any>
}
export const LayoutHeaderProps = (): LayoutHeaderProperties & DefaultProps => ({
    prefixCls: PropTypes.string,
    stretch: PropTypes.any,
    notice: PropTypes.any,
    dropdown: PropTypes.any,
    breadcrumb: PropTypes.any,
    custom: PropTypes.any
})

/**
 * 布局侧边属性
 * @param logo 图标
 * @param menu 菜单
 * @param background 背景色
 */
export type LayoutSiderProperties = {
    logo?: VueTypeValidableDef<any>
    logoSetting?: VueTypeValidableDef<LayoutSiderLogoProperties>
    menu?: VueTypeValidableDef<any>
    background?: VueTypeValidableDef<string>
}
export const LayoutSiderProps = (): LayoutSiderProperties & DefaultProps => ({
    prefixCls: PropTypes.string,
    logo: PropTypes.any,
    logoSetting: PropTypes.object,
    menu: PropTypes.any,
    background: PropTypes.string
})

/**
 * 布局侧边LOGO配置
 * @param vertical 竖排
 */
export type LayoutSiderLogoProperties = {
    circle?: VueTypeValidableDef<boolean>
    vertical?: VueTypeValidableDef<boolean>
}
export const LayoutSiderLogoProp = (): LayoutSiderLogoProperties & DefaultProps => ({
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
    animation?: VueTypeValidableDef<string>
    showHistoryMenu?: VueTypeValidableDef<boolean>
    footer?: VueTypeValidableDef<any>
}
export const LayoutContentProps = (): LayoutContentProperties & DefaultProps => ({
    prefixCls: PropTypes.string,
    animation: PropTypes.string.def('page-slide'),
    showHistoryMenu: PropTypes.bool.def(true),
    footer: PropTypes.any
})
