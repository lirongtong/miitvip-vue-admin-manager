import { object } from 'vue-types'
import { tuple } from './../_utils/props'
import { type DeviceSize, PropTypes, type TextSetting } from '../../utils/types'

/**
 * +==========================+
 * |       ButtonArrow        |
 * +==========================+
 * @param direction 箭头方向
 * @param animation 动画方向
 * @param delay 动画延迟时长
 * @param immediate 初始化组件后是否立即执行箭头动画
 * @param color 箭头颜色
 */
export interface ButtonArrow {
    direction?: 'up' | 'down' | 'right' | 'left'
    animation?: 'up' | 'down' | 'right' | 'left'
    delay?: number
    immediate?: boolean
    color?: string
}

/**
 * +===============================+
 * |       ButtonProperties        |
 * +===============================+
 * @param text 文案内容
 * @param link 链接地址
 * @param query 链接参数
 * @param target 链接打开方式
 * @param width 宽度
 * @param height 高度
 * @param circle 是否为圆形
 * @param background 背景色
 * @param arrow 图标设置
 */
export interface ButtonProperties {
    text?: string | TextSetting
    link?: string
    target?: '_blank' | '_self'
    query?: Record<string, any>
    width?: number | string | DeviceSize
    height?: number | string | DeviceSize
    circle?: boolean
    background?: string
    arrow?: ButtonArrow
}

export const ButtonProps = () => ({
    text: PropTypes.oneOfType([PropTypes.string, object<TextSetting>()]),
    link: PropTypes.string,
    query: PropTypes.object.def({}),
    target: PropTypes.oneOf(tuple(...['_blank', '_self'])).def('_self'),
    width: PropTypes.oneOfType([PropTypes.number, PropTypes.string, object<DeviceSize>()]).def(36),
    height: PropTypes.oneOfType([PropTypes.number, PropTypes.string, object<DeviceSize>()]).def(36),
    square: PropTypes.bool.def(false),
    circle: PropTypes.bool.def(true),
    background: PropTypes.string,
    arrow: object<ButtonArrow>()
})
