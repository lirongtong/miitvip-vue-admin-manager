import { App } from 'vue'
import axios, { AxiosInstance, AxiosRequestConfig } from 'axios'

declare module '@vue/runtime-core' {
    interface ComponentCustomProperties {
        $http: AxiosInstance
    }
}

/**
 * @method get
 */
class Http {

    instance: {[index: string]: any} = this

    constructor() {this.register()}

    /**
     * Send Request.
     * @param config 
     */
    async send(config: AxiosRequestConfig): Promise<any> {
        if (!config.timeout) config.timeout = 60000
        return axios(config).then((res) => {
            res.data.ret.status = res.status
            return Promise.resolve({
                ret: res.data.ret,
                data: res.data.data
            })
        }).catch((err) => {
            return Promise.reject(err)
        })
    }

    /**
     * Registration of common methods.
     * Without `CONNECT`, `TRACE`.
     * @type Promise 
     */
    register() {
        ['GET', 'POST', 'PUT', 'PATCH', 'DELETE','OPTIONS', 'HEAD'].forEach((method) => {
            this.instance[method.toLowerCase()] = (
                url: string,
                data: {[index: string]: any} = {},
                config?: AxiosRequestConfig
            ): Promise<any> => {
                let args: {[index: string]: any} = {
                    ...config,
                    url,
                    data,
                    method: method.toUpperCase(),
                    retry: 3,
                    retryDelay: 1000,
                    retryCount: (config && (config as any).retryCount) || 0
                }
                if (method.toUpperCase() === 'GET') {
                    delete args.data
                    args.params = data
                }
                return this.send(args)
            }
        })
    }
}
export const $http = new Http() as any
const http = {
    install(app: App) {
        app.config.globalProperties.$http = $http
    }
}
export default http