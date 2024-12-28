import { array, object } from 'vue-types'
import {
    type DeviceSize,
    PropTypes,
    type TextSetting,
    type ThumbSetting,
    type Gap
} from '../../../utils/types'

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
 * @param data 数据
 * @param fullScreen 展开的详情是否铺满全屏显示 ( 首选配置 )
 * @param fullBlock 展开的详情是否铺满父级容器 ( 与 fullScreen 互斥 )
 * @param number 一行显示个数
 * @param maxWidth 容器最大宽度 ( 默认 100% )
 */
export interface ItemsDetailProperties {
    data?: DetailItem[]
    fullScreen?: boolean
    fullBlock?: boolean
    number?: number | string | DeviceSize
    maxWidth?: string | number | DeviceSize
    gap?: number | string | DeviceSize | Gap
    titleSetting?: TextSetting
    subtitleSetting?: TextSetting
    thumbSetting?: ThumbSetting
}

export const ItemsDetailProps = () => ({
    data: array<DetailItem>().def([]),
    fullScreen: PropTypes.bool.def(false),
    fullBlock: PropTypes.bool.def(true),
    number: PropTypes.oneOfType([PropTypes.number, PropTypes.string, object<DeviceSize>()]).def({
        mobile: 1,
        tablet: 3,
        laptop: 4
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
    titleSetting: object<TextSetting>(),
    subtitleSetting: object<TextSetting>(),
    thumbSetting: object<ThumbSetting>()
})
