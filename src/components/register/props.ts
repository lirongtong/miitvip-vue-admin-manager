import { VNodeTypes } from 'vue'
import { PropTypes, type VerifyConfig } from '../../utils/types'
import { object } from 'vue-types'
import type { CaptchaProperties } from '../captcha/props'
import type { PasswordProperties } from '../password/props'
import type { SocialiteProperties } from './../socialite/props'

/**
 * +=======================+
 * |       Register        |
 * +=======================+
 * @param title 标题
 * @param video 背景视频 ( 优先级高于 `background` )
 * @param background 背景图
 * @param rules Form Rules 校验
 * @param content 内容配置<Slot />
 * @param footer 页脚配置<Slot />
 * @param captcha 是否开启验证码
 * @param captchaSetting 验证码组件配置
 * @param socialiteSetting 社会化注册组件配置
 * @param action 注册动作
 * @param redirectTo 注册成功后的跳转地址
 * @param passwordSetting 密码组件的配置
 * @param loginLink 登录链接地址
 * @param verify 用户名 & 邮箱校验配置
 * @param usernameTip 用户名提示
 *
 * @see CaptchaProperties
 * @see PasswordProperties
 */
export interface RegisterProperties {
    title: string
    video: string
    background: string
    rules: object
    content: VNodeTypes
    footer: VNodeTypes
    captcha: boolean
    captchaSetting: Partial<CaptchaProperties>
    socialiteSetting: Partial<SocialiteProperties>
    action: string | Function
    redirectTo: string
    passwordSetting: Partial<PasswordProperties>
    loginLink: string
    verify: Partial<RegisterVerifyProperties>
    usernameTip: VNodeTypes
}

export const RegisterProps = () => ({
    title: PropTypes.string,
    video: PropTypes.string,
    background: PropTypes.string.def(undefined),
    rules: PropTypes.object.def({}),
    content: PropTypes.any,
    footer: PropTypes.any,
    captcha: PropTypes.bool.def(true),
    captchaSetting: object<Partial<CaptchaProperties>>().def({}),
    socialiteSetting: object<Partial<SocialiteProperties>>().def({}),
    action: PropTypes.oneOfType([PropTypes.string, PropTypes.func]).isRequired,
    redirectTo: PropTypes.string.def('/'),
    passwordSetting: object<Partial<PasswordProperties>>().def({}),
    loginLink: PropTypes.string.def('/login'),
    verify: object<Partial<RegisterVerifyProperties>>().def({}),
    usernameTip: PropTypes.any
})

export interface RegisterVerifyProperties {
    username: Partial<VerifyConfig>
    email: Partial<VerifyConfig>
}

export interface RegisterFormParams {
    url?: string
    username?: string
    email?: string
    password?: string
    confirm?: string
    captcha?: boolean
    cuid?: number | string
}
