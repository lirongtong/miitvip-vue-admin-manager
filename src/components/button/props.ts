import { object } from 'vue-types'
import { tuple } from './../_utils/props'
import { type DeviceSize, PropTypes, type TextSetting } from '../../utils/types'

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
 * @param square 是否为方形
 * @param circle 是否为圆形
 * @param background 背景色
 */
export interface ButtonProperties {
    text?: string | TextSetting
    link?: string
    target?: '_blank' | '_self'
    query?: Record<string, any>
    width?: number | string | DeviceSize
    height?: number | string | DeviceSize
    square?: boolean
    circle?: boolean
    background?: string
}

export const ButtonProps = () => ({
    text: PropTypes.oneOfType([PropTypes.string, object<TextSetting>()]),
    link: PropTypes.string,
    query: PropTypes.object.def({}),
    target: PropTypes.oneOf(tuple(...['_blank', '_self'])).def('_self'),
    width: PropTypes.oneOfType([PropTypes.number, PropTypes.string, object<DeviceSize>()]).def(36),
    height: PropTypes.oneOfType([PropTypes.number, PropTypes.string, object<DeviceSize>()]).def(36),
    square: PropTypes.bool.def(true),
    circle: PropTypes.bool.def(false),
    background: PropTypes.string
})
