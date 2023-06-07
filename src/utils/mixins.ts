import { inject } from 'vue'
import axios from 'axios'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { $tools } from './tools'
import { $g } from './global'
import { $cookie } from './cookie'
import { api } from './api'
import { $request } from './request'
import { useStore } from 'vuex'
import { layout } from '../store/layout'
import { passport } from '../store/passport'
import { mutations } from './../store/types'
import { message } from 'ant-design-vue'
import NProgress from 'nprogress'

/**
 * mixin.
 * 1. Dynamic loading state management module (eg,. `layout`, `passport`).
 * 2. Add axios interceptor (request and response).
 */
let _init = false
export default {
    created() {
        if (!_init) {
            const store = useStore()
            const router = useRouter()
            const { locale, t } = useI18n()
            const i18n = inject('$i18n') as any

            // 基础设定
            $tools.setTitle()
            $tools.setKeywords()
            $tools.setDescription()
            $cookie.set($g.caches.cookies.theme, $g.theme.active)

            // 动态加载 vuex 模块
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

            // 回登录页
            const redirect = () => {
                store.commit(`passport/${mutations.passport.reset}`)
                router.push({
                    path: '/login'
                })
            }

            // 请求拦截器 ( Bearer token )
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
                            if (!$tools.isEmpty(refreshToken)) {
                                // token 过期, 重新获取.
                                store
                                    .dispatch('passport/refresh', { refresh_token: refreshToken })
                                    .then((res: any) => {
                                        regranting = false
                                        if (res?.ret?.code === 200) return resend()
                                        else {
                                            message.error(t('auth'))
                                            redirect()
                                        }
                                    })
                                    .catch(() => {
                                        regranting = false
                                    })
                            } else {
                                // 授权失败, 无 refreshtoken.
                                regranting = false
                                message.error(t('auth'))
                                redirect()
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

            // 语言配置
            const getLanguage = async () => {
                const token = $cookie.get($g.caches.cookies.token.access)
                if (api.languages.data && token) {
                    return await $request
                        .get(
                            api.languages.data,
                            { type: 'all' },
                            {
                                headers: {
                                    Authorization: `Bearer ${token}`
                                }
                            }
                        )
                        .then((res: any) => {
                            if (res?.ret?.code === 200) return res?.data
                        })
                        .catch((err: any) => {
                            message.error(err.message)
                        })
                }
            }
            const setCustomizeLanguage = async () => {
                const languages = (await getLanguage()) || []
                const customize = {}
                for (let i = 0, l = languages.length; i < l; i++) {
                    const language = languages[i]
                    customize[language.key] = language.language
                }
                if (Object.keys(customize).length > 0) i18n.setLocale(locale.value, customize)
            }
            setCustomizeLanguage()

            // 路由监听
            NProgress.configure({
                easing: 'ease',
                speed: 1000,
                showSpinner: false,
                trickleSpeed: 200
            })

            router.beforeEach((_to, _from, next) => {
                $tools.back2top(0, 0, () => {
                    NProgress.start()
                    next()
                })
            })
            router.afterEach(() => NProgress.done())

            _init = true
        }
    }
}
