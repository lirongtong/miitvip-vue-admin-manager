import { App } from 'vue'
import axios, { AxiosRequestConfig, AxiosResponse, Method } from 'axios'

axios.defaults.baseURL = '/'
axios.defaults.withCredentials = true
axios.defaults.headers.common['Content-Type'] = 'application/json;charset=UTF-8;'

/**
 * 封装请求响应的类 ( 封装自 axios 插件 ).
 * - 请求/响应拦截器 `mixin.ts`
 * Request & Response class.
 * 包含 `get`, `post`, `put`, `delete` 等常用的请求方法.
 */
class MiRequest {
    instance: MiRequest

    constructor() {
        this.instance = this
        this.register()
    }

    /**
     * 注册相关的请求方法 ( 不包含 connect & trace 方法 ).
     * Registration of common methods ( Without `CONNECT`, `TRACE` ).
     *
     * @return Promise
     */
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
                config?: AxiosRequestConfig & {
                    retry?: number
                    retryDelay?: number
                    retryCount?: 0
                }
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

    /**
     * 发送请求 ( Send Request ).
     * @param config
     * @returns Promise
     */
    private async send(config: AxiosRequestConfig): Promise<any> {
        if (!config.timeout) config.timeout = 60000
        return await axios(config)
            .then((res: AxiosResponse) => {
                return Promise.resolve(res?.data)
            })
            .catch((err: any) => {
                return Promise.reject(err)
            })
    }
}

export const $request = new MiRequest() as any

export default {
    install(app: App) {
        app.config.globalProperties.$request = $request
        app.provide('$request', $request)
        return app
    }
}
