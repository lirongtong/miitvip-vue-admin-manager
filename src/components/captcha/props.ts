import { PropTypes, type DeviceSize, type Position } from '../../utils/types'
import { object } from 'vue-types'
import { methods, tuple } from '../_utils/props'
import type { AxiosRequestConfig } from 'axios'

/**
 * +======================+
 * |       Captcha        |
 * +======================+
 * @param width 触发位置的宽度
 * @param height 触发位置的高度
 * @param radius 触发位置的圆角弧度
 * @param color 主题色
 * @param image 验证码底图
 * @param logo 图标
 * @param link Logo 点击跳转的链接地址
 * @param mask 开启遮罩
 * @param maskClosable 遮罩可否点击关闭
 * @param boxShadow 是否显示阴影
 * @param maxTries 最大尝试次数
 * @param initParams 初始化参数
 * @param initMethod 初始化接口请求方式
 * @param initAction 初始化操作动作
 * @param verifyParams 校验验证码参数
 * @param verifyMethod 校验验证码接口请求方式
 * @param verifyAction 校验验证码操作动作
 * @param checkParams 初始化验证码前的验证参数
 * @param checkMethod 初始化验证码前的验证接口请求方式
 * @param checkAction 初始化验证码前的验证操作动作
 * @param actionConfig 请求配置( axios config )
 */
export interface CaptchaProperties {
    width: string | number | DeviceSize
    height: string | number | DeviceSize
    radius: string | number | DeviceSize
    color: string
    image: string
    logo: string
    link: string
    mask: boolean
    maskClosable: boolean
    boxShadow: boolean
    maxTries: number
    initParams: object
    initMethod: string
    initAction: string | Function
    verifyParams: object
    verifyMethod: string
    verifyAction: string | Function
    checkParams: object
    checkMethod: string
    checkAction: string | Function
    actionConfig: AxiosRequestConfig
}
export const CaptchaProps = () => ({
    width: PropTypes.oneOfType([PropTypes.string, PropTypes.number, object<DeviceSize>()]).def(320),
    height: PropTypes.oneOfType([PropTypes.string, PropTypes.number, object<DeviceSize>()]),
    radius: PropTypes.oneOfType([PropTypes.string, PropTypes.number, object<DeviceSize>()]).def(48),
    color: PropTypes.string.def(undefined),
    image: PropTypes.string.def(undefined),
    logo: PropTypes.string.def(undefined),
    link: PropTypes.string.def(undefined),
    mask: PropTypes.bool.def(true),
    maskClosable: PropTypes.bool.def(true),
    boxShadow: PropTypes.bool.def(true),
    maxTries: PropTypes.number.def(5),
    initParams: PropTypes.object.def({}),
    initMethod: PropTypes.oneOf(tuple(...methods)).def('get'),
    initAction: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
    verifyParams: PropTypes.object.def({}),
    verifyMethod: PropTypes.oneOf(tuple(...methods)).def('post'),
    verifyAction: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
    checkParams: PropTypes.object.def({}),
    checkMethod: PropTypes.oneOf(tuple(...methods)).def('post'),
    checkAction: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
    actionConfig: object<AxiosRequestConfig>().def({})
})

/**
 * +===========================+
 * |       Captcha Modal       |
 * +===========================+
 * @param open 弹窗开启状态
 * @param position 弹窗弹出位置
 * @param image 验证码底图
 * @param color 主题色
 * @param mask 遮罩
 * @param maskClosable 遮罩可点击关闭
 * @param maxTries 验证最大尝试的错误次数
 * @param verifyParams 校验验证码参数
 * @param verifyMethod 校验验证码接口请求方式
 * @param verifyAction 校验验证码操作动作
 * @param actionConfig 请求配置( axios config )
 */
export interface CaptchaModalProperties {
    open: boolean
    position: Position
    image: string
    color: string
    mask: boolean
    maskClosable: boolean
    maxTries: number
    verifyParams: object
    verifyMethod: string
    verifyAction: string | Function
    actionConfig: AxiosRequestConfig
}
export const CaptchaModalProps = () => ({
    open: PropTypes.bool.def(false),
    position: object<Position>(),
    image: PropTypes.string.def(undefined),
    color: PropTypes.string.def(undefined),
    mask: PropTypes.bool.def(true),
    maskClosable: PropTypes.bool.def(true),
    maxTries: PropTypes.number.def(5),
    verifyParams: PropTypes.object.def({}),
    verifyMethod: PropTypes.oneOf(tuple(...methods)).def('post'),
    verifyAction: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
    actionConfig: object<AxiosRequestConfig>().def({})
})

export interface CaptchaModalBlockPosition {
    type: string
    direction: keyof Position
}
