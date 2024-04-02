import type { App } from 'vue'
import { $g } from './global'
import { $cookie } from './cookie'
import { $storage } from './storage'
import axios, { AxiosRequestConfig, AxiosResponse, Method } from 'axios'
import type { RequestConfig } from './types'

axios.defaults.baseURL = '/'
axios.defaults.withCredentials = true
axios.defaults.headers.common['Content-Type'] = 'application/json;charset=UTF-8;'

class MiRequest {
    instance: MiRequest

    constructor() {
        this.instance = this
        // 拦截器
        axios.interceptors.request.use(
            (config: any) => {
                const token =
                    $cookie.get($g?.caches?.cookies?.token?.access) ||
                    $storage.get($g?.caches?.storages?.token?.access)
                if (token) config.headers.Authorization = `Bearer ${token}`
                return config
            },
            (err) => {
                return Promise.reject(err)
            }
        )
        this.register()
    }

    register(): void {
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
                config?: RequestConfig,
                settled?: boolean
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
                return this.send(configuration, settled)
            }
        })
    }

    async send(config: AxiosRequestConfig, settled?: boolean): Promise<any> {
        if (!config.timeout) config.timeout = 60000
        return await axios(config)
            .then((res: AxiosResponse) => {
                return Promise.resolve(res?.data || res)
            })
            .catch((err: any) => {
                if (settled) return Promise.resolve(err)
                else return Promise.reject(err)
            })
    }

    get(url: string, params?: {}, config?: RequestConfig, settled?: boolean): Promise<any> {
        return this.instance['get'](url, params, config, settled)
    }

    post(url: string, data?: {}, config?: RequestConfig, settled?: boolean): Promise<any> {
        return this.instance['post'](url, data, config, settled)
    }

    put(url: string, data?: {}, config?: RequestConfig, settled?: boolean): Promise<any> {
        return this.instance['put'](url, data, config, settled)
    }

    delete(url: string, data?: {}, config?: RequestConfig, settled?: boolean): Promise<any> {
        return this.instance['delete'](url, data, config, settled)
    }

    async all<T>(values: Array<T | Promise<T>>): Promise<T[]> {
        return Promise.all(values)
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
