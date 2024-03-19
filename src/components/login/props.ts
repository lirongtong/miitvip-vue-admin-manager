import { VNodeTypes } from 'vue'
import { PropTypes, type DropdownItem } from '../../utils/types'
import { object } from 'vue-types'
import type { CaptchaProperties } from '../captcha/props'

/**
 * +====================+
 * |       Login        |
 * +====================+
 * @param title 标题
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
 * @param socialiteLoginDomain 社会化登录的域名配置
 *
 * @see CaptchaProperties
 */
export interface LoginProperties {
    title: string
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
    socialiteLoginDomain: string
}

export const LoginProps = () => ({
    title: PropTypes.string,
    background: PropTypes.string.def(undefined),
    rules: PropTypes.object.def({}),
    content: PropTypes.any,
    footer: PropTypes.any,
    captcha: PropTypes.bool.def(true),
    captchaSetting: object<Partial<CaptchaProperties>>().def({}),
    action: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
    registerLink: PropTypes.string.def('/register'),
    forgetPasswordLink: PropTypes.string.def('/forget'),
    socialiteLogin: PropTypes.bool.def(false),
    socialiteLoginDomain: PropTypes.string
})

/**
 * +==============================+
 * |       Login Socialite        |
 * +==============================+
 * @param domain 域名
 * @param items 下拉数据
 */
export interface LoginSocialiteProperties {
    domain: string
    items: Partial<DropdownItem>[]
}

export const LoginSocialiteProps = () => ({
    domain: PropTypes.string,
    items: object<Partial<DropdownItem>[]>()
})
