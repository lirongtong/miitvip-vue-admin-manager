import { Theme } from '../../utils/types'
/**
 * +====================+
 * |        背景        |
 * +====================+
 * @param color 颜色值
 * @param gradient 渐变色
 *
 * @see GradientTokens
 */
export interface BackgroundTokens {
    color: string
    gradient: Partial<GradientTokens>
}

/**
 * +=======================+
 * |        颜色状态        |
 * +=======================+
 * @param default 默认
 * @param active 选中
 * @param hover 悬停
 */
export interface ColorStateTokens {
    default: string
    active: string
    hover: string
}

/**
 * +=======================+
 * |         渐变色        |
 * +=======================+
 * @param start 渐变线的起始点颜色值
 * @param hint 相邻色标之间的渐变过程颜色值
 * @param stop 色标位置的颜色值
 */
export interface GradientTokens {
    start: string
    hint: string
    stop: string
}

/**
 * +====================+
 * |        主题        |
 * +====================+
 * @param theme 主题 ( 深色 / 浅色 )
 * @param primary 主题色
 * @param radius 圆角
 * @param components 组件
 *
 * @see Theme
 * @see ComponentTokens
 */
export interface ThemeTokens extends Theme {
    [key: string]: any
    theme: string
    primary: string
    radius: number
    components: Partial<ComponentTokens>
}

/**
 * +====================+
 * |        组件        |
 * +====================+
 * @param layout 布局
 * @param notice 消息中心
 * @param clock 时钟
 *
 * @see LayoutTokens
 * @see NoticeTokens
 * @see ClockTokens
 */
export interface ComponentTokens {
    [key: string]: any
    layout: Partial<LayoutTokens>
    notice: Partial<NoticeTokens>
    clock: Partial<ClockTokens>
}

/**
 * +====================+
 * |        布局        |
 * +====================+
 * @param background Layout.Main
 * @param header Layout.Header
 * @param sider Layout.Sider
 * @param content Layout.Content
 *
 * @see LayoutHeaderTokens
 * @see LayoutSiderTokens
 * @see LayoutContentTokens
 */
export interface LayoutTokens {
    [key: string]: any
    background: string
    header: Partial<LayoutHeaderTokens>
    sider: Partial<LayoutSiderTokens>
    content: Partial<LayoutContentTokens>
}

/**
 * +=============================+
 * |        布局 - Header        |
 * +=============================+
 */
export interface LayoutHeaderTokens {
    text: string
    background: string
}

/**
 * +============================+
 * |        布局 - Sider        |
 * +============================+
 * @param logo 图标
 *
 * @see LayoutSiderLogoTokens
 */
export interface LayoutSiderTokens {
    logo: Partial<LayoutSiderLogoTokens>
}

/**
 * +=================================+
 * |        布局 - Sider Logo        |
 * +=================================+
 * @param text 文案
 * @param border 边框
 * @param collapsed 菜单ICON
 * @param notice 消息ICON
 * @param trigger 触发器背景
 */
export interface LayoutSiderLogoTokens {
    text: string
    border: string
    collapsed: string
    notice: string
    trigger: string
}

/**
 * +==============================+
 * |        布局 - Content        |
 * +==============================+
 * @param text 文案
 * @param mask 遮罩
 * @param shadow 阴影
 * @param background 背景
 */
export interface LayoutContentTokens {
    text: string
    mask: string
    shadow: string
    background: string
}

/**
 * +====================+
 * |      消息中心      |
 * +====================+
 * @param background 弹窗背景色
 * @param icon 图标颜色
 * @param border 边框颜色
 * @param text 文案颜色 ( 默认空状态时 )
 * @param tab 选项卡文案颜色
 * @param item 选项配置
 *
 * @see NoticeTabTokens
 * @see NoticeItemTokens
 */
export interface NoticeTokens {
    text: string
    border: string
    background: string
    tab: Partial<NoticeTabTokens>
    item: Partial<NoticeItemTokens>
}

/**
 * +==========================+
 * |      消息中心 - Tab      |
 * +==========================+
 * @param text 文案
 * @param icon 图标颜色
 * @param background 背景色
 *
 * @see ColorStateTokens
 * @see GradientTokens
 */
export interface NoticeTabTokens {
    text: Partial<ColorStateTokens>
    icon: Partial<ColorStateTokens>
    background: Partial<GradientTokens> & { default?: string }
}

/**
 * +==========================+
 * |      消息中心 - Item      |
 * +==========================+
 * @param background 背景色
 * @param border 边框色
 * @param text 文案色
 * @param avatar 头像边框颜色
 * @param summary 摘要文案颜色
 * @param date 摘要文案颜色
 * @param tag 标签配置
 * @param content 消息详情配置
 *
 * @see NoticeItemTagTokens
 * @see NoticeItemContentTokens
 */
export interface NoticeItemTokens {
    background: string
    border: string
    text: string
    avatar: string
    summary: string
    date: string
    tag: Partial<NoticeItemTagTokens>
    content: Partial<NoticeItemContentTokens>
}
export interface NoticeItemTagTokens {
    border: string
    background: string
    text: string
}
export interface NoticeItemContentTokens {
    border: string
    background: string
    text: string
}

/**
 * +====================+
 * |        时钟        |
 * +====================+
 * @param shadow 阴影颜色
 * @param background 背景色
 * @param hour.text 小时刻度文案颜色
 * @param minute.text 分钟刻度文案颜色
 * @param minute.line 分针刻度线颜色
 * @param point.background 指针默认背景色
 * @param point.second 秒针背景色 ( 单独设定 )
 * @param pointer.background 时分秒针汇聚的中间点颜色
 * @param pointer.mid 中间点中间层颜色 ( 大小不一, 层叠 )
 * @param pointer.top 中间点最上层颜色 ( 大小不一, 层叠 )
 *
 * @see BackgroundTokens
 */
export interface ClockTokens {
    shadow: string
    background: Partial<BackgroundTokens>
    hour: Partial<{ text: string }>
    minute: Partial<{ text: string; line: string }>
    point: Partial<{ background: string; hour: string; minute: string; second: string }>
    pointer: Partial<{ background: string; mid: string; top: string }>
}
