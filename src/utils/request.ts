import { App } from 'vue'
import axios, { AxiosRequestConfig } from 'axios'

axios.defaults.baseURL = '/'
axios.defaults.withCredentials = true
axios.defaults.headers.common['Content-Type'] = 'application/json;charset=UTF-8;'

/**
 * 封装请求响应的类 ( 封装自 axios 插件 ).
 * Request & Response class.
 * 
 * 包含 `get`, `post`, `put`, `delete` 等常用的请求方法.
 * 封装了请求失败自动重试的功能 ( 默认失败不自动请求 ).
 * 
 * @class
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
     * @type Promise
     */
    register(): void {
        const methods = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS', 'HEAD']
        methods.forEach((method) => {
            this.instance[method.toLowerCase()] = (
                url: string,
                data: {[index: string]: any} = {},
                config?: AxiosRequestConfig & {
                    retry?: number
                    retryDelay?: number
                    retryCount?: 0
                }
            ): Promise<any> => {
                const args: {[index: string]: any} = {
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
                const configuration = Object.assign(args, config)
                return this.send(configuration)
            }
        })
    }

    /**
     * 发送请求 ( Send Request ).
     * @param config 
     * @returns Promise
     */
    protected async send(config: AxiosRequestConfig): Promise<any> {
        if (!config.timeout) config.timeout = 60000
        return await axios(config).then((res: any) => {
            return Promise.resolve(res.data)
        }).catch((err) => {
            return Promise.reject(err)
        })
    }
}

export const $request: any = new MiRequest()

export default {
    install(app: App) {
        app.config.globalProperties.$request = $request
        return app
    }
}