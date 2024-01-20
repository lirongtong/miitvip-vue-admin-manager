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
 * 组件
 * @param layout 布局
 *
 * @see LayoutTokens
 */
export interface ComponentTokens {
    [key: string]: any
    layout: Partial<LayoutTokens>
    notice: Partial<NoticeTokens>
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
