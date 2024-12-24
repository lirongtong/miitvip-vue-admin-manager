import { object } from 'vue-types'
import { PropTypes, type DeviceSize } from '../../utils/types'

/**
 * +==============================+
 * |       ImageProperties        |
 * +==============================+
 * @param src 图片地址
 * @param alt 图片描述
 * @param width 宽度
 * @param height 高度
 * @param radius 圆角
 */
export interface ImageProperties {
    src: string
    alt?: string
    width?: string | number | DeviceSize
    height?: string | number | DeviceSize
    radius?: string | number | DeviceSize
}

export const ImageProps = () => ({
    src: PropTypes.string.isRequired,
    alt: PropTypes.string,
    width: PropTypes.oneOfType([PropTypes.string, PropTypes.number, object<DeviceSize>()]),
    height: PropTypes.oneOfType([PropTypes.string, PropTypes.number, object<DeviceSize>()]),
    radius: PropTypes.oneOfType([PropTypes.string, PropTypes.number, object<DeviceSize>()])
})
