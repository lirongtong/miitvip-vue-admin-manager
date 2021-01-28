import axios from 'axios'
import { layout } from '../store/layout'
import { passport } from '../store/passport'
import { mutations } from '../store/types'

let _Created = false
let _Mounted = false

/**
 * mixin.
 * 1. Dynamic loading state management module (eg,. `layout`, `passport`).
 * 2. Add axios interceptor (request and response).
 */
export default {
    created() {
        if (!_Created) {
            this.$tools.setTitle()
            this.$tools.setKeywords()
            this.$tools.setDescription()
            this.$g.mobile = this.$tools.isMobile()
            const theme = this.$cookie.get(this.$g.caches.cookies.theme)
            if (theme) this.$tools.setThemeVariables(theme)
            try {
                this.$store.registerModule(['layout'], layout)
                this.$store.registerModule(['passport'], passport)
            } catch (e) {
                throw new Error(
                    '[vuex] must be required. Please import and install [vuex] before makeit-admin-pro\r\n' +
                        e
                )
            }
            try {
                this.$router.beforeEach((to: any, from: any, next: any) => {
                    if (to.meta.auth) {
                        const key = this.$g.caches.cookies.token.access
                        const token =
                            this.$store.getters['passport/access'] ||
                            this.$cookie.get(key) ||
                            this.$storage.get(key)
                        if (!token) {
                            if (to.path === '/login') {
                                next()
                            } else {
                                next({
                                    path: '/login',
                                    query: { redirect: to.fullPath }
                                })
                            }
                        } else {
                            if (Object.keys(from.query).length === 0) {
                                next()
                            } else {
                                const redirect = from.query.redirect
                                if (to.path === redirect) {
                                    next()
                                } else {
                                    next({
                                        path: redirect
                                    })
                                }
                            }
                        }
                    } else next()
                })
            } catch (e) {
                throw new Error(
                    '[vue-router] must be required. Please import and install [vue-router] before makeit-admin-pro\r\n' +
                        e
                )
            }
            _Created = true
        }
    },
    methods: {
        redirect() {
            this.$store.commit(`passport/${mutations.passport.reset}`)
            if (this.$route.name !== 'login') this.$router.push({ path: '/login' })
        },
        emit(...params: any) {
            const args = [].slice.call(params, 0)
            const eventName = args[0]
            const event = this.$props[eventName] || this.$attrs[eventName]
            if (args.length && event) {
                if (Array.isArray(event)) {
                    for (let i = 0, l = event.length; i < l; i++) {
                        event[i](...args.slice(1))
                    }
                } else {
                    event(...args.slice(1))
                }
            }
        }
    },
    mounted() {
        if (!_Mounted) {
            let regranting = false

            /** request interceptor */
            axios.interceptors.request.use(
                (config) => {
                    const token = this.$cookie.get(this.$g.caches.cookies.token.access)
                    if (token) config.headers.Authorization = `Bearer ${token}`
                    return config
                },
                (err: any) => {
                    return Promise.reject(err)
                }
            )

            /** response interceptor */
            axios.interceptors.response.use(
                (response) => {
                    return response
                },
                async (err: any) => {
                    if (err && err.response) {
                        const resent = () => {
                            const config = err.config
                            const method = config.method.toLowerCase()
                            return this.$http[method](
                                config.url,
                                method === 'get' ? config.params : config.data,
                                {
                                    retry: config.retry,
                                    retryCount: config.retryCount
                                }
                            )
                        }

                        /** try again - unauthorized (401) */
                        if (err.response.status === 401) {
                            if (!regranting) {
                                regranting = true
                                const refresh_token = this.$cookie.get(
                                    this.$g.caches.cookies.token.refresh
                                )
                                if (refresh_token) {
                                    this.$store
                                        .dispatch(`passport/refresh`, { refresh_token })
                                        .then((res: any) => {
                                            regranting = false
                                            if (res.ret.code === 1) return resent()
                                            else this.redirect()
                                        })
                                        .catch(() => {
                                            regranting = false
                                        })
                                } else {
                                    regranting = false
                                    this.redirect()
                                }
                            }
                        } else {
                            /** retry 3 times, delay 1000ms each time (by default). */
                            const config = err.config
                            if (!config || !config.retry) return Promise.reject(err.response)
                            if (config.retryCount >= config.retry)
                                return Promise.reject(err.response)
                            config.retryCount += 1
                            await resent()
                        }
                    }
                }
            )
            _Mounted = true
        }
    }
}
