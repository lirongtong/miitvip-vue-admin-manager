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
 * @param captcha 滑块验证码
 *
 * @see LayoutTokens
 * @see NoticeTokens
 * @see ClockTokens
 * @see CaptchaTokens
 */
export interface ComponentTokens {
    [key: string]: any
    layout: Partial<LayoutTokens>
    notice: Partial<NoticeTokens>
    clock: Partial<ClockTokens>
    captcha: Partial<CaptchaTokens>
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
 * +==========================+
 * |      导航菜单 - Menu      |
 * +==========================+
 * @param background 背景色
 * @param text 文案色
 * @param collapsed 收缩菜单后的配置
 * @param submenu 子菜单配置
 *
 * @see MenuSubmenuToken
 */
export interface MenuTokens {
    text: string
    background: string
    collapsed: Partial<{ tooltip: Partial<{ text: string; background: string }> }>
    submenu: Partial<MenuSubmenuToken>
}
/**
 * @param item 子选项的 arrow 配置
 * @param popup 收缩状态下的子菜单弹窗配置
 */
export interface MenuSubmenuToken {
    item: Partial<{ title: Partial<{ arrow: Partial<{ default: string; active: string }> }> }>
    popup: Partial<{ text: string; border: string; background: string }>
}
/**
 * @param text 菜单选项的默认文案颜色
 * @param title 菜单选项的 Title 配置
 * @param background 菜单选项背景设置
 *
 * @see MenuItemTitleTokens
 * @see GradientTokens
 */
export interface MenuItemTokens {
    text: string
    title: Partial<MenuItemTitleTokens>
    background: Partial<{ default: string; active: Partial<GradientTokens> }>
}
/**
 * @param text 标题颜色
 * @param sub 子标题颜色
 * @param active 选中状态的标题及子标题颜色配置
 */
export interface MenuItemTitleTokens {
    text: string
    sub: string
    active: Partial<{ text: string; sub: string; icon: string }>
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

/**
 * +=========================+
 * |        滑块验证码        |
 * +=========================+
 * @param radar 雷达配置
 * @param modal 弹窗配置
 *
 * @see CaptchaRadarTokens
 * @see CaptchaModalTokens
 */
export interface CaptchaTokens {
    [key: string]: any
    radar: Partial<CaptchaRadarTokens>
    modal: Partial<CaptchaModalTokens>
}
/**
 * @param border 边框
 * @param text 文本
 * @param ready 准备状态的背景色
 * @param ring 大圆圈
 * @param dot 小圆点
 * @param scan 扫描状态的边框
 * @param success 成功图标及背景色
 */
export interface CaptchaRadarTokens {
    [key: string]: any
    border: string
    text: string
    ready: { background: Partial<GradientTokens> }
    ring: string
    dot: string
    scan: Partial<{ border: string }>
    success: Partial<{ icon: string; background: string }>
}
/**
 * @param arrow 箭头
 * @param content 内容
 *
 * @see CaptchaModalContentTokens
 */
export interface CaptchaModalTokens {
    [key: string]: any
    arrow: Partial<{ border: Partial<{ in: string; out: string }> }>
    content: Partial<CaptchaModalContentTokens>
}
/**
 * @param border 边框
 * @param shadow 阴影
 * @param background 背景色
 * @param loading 加载状态
 * @param result 结果展示
 * @param slider 滑动条
 * @param panel 底部面板
 */
export interface CaptchaModalContentTokens {
    [key: string]: any
    border: string
    shadow: string
    background: Partial<GradientTokens>
    loading: Partial<{
        [key: string]: any
        text: string
        background: Partial<GradientTokens>
        spinner: string
    }>
    result: Partial<{
        [key: string]: any
        text: string
        success: Partial<{ [key: string]: any; text: string; background: string }>
        error: Partial<{ [key: string]: any; text: string; background: string }>
    }>
    slider: Partial<{
        [key: string]: any
        text: string
        background: string
        btn: Partial<{
            [key: string]: any
            border: string
            shadow: string
            scan: Partial<{
                [key: string]: any
                line: string
                background: string
            }>
        }>
    }>
    panel: Partial<{
        [key: string]: any
        icon: string
        border: string
        copyright: Partial<{ [key: string]: any; border: string }>
    }>
}
