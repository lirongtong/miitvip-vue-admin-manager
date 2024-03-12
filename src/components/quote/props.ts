import { PropTypes } from '../../utils/types'

/**
 * +====================+
 * |       Quote        |
 * +====================+
 * @param background 背景色
 * @param color 文案颜色
 */
export interface QuoteProperties {
    background: string
    color: string
}
export const QuoteProps = () => ({
    background: PropTypes.string,
    color: PropTypes.string
})
