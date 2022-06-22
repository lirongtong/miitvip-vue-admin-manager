import axios, { AxiosRequestConfig } from 'axios'
import { $tools } from './tools'
import { $g } from './global'
import { $cookie } from './cookie'
import { $request } from './request'
import { useStore } from 'vuex'
import { layout } from '../store/layout'
import { passport } from '../store/passport'
import { mutations } from './../store/types'

/**
 * mixin.
 * 1. Dynamic loading state management module (eg,. `layout`, `passport`).
 * 2. Add axios interceptor (request and response).
 */
export default {
    setup() {
        const store = useStore()

        $tools.setTitle()
        $tools.setKeywords()
        $tools.setDescription()
        $cookie.set($g.caches.cookies.theme, $g.theme.active)

        try {
            store.registerModule(['layout'], layout)
            store.registerModule(['passport'], passport)
        } catch (e) {
            throw new Error(
                '[vuex] must be required. Please install and import [vuex] before makeit-admin-pro\r\n' +
                    e
            )
        }
        // 是否为移动端
        $g.isMobile = $tools.isMobile()
        store.commit(`layout/${mutations.layout.mobile}`)

        // 请求拦截器 ( Bearer token )
        axios.interceptors.request.use(
            (config: AxiosRequestConfig) => {
                const token = $cookie.get($g.caches.cookies.token.access)
                if (token) config.headers.Authorization = `Bearer ${token}`
                return config
            },
            (err) => {
                return Promise.reject(err)
            }
        )

        // 响应拦截器 ( 错误则请求重试 )
        let regranting = false
        axios.interceptors.response.use(
            (response) => {
                return response
            },
            async (err: any) => {
                // 重试
                const resend = () => {
                    const config = err.config
                    const method = config.method.toLowerCase()
                    return $request[method](
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
                        const refreshToken = $cookie.get($g.caches.cookies.token.refresh)
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
                    if (!config?.retry) return Promise.reject(err.response)
                    if (config.retryCount >= config.retry) return Promise.reject(err.response)
                    config.retryCount += 1
                    await resend()
                }
            }
        )
    }
}
