import { type VueTypeValidableDef } from 'vue-types'
import { PropTypes, DefaultProps } from '../../utils/types'

/**
 * 面包屑
 * @param separator 分隔符
 * @param animation 动画效果
 */
export type BreadcrumbProperties = {
    separator?: VueTypeValidableDef<string>
    animation?: VueTypeValidableDef<string>
}
export const BreadcrumbProps = (): BreadcrumbProperties & DefaultProps => ({
    prefixCls: PropTypes.string,
    separator: PropTypes.string.def('/'),
    animation: PropTypes.string.def('breadcrumb')
})
