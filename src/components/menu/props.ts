import { array, object } from 'vue-types'
import { PropTypes, type MenuItem } from '../../utils/types'

/**
 * +==========================+
 * |       Menu Common        |
 * +==========================+
 * @param item 单个菜单选项配置
 *
 * @see MenuItem
 */
interface MenuCommonProperties {
    item: MenuItem
}
const MenuCommonProps = () => ({
    item: object<MenuItem>()
})

/**
 * +===================+
 * |       Menu        |
 * +===================+
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
 * +=======================+
 * |       Menu Sub        |
 * +=======================+
 * @param pKey 子菜单的父节点 key 值
 *
 * @see MenuCommonProperties
 */
export interface MenuSubProperties extends MenuCommonProperties {}
export const MenuSubProps = MenuCommonProps

/**
 * +========================+
 * |       Menu Item        |
 * +========================+
 * @see MenuCommonProperties
 */
export interface MenuItemProperties extends MenuCommonProperties {}
export const MenuItemProps = MenuCommonProps

/**
 * +==============================+
 * |       Menu Item Title        |
 * +==============================+
 * @param activeKey 选中的子菜单 key 值
 * @see MenuCommonProperties
 */
export interface MenuTitleProperties extends MenuCommonProperties {
    activeKey: string
}
export const MenuTitleProperties = () => ({
    item: object<MenuItem>(),
    activeKey: PropTypes.string
})
