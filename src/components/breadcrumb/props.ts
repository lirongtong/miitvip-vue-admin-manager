import { PropTypes, DefaultProps } from '../../utils/types'

/**
 * 面包屑
 * @param separator 分隔符
 * @param animation 动画效果
 */
export interface BreadcrumbProperties extends DefaultProps {
    separator?: string
    animation?: string
}
export const BreadcrumbProps = () => ({
    prefixCls: PropTypes.string,
    separator: PropTypes.string.def('/'),
    animation: PropTypes.string.def('breadcrumb')
})
