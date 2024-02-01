import { array, object } from 'vue-types'
import { PropTypes, type MenuItem } from '../../utils/types'

/**
 * +==========================+
 * |       Menu Common        |
 * +==========================+
 * @param item 单个菜单选项配置
 * @param showTitle 是否显示菜单名称
 * @param collapsed 菜单是否是收起状态
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
 * @see MenuCommonProperties
 */
export interface MenuTitleProperties extends MenuCommonProperties {}
export const MenuTitleProperties = MenuCommonProps
