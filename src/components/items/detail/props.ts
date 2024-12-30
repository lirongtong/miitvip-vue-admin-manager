import { array, object } from 'vue-types'
import {
    type DeviceSize,
    PropTypes,
    type TextSetting,
    type ThumbSetting,
    type Gap
} from '../../../utils/types'
import { tuple, animations } from '../../_utils/props'

export interface DetailItem {
    [key: string]: any
    title?: string | TextSetting
    subtitle?: string | TextSetting
    thumb?: string
}

/**
 * +====================================+
 * |       ItemsDetailProperties        |
 * +====================================+
 * @param active 当前展开项 ( v-model )
 * @param data 数据
 * @param number 一行显示个数
 * @param maxWidth 容器最大宽度 ( 默认 100% )
 * @param gap 间距
 * @param animation 详情容器弹出动画
 * @param arrowColor 箭头颜色
 * @param titleSetting 标题设置
 * @param subtitleSetting 副标题设置
 * @param thumbSetting 缩略图设置
 */
export interface ItemsDetailProperties {
    active?: number
    data?: DetailItem[]
    number?: number | string | DeviceSize
    maxWidth?: string | number | DeviceSize
    gap?: number | string | DeviceSize | Gap
    animation?: string
    arrowColor?: string
    titleSetting?: TextSetting
    subtitleSetting?: TextSetting
    thumbSetting?: ThumbSetting
}

export const ItemsDetailProps = () => ({
    active: PropTypes.number.def(-1),
    data: array<DetailItem>().def([]),
    number: PropTypes.oneOfType([PropTypes.number, PropTypes.string, object<DeviceSize>()]).def({
        mobile: 1,
        tablet: 2,
        laptop: 3
    }),
    maxWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.number, object<DeviceSize>()]).def(
        '100%'
    ),
    gap: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
        object<DeviceSize>(),
        object<Gap>()
    ]).def(16),
    animation: PropTypes.oneOf(tuple(...animations)).def('shake'),
    arrowColor: PropTypes.string,
    titleSetting: object<TextSetting>(),
    subtitleSetting: object<TextSetting>(),
    thumbSetting: object<ThumbSetting>()
})
