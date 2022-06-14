import axios, { AxiosRequestConfig } from 'axios'
import { layout } from '../store/layout'
import { passport } from '../store/passport'
import { mutations } from './../store/types'

let _created = false
let _mounted = false

/**
 * mixin.
 * 1. Dynamic loading state management module (eg,. `layout`, `passport`).
 * 2. Add axios interceptor (request and response).
 */
export default {
    created() {
        if (!_created) {
            // 基础设置
            this.$tools.setTitle()
            this.$tools.setKeywords()
            this.$tools.setDescription()
            this.$cookie.set(this.$g.caches.cookies.theme, this.$g.theme.active)

            // 动态导入 vuex 模块
            try {
                this.$store.registerModule(['layout'], layout)
                this.$store.registerModule(['passport'], passport)
            } catch (e) {
                throw new Error(
                    '[vuex] must be required. Please install and import [vuex] before makeit-admin-pro\r\n' +
                        e
                )
            }
            // 是否为移动端
            this.$g.isPisMobilehone = this.$tools.isMobile()
            this.$store.commit(`layout/${mutations.layout.mobile}`)

            _created = true
        }
    },
    mounted() {
        if (!_mounted) {
            let regranting = false

            // 请求拦截器 ( Bearer token )
            axios.interceptors.request.use(
                (config: AxiosRequestConfig) => {
                    const token = this.$cookie.get(this.$g.caches.cookie.token.access)
                    if (token) config.headers.Authorization = `Bearer ${token}`
                    return config
                },
                (err: any) => {
                    return Promise.reject(err)
                }
            )

            // 响应拦截器 ( 错误则请求重试 )
            axios.interceptors.response.use(
                (response) => {
                    return response
                },
                async (err: any) => {
                    if (err && err.response) {
                        // 重试
                        const resend = () => {
                            const config = err.config
                            const method = config.method.toLowerCase()
                            return this.$request[method](
                                config.url,
                                method === 'get' ? config.params : config.data,
                                {
                                    retry: config.retry,
                                    retryCount: config.retryCount
                                }
                            )
                        }
                        // 未授权 ( unauthorized ).
                        if (err.response.status === 401) {
                            if (!regranting) {
                                regranting = true
                                const refreshToken = this.$cookie.get(
                                    this.$g.caches.cookie.token.refresh
                                )
                                if (refreshToken) {
                                    // token 过期, 重新获取.
                                } else {
                                    // 授权失败, 无 refreshtoken.
                                    regranting = false
                                }
                            }
                        } else {
                            /**
                             * 请求重试.
                             * 设置了 retry 且重试次数少于设定值 retryCount.
                             * request retry and delay 1000ms each time.
                             */
                            const config = err.config
                            if (!config || !config.retry) return Promise.reject(err.response)
                            if (config.retryCount >= config.retry)
                                return Promise.reject(err.response)
                            config.retryCount += 1
                            await resend()
                        }
                    }
                }
            )

            _mounted = true
        }
    }
}
