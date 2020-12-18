import { App } from 'vue'
import { $g } from './config'

export class Links {
    login = 'login'
    logout = 'logout'
    register = 'register'
    refresh = 'oauth/refresh'
    authorize = 'oauth/{socialite}/login'
    captcha = {
        init: 'captcha/init',
        verification: 'captcha/verification'
    }
    email = {
        active: 'email/active/{token}',
        resend: 'email/active/resend'
    }
    validator = {
        name: 'validator/name',
        email: 'validator/email',
        account: 'validator/account'
    }
    password = {
        forgot: 'password/forgot',
        reset: 'password/reset',
        captcha: 'password/captcha',
        check: 'password/captcha/check'
    }
}

class MiApi {
    version: string

    api: { [index: string]: any }

    constructor() {
        this.version = $g.apiVersion
        this.api = new Proxy(
            {},
            {
                get: (target: { [index: string]: any }, name: string) => {
                    return name in target ? target[name] : 'No Prop'
                },
                set: (target: { [index: string]: any }, name: string, value: any) => {
                    target[name] = value
                    return true
                }
            }
        )

        const links = new Links()
        const keys = Object.keys(links)
        const values = Object.values(links)
        for (let i = 0, len = keys.length; i < len; i++) {
            this.api[keys[i]] = values[i]
        }
        this.parse()
    }

    /**
     * Parse the api.
     * Put the version number in front of each link.
     * You can also modify the version number through `this.api.version = 'v2'`
     * @param api
     */
    parse(api?: { [index: string]: any }) {
        api = api ?? this.api
        for (const i in api) {
            if (Object.prototype.hasOwnProperty.call(api, i)) {
                if (typeof api[i] === 'object' && Object.keys(api[i]).length > 0) {
                    this.parse(api[i])
                } else {
                    const reg = $g.regExp.url
                    if (!reg.test(api[i]) && this.version) {
                        api[i] =
                            api[i].indexOf(`${this.version}/`) !== -1
                                ? api[i]
                                : `${this.version}/${api[i]}`
                    }
                }
            }
        }
    }
}

export const api: MiApi = new MiApi()
export default {
    install(app: App) {
        app.config.globalProperties.api = api.api
    }
}
