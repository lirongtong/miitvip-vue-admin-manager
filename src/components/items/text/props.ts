import { VNodeTypes } from 'vue'
import { type DeviceSize, type Position, type SizeColor, PropTypes } from '../../../utils/types'
import { object, array } from 'vue-types'

/**
 * +=======================+
 * |       TextItem        |
 * +=======================+
 * @param title 项目标题
 * @param intro 项目介绍
 * @param gap 项目间距
 * @param items 项目内容
 */
export interface TextItem {
    [key: string]: any
    title?: string
    intro?: string
    gap?: string | number | DeviceSize
    items?: string[]
}

/**
 * +=============================+
 * |       TextItemMarker        |
 * +=============================+
 * @param type 项目标记类型
 * @param prefix 项目标记前缀
 * @param suffix 项目标记后缀
 * @param color 项目标记颜色 ( square / circle 有效 )
 * @param size 项目标记大小 ( square / circle 有效 )
 * @param gap 项目标记与内容的间距
 * @param center 项目标记是否居中
 * @param margin 项目标记外边距
 */
export interface TextItemMarker extends SizeColor {
    [key: string]: any
    type?:
        | 'square'
        | 'circle'
        | 'letter'
        | 'number'
        | 'upper-letter'
        | 'upper-number'
        | 'roman-number'
    prefix?: string
    suffix?: string
    gap?: number | string | DeviceSize
    center?: boolean
    margin?: number | string | Position
}

/**
 * +=================================+
 * |       TextItemBackground        |
 * +=================================+
 * @param color 背景颜色
 * @param image 背景图片
 * @param aspectRatio 背景图片宽高比
 */
export interface TextItemBackground {
    [key: string]: any
    color?: string
    image?: string
    aspectRatio?: number
}

/**
 * +=============================+
 * |       TextItemBorder        |
 * +=============================+
 * @param color 边框颜色
 * @param width 边框大小
 */
export interface TextItemBorder {
    color?: string
    width?: number | string | DeviceSize
}

/**
 * +==============================+
 * |       TextItemContent        |
 * +==============================+
 * @param color 内容颜色
 * @param size 字体大小
 * @param bold 是否加粗
 * @param margin 外边距
 */
export interface TextItemContent extends SizeColor {
    [key: string]: any
    bold?: boolean
    margin?: number | string | Position
}

/**
 * +============================+
 * |       TextItemTitle        |
 * +============================+
 * @see TextItemContent
 * @param marker 标题标记配置
 */
export interface TextItemTitle extends TextItemContent {
    marker?: TextItemMarker
}

/**
 * +========================+
 * |       ItemsText        |
 * +========================+
 * @see TextItem
 * @see TextItemMarker
 *
 * @param items 列表
 * @param marker 标记配置
 * @param size 文案字体大小
 * @param bold 文案是否加粗
 * @param center 是否居中
 * @param padding 组件容器内边距
 * @param indent 项目缩进
 * @param gap 每个项目之间的间距
 * @param border 边框配置
 * @param radius 圆角
 * @param background 背景配置
 * @param title 标题配置
 * @param intro 内容配置
 * @param item 项目自定义内容<Slot />
 */
export interface ItemsTextProperties {
    items?: string[] | TextItem[]
    marker?: TextItemMarker
    size?: number | string | DeviceSize
    bold?: boolean
    center?: boolean
    padding?: number | string | Position
    indent?: number | string | DeviceSize
    gap?: number | string | DeviceSize
    border?: TextItemBorder
    radius?: number | string | DeviceSize
    background?: TextItemBackground
    title?: TextItemTitle
    intro?: TextItemContent
    item?: VNodeTypes
}

export const ItemsTextProps = () => ({
    items: PropTypes.oneOfType([array<string>(), array<TextItem>()]).def([]),
    marker: object<TextItemMarker>(),
    size: PropTypes.oneOfType([PropTypes.string, PropTypes.number, object<DeviceSize>()]).def(16),
    bold: PropTypes.bool.def(false),
    center: PropTypes.bool.def(false),
    padding: PropTypes.oneOfType([PropTypes.string, PropTypes.number, object<Position>()]).def(0),
    indent: PropTypes.oneOfType([PropTypes.string, PropTypes.number, object<DeviceSize>()]).def(0),
    gap: PropTypes.oneOfType([PropTypes.string, PropTypes.number, object<DeviceSize>()]).def(0),
    border: object<TextItemBorder>(),
    radius: PropTypes.oneOfType([PropTypes.string, PropTypes.number, object<DeviceSize>()]).def(0),
    background: object<TextItemBackground>(),
    title: object<TextItemTitle>(),
    intro: object<TextItemContent>(),
    item: PropTypes.any
})

/**
 * +==============================+
 * |       ItemsTextMarker        |
 * +==============================+
 * @param marker 项目标记配置
 * @param number 项目标记数字 ( type = number/upper-number/letter/upper-letter 时有效 )
 */
export interface ItemsTextMarkerProperties {
    marker?: TextItemMarker
    number?: number
}

export const ItemsTextMarkerProps = () => ({
    marker: object<TextItemMarker>(),
    number: PropTypes.number
})
