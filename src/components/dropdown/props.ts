import { PropTypes, type DropdownItem } from '../../utils/types'
import { tuple, placement, actions } from './../_utils/props'
import { array, object } from 'vue-types'

/**
 * +=======================+
 * |       Dropdown        |
 * +=======================+
 * @param title 显示名称
 * @param placement popup 弹出位置
 * @param trigger 触发方式
 * @param items 数据
 * @param overlay 首选的下拉菜单<Slot />
 */
export interface DropdownProperties {
    title: any
    placement: string
    trigger: string
    items: Partial<DropdownItem>[]
    overlay: any
}
export const DropdownProps = () => ({
    title: PropTypes.any,
    placement: PropTypes.oneOf(tuple(...placement)).def('bottom'),
    trigger: PropTypes.oneOf(tuple(...actions)).def('click'),
    items: array<Partial<DropdownItem>>().def([]),
    overlay: PropTypes.any
})

/**
 * +===========================+
 * |       Dropdown Item       |
 * +===========================+
 * @param item 数据
 *
 * @see DropdownItem
 */
export interface DropdownItemProperties {
    item: Partial<DropdownItem>
}
export const DropdownItemProps = () => ({
    item: object<Partial<DropdownItem>>().isRequired
})
