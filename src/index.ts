import { App } from 'vue'
import axios from 'axios'

import config from './utils/config'
import cookie from './utils/cookie'
import storage from './utils/storage'
import http from './utils/http'
import tools from './utils/tools'
import api from './utils/api'

import { default as Layout } from './components/layout'
import { default as Notice } from './components/notice'
import { default as Dropdown } from './components/dropdown'
import { default as Modal } from './components/modal'

const components = [
    config, cookie, storage, http, tools, api,
    Layout, Notice, Dropdown, Modal
]

let _Init = false
const install = (app: App) => {
    components.forEach((component) => {
        app.use(
            component as typeof component & {
                install: () => void
            }
        )
    })
    if (!_Init) {
        app.mixin({
            created() {
                this.$tools.setTitle()
                this.$tools.setKeywords()
                this.$tools.setDescription()
                this.$g.mobile = this.$tools.isMobile()
            },
            mounted() {
                let regranting = false

                /** request interceptor */
                axios.interceptors.request.use(
                    (config) => {
                        const token = this.$cookie.get(this.$g.caches.cookie.token.access)
                        if (token) config.headers.Authorization = `Bearer ${token}`
                        return config
                    },
                    (err) => {
                        return Promise.reject(err)
                    }
                )

                /** response interceptor */
                axios.interceptors.response.use(
                    (response) => {
                        return response
                    },
                    (err) => {
                        if (err && err.response) {
                            const resent = () => {
                                const config = err.config
                                const method = config.method.toLowerCase()
                                return this.$http[method](
                                    config.url,
                                    method === 'get' ? config.params : config.data,
                                    { retryCount: config.retryCount }
                                )
                            }

                            /** try again - unauthorized (401) */
                            if (err.response.status === 401) {
                                if (!regranting) {
                                    regranting = true
                                    const refresh_token = this.$cookie.get(
                                        this.G.caches.cookies.token.refresh
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
                                const retry = new Promise((resolve) => {
                                    setTimeout(() => {
                                        resolve()
                                    }, config.retryCount || 1)
                                })
                                retry.then(() => {
                                    return resent()
                                })
                            }
                        }
                    }
                )
            }
        })
        _Init = true
    }
    return app
}

export { config, cookie, storage, http, tools, api, Layout }

export default {
    version: `${process.env.VERSION}`,
    install
}
