import { array, object } from 'vue-types'
import { PropTypes, type MenuItem } from '../../utils/types'

/**
 * 菜单属性
 * @param indent 缩进
 * @param items 菜单
 *
 * @see MenuItem
 */
export interface MenuProperties {
    indent: number | string
    items: MenuItem[]
}
export const MenuProps = () => ({
    indent: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).def(16),
    items: array<MenuItem>().def([])
})

/**
 * 菜单选项
 * @param item 单个菜单选项配置
 *
 * @see MenuItem
 */
export interface MenuItemProperties {
    item: MenuItem
}
export const MenuItemProps = () => ({
    item: object<MenuItem>()
})
