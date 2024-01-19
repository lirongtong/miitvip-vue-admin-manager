export interface LayoutHeaderTokens {
    text: string
    background: string
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

export interface LayoutTokens {
    [key: string]: any
    header: Partial<LayoutHeaderTokens>
    content: Partial<LayoutContentTokens>
}

export interface ComponentTokens {
    [key: string]: any
    layout: Partial<LayoutTokens>
}

export interface ThemeTokens {
    [key: string]: any
    theme: string
    radius: number
    components: Partial<ComponentTokens>
}
