import { App, reactive } from 'vue'
import { $g } from './global'

/**
 * 默认常用接口地址.
 * ( 接口地址可直接通过 this.api 进行覆盖或新增 ).
 * @type {object}
 */
export const api: any = reactive({
    login: 'login',
    logout: 'logout',
    register: 'register',
    refresh: 'oauth/refresh',
    authorize: 'oauth/{socialite}/login',
    captcha: {
        init: 'captcha/init',
        verify: 'captcha/verify'
    },
    email: {
        active: 'email/active/{token}',
        resend: 'email/active/resend'
    },
    validator: {
        name: 'validator/name',
        email: 'validator/email',
        user: 'validator/user'
    },
    password: {
        forget: 'password/forget',
        reset: 'password/reset',
        captcha: 'password/captcha/send',
        check: 'password/captcha/check'
    }
})

class MiApi {
    version: string

    constructor() {
        this.version = $g.apiVersion
        this.parse()
    }

    /**
     * API 链接解析.
     * 根据配置判断是否增加版本信息.
     * @param _api
     */
    parse(_api?: { [index: string]: any }) {
        if (this.version) {
            _api = _api ?? api
            for (const i in _api) {
                if (Object.prototype.hasOwnProperty.call(_api, i)) {
                    if (typeof _api[i] === 'object' && Object.keys(_api[i]).length > 0) {
                        // 递归
                        this.parse(_api[i])
                    } else {
                        // 校验 url ( 不带 http/ftp 等协议的全路径 )
                        const reg = $g.regExp.url
                        if (!reg.test(_api[i]) && this.version) {
                            // 封装API, 增加版本
                            _api[i] =
                                _api[i].indexOf(`${this.version}/`) !== -1
                                    ? _api[i]
                                    : `${this.version}/${_api[i]}`
                        }
                    }
                }
            }
        }
    }
}

export const $api: MiApi = new MiApi()

export default {
    install(app: App) {
        app.config.globalProperties.$api = $api
        app.config.globalProperties.api = api
        app.provide('$api', $api)
        app.provide('api', api)
        return app
    }
}
