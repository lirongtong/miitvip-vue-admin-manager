import axios from 'axios'

let _Created = false
let _Mounted = false
export default {
    created() {
        if (!_Created) {
            this.$tools.setTitle()
            this.$tools.setKeywords()
            this.$tools.setDescription()
            this.$g.mobile = this.$tools.isMobile()
            _Created = true
        }
    },
    methods: {
        redirect() {
            //this.$store.commit(`passport/${mutations.passport.reset}`)
            if (this.$route.name !== 'login') this.$router.push({path: '/login'})
        },
        emit() {
            const args = [].slice.call(arguments, 0)
            let eventName = args[0]
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
            _Mounted = true
        }
    }
}