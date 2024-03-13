import { PropTypes, type DeviceSize } from '../../utils/types'
import { object } from 'vue-types'
import { methods, tuple } from '../_utils/props'

/**
 * +======================+
 * |       Captcha        |
 * +======================+
 * @param width 触发位置的宽度
 * @param height 触发位置的高度
 * @param radius 触发位置的圆角弧度
 * @param mask 开启遮罩
 * @param maskClosable 遮罩可否点击关闭
 * @param maxTries 最大尝试次数
 * @param initParams 初始化参数
 * @param initMethod 初始化接口请求方式
 * @param initAction 初始化操作动作
 * @param verifyParams 校验参数
 * @param verifyMethod 校验接口请求方式
 * @param verifyAction 校验操作动作
 */
export interface CaptchaProperties {
    width: string | number | DeviceSize
    height: string | number | DeviceSize
    radius: string | number | DeviceSize
    mask: boolean
    maskClosable: boolean
    maxTries: number
    initParams: object
    initMethod: string
    initAction: string | Function
    verifyParams: object
    verifyMethod: string
    verifyAction: string | Function
}
export const CaptchaProps = () => ({
    width: PropTypes.oneOfType([PropTypes.string, PropTypes.number, object<DeviceSize>()]).def(320),
    height: PropTypes.oneOfType([PropTypes.string, PropTypes.number, object<DeviceSize>()]),
    radius: PropTypes.oneOfType([PropTypes.string, PropTypes.number, object<DeviceSize>()]).def(48),
    mask: PropTypes.bool.def(true),
    maskClosable: PropTypes.bool.def(true),
    maxTries: PropTypes.number.def(5),
    initParams: PropTypes.object.def({}),
    initMethod: PropTypes.oneOf(tuple(...methods)).def('get'),
    initAction: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
    verifyParams: PropTypes.object.def({}),
    verifyMethod: PropTypes.oneOf(tuple(...methods)).def('get'),
    verifyAction: PropTypes.oneOfType([PropTypes.string, PropTypes.func])
})
