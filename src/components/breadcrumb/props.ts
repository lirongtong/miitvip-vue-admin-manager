import { tuple, animations } from './../_utils/props'
import { PropTypes } from '../../utils/types'

/**
 * +=====================+
 * |       面包屑        |
 * +=====================+
 * @param separator 分隔符
 * @param animation 动画效果
 */
export interface BreadcrumbProperties {
    separator?: string
    animation?: string
}
export const BreadcrumbProps = () => ({
    separator: PropTypes.string.def('/'),
    animation: PropTypes.oneOf(tuple(...animations)).def('breadcrumb')
})
