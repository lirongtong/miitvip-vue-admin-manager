import { VNodeTypes } from 'vue'
import { PropTypes } from '../../utils/types'
import { object } from 'vue-types'
import type { CaptchaProperties } from '../captcha/props'
import { SocialiteProperties } from '../socialite/props'

/**
 * +====================+
 * |       Login        |
 * +====================+
 * @param title 标题
 * @param video 背景视频 ( 优先级高于 `background` )
 * @param background 背景图
 * @param rules Form Rules 校验
 * @param content 内容配置<Slot />
 * @param footer 页脚配置<Slot />
 * @param captcha 是否开启验证码
 * @param captchaSetting 验证码组件配置
 * @param action 登录动作
 * @param registerLink 注册链接
 * @param forgetPasswordLink 忘记密码链接
 * @param socialiteLogin 是否为社会化登录回调
 * @param socialiteSetting 社会化登录组件配置
 *
 * @see CaptchaProperties
 */
export interface LoginProperties {
    title: string
    video: string
    background: string
    rules: object
    content: VNodeTypes
    footer: VNodeTypes
    captcha: boolean
    captchaSetting: Partial<CaptchaProperties>
    action: string | Function
    registerLink: string
    forgetPasswordLink: string
    socialiteLogin: boolean
    socialiteSetting: Partial<SocialiteProperties>
}

export const LoginProps = () => ({
    title: PropTypes.string,
    video: PropTypes.string,
    background: PropTypes.string.def(undefined),
    rules: PropTypes.object.def({}),
    content: PropTypes.any,
    footer: PropTypes.any,
    captcha: PropTypes.bool.def(true),
    captchaSetting: object<Partial<CaptchaProperties>>().def({}),
    action: PropTypes.oneOfType([PropTypes.string, PropTypes.func]).isRequired,
    registerLink: PropTypes.string.def('/register'),
    forgetPasswordLink: PropTypes.string.def('/forget'),
    socialiteLogin: PropTypes.bool.def(false),
    socialiteSetting: object<Partial<SocialiteProperties>>().def({})
})

export interface LoginFormParams {
    url?: string
    username?: string
    password?: string
    remember?: boolean
    captcha?: boolean
    cuid?: number | string
}
