import { array, object } from 'vue-types'
import { PropTypes, type MenuItem, type DeviceSize } from '../../utils/types'
import { tuple } from '../_utils/props'

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
    indent: number | string | DeviceSize
    items: MenuItem[]
}
export const MenuProps = () => ({
    indent: PropTypes.oneOfType([PropTypes.number, PropTypes.string, object<DeviceSize>()]).def(16),
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

/**
 * +===========================+
 * |       Drawer Menu         |
 * +===========================+
 * @param open v-model
 * @param width 宽度
 * @param placement 弹出方向
 * @param zIndex 层级
 * @param mask 是否展示遮罩
 * @param maskClosable 点击蒙层是否允许关闭
 */
export interface DrawerMenuProperties {
    open: boolean
    width: string | number | DeviceSize
    placement: string
    zIndex: number
    mask: boolean
    maskClosable: boolean
}
export const DrawerMenuProps = () => ({
    open: PropTypes.bool.def(false),
    width: PropTypes.oneOfType([PropTypes.number, PropTypes.string, object<DeviceSize>()]).def(256),
    placement: PropTypes.oneOf(tuple(...['left', 'right', 'top', 'bottom'])).def('left'),
    zIndex: PropTypes.number.def(Date.now()),
    mask: PropTypes.bool.def(true),
    maskClosable: PropTypes.bool.def(true)
})
