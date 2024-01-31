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
    showTitle: boolean
    collapsed: boolean
}

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
 * +========================+
 * |       Menu Item        |
 * +========================+
 * @see MenuCommonProperties
 */
export interface MenuItemProperties extends MenuCommonProperties {}
export const MenuItemProps = () => ({
    item: object<MenuItem>(),
    showTitle: PropTypes.bool.def(true),
    collapsed: PropTypes.bool.def(false)
})

/**
 * +==============================+
 * |       Menu Item Title        |
 * +==============================+
 * @see MenuCommonProperties
 */
export interface MenuTitleProperties extends MenuCommonProperties {}
export const MenuTitleProperties = () => ({
    item: object<MenuItem>(),
    showTitle: PropTypes.bool.def(true),
    collapsed: PropTypes.bool.def(false)
})
