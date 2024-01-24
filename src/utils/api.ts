import { type App, reactive } from 'vue'
import { $g } from './global'
import { $tools } from './tools'

/**
 * 全局常用 API
 *  - 根据 {@link $g.apiVersion} 封装 api
 *  - 可通过 `this.api` 新增或覆盖
 *
 * e.g.
 * - /v1/login: 登录
 * - /v1/logout: 登出
 * - /v1/register: 注册
 * - etc ...
 *
 * @param $g.apiVersion API 版本号
 */
export const api = {
    login: '/login',
    logout: '/logout',
    register: '/register',
    oauth: {
        refresh: '/oauth/refresh',
        authorize: '/oauth/{socialite}/login'
    },
    captcha: {
        init: '/captcha/init',
        verify: '/captcha/verify'
    },
    email: {
        active: '/email/active/{token}',
        resend: '/email/active/resend'
    },
    validator: {
        name: '/validator/name',
        email: '/validator/email',
        user: '/validator/user'
    },
    password: {
        reset: '/password/reset',
        captcha: '/password/captcha/send',
        check: '/password/captcha/checkout'
    },
    languages: {
        data: '/languages',
        batchCreate: '/languages/batch',
        update: '/languages/{id}',
        check: '/languages/checkout',
        category: {
            data: '/languages/categories',
            update: '/languages/categories/{id}',
            check: '/languages/categories/checkout',
            default: '/languages/categories/default/{id}'
        }
    },
    menus: {
        data: '/menus',
        update: '/menus/{id}',
        delete: '/menus/{id}'
    },
    apps: {
        data: '/apps',
        create: '/apps',
        update: '/apps/{id}',
        delete: '/apps/{id}',
        images: '/images'
    }
} as Record<string, any>

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
            _api = _api || api
            for (const i in _api) {
                if (_api?.[i]) {
                    if (typeof _api[i] === 'object' && Object.keys(_api[i] || {}).length > 0) {
                        this.parse(_api[i])
                    } else {
                        _api[i] = this.wrap(_api[i])
                    }
                }
            }
        }
    }

    wrap(path?: string) {
        if (path) {
            if (!$tools.isUrl(path) && this.version) {
                path =
                    path.indexOf(`/${this.version}/`) !== -1
                        ? path
                        : `/${this.version}${path.charAt(0) === '/' ? path : `/${path}`}`
            }
        }
        return path
    }
}
new MiApi()

export default {
    install(app: App) {
        app.config.globalProperties.api = reactive(api)
        return app
    }
}
