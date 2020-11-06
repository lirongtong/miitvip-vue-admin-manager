import { App } from 'vue'
import axios, { AxiosRequestConfig } from 'axios'

axios.defaults.baseURL = '/'
axios.defaults.withCredentials = true
axios.defaults.headers.common['Content-Type'] = 'application/json;charset=UTF-8;'

class MiHttp {
    instance: MiHttp

    constructor() {
        this.instance = this
        this.register()
    }

    /**
     * Send Request.
     * @param config
     */
    protected async send(config: AxiosRequestConfig): Promise<any> {
        if (!config.timeout) config.timeout = 60000
        return axios(config)
            .then(async (res) => {
                res.data.ret.status = res.status
                try {
                    return Promise.resolve({
                        ret: res.data.ret,
                        data: res.data.data
                    })
                } catch (err) {
                    return Promise.reject(err)
                }
            })
            .catch((e) => {
                return Promise.reject(e)
            })
    }

    /**
     * Registration of common methods.
     * Without `CONNECT`, `TRACE`.
     * @type Promise
     */
    register(): void {
        ;['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS', 'HEAD'].forEach((method) => {
            this.instance[method.toLocaleLowerCase()] = (
                url: string,
                data: { [index: string]: any } = {},
                config?: AxiosRequestConfig
            ): Promise<any> => {
                const args: { [index: string]: any } = {
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
export const $http = new MiHttp()
const http = {
    install(app: App) {
        app.config.globalProperties.$http = $http
        return app
    }
}
export default http
