/**
 * 颜色配置
 * @param color 颜色值
 * @param gradient 渐变色
 *
 * @see BackgroundGradientTokens
 */
export interface BackgroundTokens {
    color: string
    gradient: Partial<BackgroundGradientTokens>
}

/**
 * 渐变色
 * @param start 渐变线的起始点颜色值
 * @param hint 相邻色标之间的渐变过程颜色值
 * @param stop 色标位置的颜色值
 */
export interface BackgroundGradientTokens {
    start: string
    hint: string
    stop: string
}

export interface LayoutHeaderTokens {
    text: string
    background: string
}

export interface LayoutSiderTokens {
    logo: Partial<LayoutSiderLogoTokens>
}

/**
 * 布局内容
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
 * 布局侧边LOGO
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
 * 布局
 * @param background Layout.Main 背景色
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
 * 消息中心
 * @param icon 图标颜色
 */
export interface NoticeTokens {
    icon: string
}

/**
 * 时钟
 * @param shadow 阴影颜色
 * @param background 背景色
 * @param hour.text 小时刻度颜色
 * @param minute.text 分钟刻度颜色
 * @param minute.line 分针颜色
 * @param point.background 指针默认背景色
 * @param point.second 秒针背景色 ( 单独设定 )
 * @param pointer.background 时分秒针汇聚的中间点颜色
 * @param pointer.mid 中间点中间层颜色 ( 大小不一, 层叠 )
 * @param pointer.top 中间点最上层颜色 ( 大小不一, 层叠 )
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
 * 组件
 * @param layout 布局
 *
 * @see LayoutTokens
 */
export interface ComponentTokens {
    [key: string]: any
    layout: Partial<LayoutTokens>
    notice: Partial<NoticeTokens>
    clock: Partial<ClockTokens>
}

/**
 * 主题
 * @param primary 主题色
 * @param radius 圆角
 * @param components 组件
 *
 * @see ComponentTokens
 */
export interface ThemeTokens {
    [key: string]: any
    primary: string
    radius: number
    components: Partial<ComponentTokens>
}
