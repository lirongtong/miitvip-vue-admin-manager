import { PropTypes } from '../../utils/types'

/**
 * 主题属性
 * @param theme 主题配置
 *  - `Record<string, any>`
 *
 * e.g.
 * ```
 * <mi-theme :theme="{ theme: '#f0c26f', components: { layout: { content: { background: '#333' } } } }">
 *     <mi-layout>
 *         // ...
 *     </mi-layout>
 * </mi-theme>
 * ```
 * @returns
 */
export const ThemeProps = () => ({
    prefixCls: PropTypes.string,
    theme: PropTypes.object.def({})
})
