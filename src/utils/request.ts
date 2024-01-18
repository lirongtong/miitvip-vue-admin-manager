import type { App } from 'vue'
import { $g } from './global'
import { $cookie } from './cookie'
import axios, { AxiosRequestConfig, AxiosResponse, Method } from 'axios'
import type { RequestConfig } from './types'

axios.defaults.baseURL = '/'
axios.defaults.withCredentials = true
axios.defaults.headers.common['Content-Type'] = 'application/json;charset=UTF-8;'

class MiRequest {
    instance: MiRequest

    constructor() {
        this.instance = this
        this.register()
    }

    private register(): void {
        const methods: Method[] = [
            'get',
            'post',
            'put',
            'patch',
            'delete',
            'options',
            'head',
            'link',
            'unlink',
            'purge'
        ]
        methods.forEach((method: Method) => {
            this.instance[method.toLowerCase()] = (
                url: string,
                data: { [index: string]: any } = {},
                config?: RequestConfig
            ): Promise<any> => {
                const args: { [index: string]: any } = {
                    url,
                    data,
                    method: method.toUpperCase(),
                    retry: 0,
                    retryDelay: 1000,
                    retryCount: (config && config.retryCount) || 0
                }
                if (method.toUpperCase() === 'GET') {
                    delete args.data
                    args.params = data
                }
                const configuration = {
                    ...args,
                    ...config
                }
                return this.send(configuration)
            }
        })
    }

    private async send(config: AxiosRequestConfig): Promise<any> {
        if (!config.timeout) config.timeout = 60000
        axios.interceptors.request.use(
            (config: any) => {
                const token = $cookie.get($g.caches.cookies.token.access)
                if (token) config.headers.Authorization = `Bearer ${token}`
                return config
            },
            (err) => {
                return Promise.reject(err)
            }
        )
        return await axios(config)
            .then((res: AxiosResponse) => {
                return Promise.resolve(res?.data)
            })
            .catch((err: any) => {
                return Promise.reject(err)
            })
    }

    get(url: string, params?: {}, config?: RequestConfig): Promise<any> {
        return this.instance['get'](url, params, config)
    }

    post(url: string, data?: {}, config?: RequestConfig): Promise<any> {
        return this.instance['post'](url, data, config)
    }

    put(url: string, data?: {}, config?: RequestConfig): Promise<any> {
        return this.instance['put'](url, data, config)
    }

    delete(url: string, data?: {}, config?: RequestConfig): Promise<any> {
        return this.instance['delete'](url, data, config)
    }
}

/**
 * 封装请求响应类 ( `axios` )
 *  - 包含 `get, post, put, delete` 等10种请求方法.
 *  - 显式外放 `get / post / put / delete` 请求方法
 *
 * e.g.
 * ```
 * this.$request.get('/v1/login', {
 *     username: 'makeit.vip',
 *     password: '123456'
 * })
 * ```
 */
export const $request = new MiRequest()
export default {
    install(app: App) {
        app.config.globalProperties.$request = $request
        return app
    }
}
