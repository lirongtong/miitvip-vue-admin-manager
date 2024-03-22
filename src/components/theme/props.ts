import { object } from 'vue-types'
import { ComponentTokens, ThemeTokens } from './tokens'

/**
 * +====================+
 * |       Theme        |
 * +====================+
 * @param theme 主题配置
 *  - `Record<string, any>`
 *  - 全局一次性载入配置
 *
 * e.g.
 * ```
 * <mi-theme :theme="{ theme: '#f0c26f', components: { layout: { content: { background: '#333' } } } }">
 *     <mi-layout>
 *         // ...
 *     </mi-layout>
 * </mi-theme>
 * ```
 * @see ThemeTokens
 */
export interface ThemeProperties {
    theme: Partial<ThemeTokens>
}
export const ThemeProps = () => ({
    theme: object<Partial<ThemeTokens>>()
})

/**
 * +============================+
 * |       Theme Provider       |
 * +============================+
 * @param tokens 独立组件 Token 配置
 */
export interface ThemeProviderProperties {
    tokens: Partial<ComponentTokens>
}

export const ThemeProviderProps = () => ({
    tokens: object<Partial<ComponentTokens>>().def({})
})
