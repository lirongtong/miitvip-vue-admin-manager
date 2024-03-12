import { PropTypes } from '../../utils/types'

/**
 * +===================+
 * |       Code        |
 * +===================+
 * @param language 语言类型
 * @param content 代码内容<Slot />
 */
export interface CodeProperties {
    language: string
    content: any
}
export const CodeProps = () => ({
    language: PropTypes.string.def('html'),
    content: PropTypes.any
})
