import { object, array } from 'vue-types'
import { PropTypes, type DeviceSize, type Position, type TextSetting } from '../../../utils/types'
import { tuple } from '../../_utils/props'

/**
 * +===============================+
 * |       ListItemDividing        |
 * +===============================+
 * @param color 颜色
 * @param height 高度
 * @param margin 间距
 */
export interface ListItemDividing {
    color?: string
    height?: string | number | DeviceSize
    margin?: string | number | Position
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
 * @param scale Hover 悬停时放大图片 (1.2)
 * @param align 对齐方式
 * @param margin 外间距
 */
export interface ListItemThumb {
    width?: string | number | DeviceSize
    height?: string | number | DeviceSize
    radius?: string | number | DeviceSize
    background?: string
    scale?: boolean
    align?: 'start' | 'end' | 'center'
    margin?: number | string | Position
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
 * @param author 作者
 * @param category 分类
 */
export interface ListItem {
    [key: string]: any
    id?: string | number
    thumb?: string
    title?: string | TextSetting
    date?: string | TextSetting
    intro?: string | TextSetting
    link?: string
    target?: '_self' | '_blank'
    query?: object
    author?: string
    category?: string
}

/**
 * +==================================+
 * |       ItemsListProperties        |
 * +==================================+
 * @param type 显示类型
 * @param data 数据
 * @param thumbSetting 缩略图配置
 * @param titleSetting 标题通用设置 ( 首选 Item 内的独立配置, 次选通用配置 )
 * @param introSetting 简介通用设置 ( 首选 Item 内的独立配置, 次选通用配置 )
 * @param dateSetting 日期通用设置 ( 首选 Item 内的独立配置, 次选通用配置 )
 * @param radius 容器圆角 ( 同时适用卡片类型 )
 * @param background 容器背景色
 * @param padding 容器内间距
 * @param dividing 分割线 ( 仅在非卡片显示时有效 )
 *
 * @see ListItem
 * @see ListItemThumb
 * @see ListItemDividing
 */
export interface ItemsListProperties {
    type?: 'card' | 'list'
    data?: ListItem[]
    thumbSetting?: ListItemThumb
    titleSetting?: TextSetting
    introSetting?: TextSetting
    dateSetting?: TextSetting
    radius?: string | number | DeviceSize
    background?: string
    padding?: string | number | Position
    dividing?: ListItemDividing
}

export const ItemsListProps = () => ({
    type: PropTypes.oneOf(tuple(...['card', 'list'])).def('list'),
    data: array<ListItem>().def([]),
    thumbSetting: object<ListItemThumb>(),
    titleSetting: object<TextSetting>(),
    introSetting: object<TextSetting>(),
    dateSetting: object<TextSetting>(),
    radius: PropTypes.oneOfType([PropTypes.number, PropTypes.string, object<DeviceSize>()]),
    background: PropTypes.string,
    padding: PropTypes.oneOfType([PropTypes.number, PropTypes.string, object<Position>()]).def(16),
    dividing: object<ListItemDividing>()
})
