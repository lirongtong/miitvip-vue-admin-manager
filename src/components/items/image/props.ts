import { object } from 'vue-types'
import { type DeviceSize, type Gap, PropTypes, type TextSetting } from '../../../utils/types'

/**
 * +=============================+
 * |       ImageItemHover        |
 * +=============================+
 * @param open 开启 hover 效果
 * @param animation 上下左右滑动出现
 * @param background 背景颜色
 * @param backdrop 背景过滤
 * @param scale 图片放大至区域宽高100%
 */
export interface ImageItemHover {
    open?: boolean
    animation?: 'slide-up' | 'slide-down' | 'slide-left' | 'slide-right'
    background?: string
    backdrop?: string
    scale?: boolean
}

/**
 * +========================+
 * |       ImageItem        |
 * +========================+
 * @param title 标题
 * @param subtitle 子标题
 * @param intro 介绍
 * @param thumb 缩略图
 * @param link 链接地址
 * @param target 链接打开方式
 */
export interface ImageItem {
    title?: string | TextSetting
    subtitle?: string | TextSetting
    intro?: string | TextSetting
    thumb?: string
    link?: string
    target?: '_self' | '_blank'
}

/**
 * +===================================+
 * |       ItemsImageProperties        |
 * +===================================+
 * @param data 数据
 * @param number 一行显示个数
 * @param width 每一项的显示宽度 ( 未配置时, 以 100% 宽度与一行显示项为基础自适应宽度 )
 * @param height 每一项的显示高度 ( 适用图片高度不一致时自定义限制统一高度 )
 * @param radius 每一项的圆角
 * @param gap 每一项的间距
 * @param hover 鼠标移入效果配置 ( 移动端无效 )
 * @param center 是否居中显示 ( 结合 width 及 gap 设定最大宽度后居中 - 默认 100% 宽度居中 )
 * @param lineColor 下划线颜色值
 */
export interface ItemsImageProperties {
    data?: ImageItem[]
    number?: number | string | DeviceSize
    width?: number | string | DeviceSize
    height?: number | string | DeviceSize
    radius?: number | string | DeviceSize
    gap?: number | string | DeviceSize | Gap
    hover?: ImageItemHover
    center?: boolean
    lineColor?: string
}

export const ItemsImageProps = () => ({
    data: object<ImageItem[]>(),
    number: PropTypes.oneOfType([PropTypes.number, PropTypes.string, object<DeviceSize>()]).def({
        mobile: 1,
        tablet: 3,
        laptop: 4
    }),
    width: PropTypes.oneOfType([PropTypes.number, PropTypes.string, object<DeviceSize>()]),
    height: PropTypes.oneOfType([PropTypes.number, PropTypes.string, object<DeviceSize>()]),
    radius: PropTypes.oneOfType([PropTypes.number, PropTypes.string, object<DeviceSize>()]).def(8),
    gap: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
        object<DeviceSize>(),
        object<Gap>()
    ]).def(16),
    hover: object<ImageItemHover>(),
    center: PropTypes.bool.def(false),
    lineColor: PropTypes.string
})
