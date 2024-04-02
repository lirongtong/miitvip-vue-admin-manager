import { type VNodeTypes } from 'vue'
import { CaptchaProperties } from '../captcha/props'
import { PropTypes } from '../../utils/types'
import { object } from 'vue-types'
import { tuple, methods } from '../_utils/props'

/**
 * +=====================+
 * |       Forget        |
 * +=====================+
 * @param title 标题
 * @param video 背景视频 ( 优先级高于 `background` )
 * @param background 背景图
 * @param rules Form Rules 校验
 * @param content 内容配置<Slot />
 * @param footer 页脚配置<Slot />
 * @param captcha 是否开启验证码
 * @param captchaSetting 验证码组件配置
 * @param redirectTo 成功后的跳转地址
 * @param loginLink 登录地址
 * @param registerLink 注册地址
 * @param sendCodeParams 发送验证码的参数配置
 * @param sendCodeMethod 发送验证码的请求方式
 * @param sendCodeAction 发送验证码的接口地址或逻辑处理方法 ( 必填 )
 * @param checkUsernameParams 校验输入框内容的参数配置
 * @param checkUsernameMethod 校验输入框内容的请求方式
 * @param checkUsernameAction 校验输入框内容的接口地址或逻辑处理方法
 * @param checkCodeParams 校验验证码的参数配置
 * @param checkCodeMethod 校验验证码的请求方式
 * @param checkCodeAction 校验验证码的接口地址或逻辑处理方法 ( 必填 )
 * @param resetPasswordParams 重置密码的参数配置
 * @param resetPasswordMethod 重置密码的请求方式
 * @param resetPasswordAction 重置密码的接口地址或逻辑处理方法 ( 必填 )
 * @param resendDowntime 重新发送验证码倒计时时长
 *
 * @see CaptchaProperties
 */
export interface ForgetProperties {
    title: string
    video: string
    background: string
    rules: object
    content: VNodeTypes
    footer: VNodeTypes
    captcha: boolean
    captchaSetting: Partial<CaptchaProperties>
    redirectTo: string
    loginLink: string
    registerLink: string
    sendCodeParams: object
    sendCodeMethod: string
    sendCodeAction: string | Function
    checkUsernameParams: object
    checkUsernameMethod: string
    checkUsernameAction: string | Function
    checkCodeParams: object
    checkCodeMethod: string
    checkCodeAction: string | Function
    resetPasswordParams: object
    resetPasswordMethod: string
    resetPasswordAction: string | Function
    resendDowntime: number
}

export const ForgetProps = () => ({
    title: PropTypes.string,
    video: PropTypes.string,
    background: PropTypes.string.def(undefined),
    rules: PropTypes.object.def({}),
    content: PropTypes.any,
    footer: PropTypes.any,
    captcha: PropTypes.bool.def(true),
    captchaSetting: object<Partial<CaptchaProperties>>().def({}),
    redirectTo: PropTypes.string.def('/login'),
    loginLink: PropTypes.string.def('/login'),
    registerLink: PropTypes.string.def('/register'),
    sendCodeParams: PropTypes.object.def({}),
    sendCodeMethod: PropTypes.oneOf(tuple(...methods)).def('post'),
    sendCodeAction: PropTypes.oneOfType([PropTypes.string, PropTypes.func]).isRequired,
    checkUsernameParams: PropTypes.object.def({}),
    checkUsernameMethod: PropTypes.oneOf(tuple(...methods)).def('post'),
    checkUsernameAction: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
    checkCodeParams: PropTypes.object.def({}),
    checkCodeMethod: PropTypes.oneOf(tuple(...methods)).def('post'),
    checkCodeAction: PropTypes.oneOfType([PropTypes.string, PropTypes.func]).isRequired,
    resetPasswordParams: PropTypes.object.def({}),
    resetPasswordMethod: PropTypes.oneOf(tuple(...methods)).def('put'),
    resetPasswordAction: PropTypes.oneOfType([PropTypes.string, PropTypes.func]).isRequired,
    resendDowntime: PropTypes.number.def(120)
})

/**
 * +===================+
 * |       表单        |
 * +===================+
 * @param username 用户名 / 邮箱 / 手机号
 * @param captcha 开启验证码
 * @param cuid 用于校验 captcha 组件的验证码
 * @param code 邮件验证码
 * @param uuid 用于校验页面合法性
 */
export interface ForgetFormParams {
    username?: string
    captcha?: boolean
    cuid?: string
    code?: number | string
    uuid?: string | number
}
/**
 * +========================+
 * |       邮件验证码        |
 * +========================+
 * @param code 邮件验证码
 * @param uuid 用于校验页面合法性
 */
export interface ForgetCodeParams {
    code?: number | string
    uuid?: string | number
}
/**
 * +======================+
 * |       重置密码        |
 * +======================+
 * @param password 新密码
 * @param confirm 确认新密码
 */
export interface ForgetUpdateFormParams {
    password?: string
    confirm?: string
}
