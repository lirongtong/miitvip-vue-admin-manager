/*
 * +-------------------------------------------+
 * |                  MIITVIP                  |
 * +-------------------------------------------+
 * | Copyright (c) 2020 makeit.vip             |
 * +-------------------------------------------+
 * | Author: makeit <lirongtong@hotmail.com>   |
 * | Homepage: https://www.makeit.vip          |
 * | Github: https://github.com/lirongtong     |
 * | Date: 2020-10-23 11:07                    |
 * +-------------------------------------------+
 */
import { App } from 'vue'
import { createStore } from 'vuex'
import axios from 'axios'
import makeit from '/@src/_base/modules'
import { layout } from '/@src/store/layout'
import { passport } from '/@src/store/passport'
import { mutations } from '/@src/store/types'

const env = process.env.NODE_ENV
let _Vue: boolean | null = null
let _Ready: boolean | null = null
const install = function(app: App) {
    Object.keys(makeit).forEach((name) => {
        app.use(makeit[name])
    })
    /**
     * mixin.
     * 1. Dynamic loading state management module (eg,. `layout`, `passport`).
     * 2. Add axios interceptor (request and response).
     */
    app.mixin({
        beforeMount() {
            if (!_Vue) {
                try {
                    if (!this.$store) {
                        app.use(createStore({
                            strict: env !== 'production'
                        }))
                    }
                    this.$store.registerModule(['layout'], layout)
                    this.$store.registerModule(['passport'], passport)
                    _Vue = true
                } catch (e) {
                    throw new Error('Vuex must be installed and registered. \r\n' + e)
                }
            }
        },

        methods: {
            redirect() {
                this.$store.commit(`passport/${mutations.passport.reset}`)
                if (this.$route.name !== 'login') this.$router.push({path: '/login'})
            }
        },

        mounted() {
            if (!_Ready) {
                let regranting = false

                /** request interceptor */
                axios.interceptors.request.use((config) => {
                    let token = this.$cookie.get(this.G.caches.cookie.token.access)
                    if (token) config.headers.Authorization = `Bearer ${token}`
                    return config
                }, (err) => {
                    return Promise.reject(err)
                })

                /** response interceptor */
                axios.interceptors.response.use((response) => {
                    return response
                }, (err) => {
                    if (err && err.response) {
                        const resent = () => {
                            const config = err.config
                            const method = config.method.toLowerCase()
                            return this.$http[method](
                                config.url,
                                method === 'get' ? config.params : config.data,
                                {retryCount: config.retryCount}
                            )
                        }

                        /** try again - unauthorized (401) */
                        if (err.response.status === 401) {
                            if (!regranting) {
                                regranting = true
                                const refresh_token = this.$cookie.get(this.G.caches.cookies.token.refresh)
                                if (refresh_token) {
                                    this.$store.dispatch(`passport/refresh`, {refresh_token}).then((res: any) => {
                                        regranting = false
                                        if (res.ret.code === 1) return resent()
                                        else this.redirect()
                                    }).catch((err: any) => {
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
                            if (config.retryCount >= config.retry) return Promise.reject(err.response)
                            config.retryCount += 1
                            const retry = new Promise(resolve => {
                                setTimeout(() => {
                                    resolve()
                                }, config.retryCount || 1)
                            })
                            retry.then(() => {
                                return resent()
                            })
                        }
                    }
                })

                _Ready = true
            }
        }
    })
    return app
}
export default {
    version: `${process.env.VERSION}`,
    install
}