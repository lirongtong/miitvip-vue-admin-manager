import { object } from 'vue-types'
import { PropTypes, type DeviceSize, type Position, type TextSetting } from '../../../utils/types'

/**
 * +===============================+
 * |       ListItemDividing        |
 * +===============================+
 * @param color 颜色
 * @param height 高度
 * @param padding 间距
 */
export interface ListItemDividing {
    color?: string
    height?: string | number | DeviceSize
    padding?: string | number | Position
}

/**
 * +============================+
 * |       ListItemThumb        |
 * +============================+
 * @param src 图片地址
 * @param alt 图片描述
 * @param width 宽度
 * @param height 高度
 * @param radius 圆角
 * @param background 背景色
 * @param scale Hover 悬停时放大图片
 */
export interface ListItemThumb {
    src?: string
    alt?: string
    width?: string | number | DeviceSize
    height?: string | number | DeviceSize
    radius?: string | number | DeviceSize
    background?: string
    scale?: boolean
}

/**
 * +=======================+
 * |       ListItem        |
 * +=======================+
 * @param id 序号
 * @param thumb 缩略图
 * @param title 标题
 * @param date 日期
 * @param intro 简介
 * @param link 链接
 * @param target 链接打开方式
 * @param query 链接参数
 */
export interface ListItem {
    [key: string]: any
    id?: string | number
    thumb?: string | ListItemThumb
    title?: string | TextSetting
    date?: string | TextSetting
    intro?: string | TextSetting
    link?: string
    target?: '_self' | '_blank'
    query?: object
}

/**
 * +==================================+
 * |       ItemsListProperties        |
 * +==================================+
 * @param data 数据
 * @param radius 圆角
 * @param background 背景色
 * @param padding 内间距
 * @param block 分块显示
 * @param dividing 分割线 ( 仅在非分块显示时有效 )
 */
export interface ItemsListProperties {
    data?: ListItem[]
    titleSetting?: TextSetting
    introSetting?: TextSetting
    dateSetting?: TextSetting
    radius?: string | number | DeviceSize
    background?: string
    padding?: string | number | Position
    block?: boolean
    dividing?: ListItemDividing
}

export const ItemsListProps = () => ({
    data: object<ListItem[]>().def([]),
    radius: PropTypes.oneOfType([PropTypes.number, PropTypes.string, object<DeviceSize>()]),
    background: PropTypes.string,
    padding: PropTypes.oneOfType([PropTypes.number, PropTypes.string, object<Position>()]).def(16),
    block: PropTypes.bool.def(false),
    dividing: object<ListItemDividing>()
})
