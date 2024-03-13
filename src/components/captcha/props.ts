import { PropTypes, type DeviceSize } from '../../utils/types'
import { object } from 'vue-types'

/**
 * +======================+
 * |       Captcha        |
 * +======================+
 * @param width 触发位置的宽度
 * @param height 触发位置的高度
 * @param radius 触发位置的圆角弧度
 * @param mask 开启遮罩
 * @param maskClosable 遮罩可否点击关闭
 */
export interface CaptchaProperties {
    width: string | number | DeviceSize
    height: string | number | DeviceSize
    radius: string | number | DeviceSize
    mask: boolean
    maskClosable: boolean
}
export const CaptchaProps = () => ({
    width: PropTypes.oneOfType([PropTypes.string, PropTypes.number, object<DeviceSize>()]).def(320),
    height: PropTypes.oneOfType([PropTypes.string, PropTypes.number, object<DeviceSize>()]),
    radius: PropTypes.oneOfType([PropTypes.string, PropTypes.number, object<DeviceSize>()]).def(48),
    mask: PropTypes.bool.def(true),
    maskClosable: PropTypes.bool.def(true)
})
