import { defineStore } from 'pinia'
import { api } from '../utils/api'
import { $request } from '../utils/request'
import type {
    LoginParams,
    LoginResponseData,
    ResponseData,
    LoginAuth,
    RegisterParams
} from '../utils/types'
import { $storage } from '../utils/storage'
import { $g } from '../utils/global'
import { $cookie } from '../utils/cookie'

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: JSON.parse($storage.get($g.caches?.storages?.user) ?? `{}`) as Record<string, any>,
        token: {
            access: ($cookie.get($g.caches?.cookies?.token?.access) ?? null) as string | null,
            refresh: ($cookie.get($g.caches?.cookies?.token?.refresh) ?? null) as string | null
        },
        autoLogin: $cookie.get($g.caches?.cookies?.autoLogin) ?? false
    }),
    actions: {
        user(data: LoginResponseData) {
            const user = data?.user || {}
            this.user = user
            $storage.set($g.caches?.storages?.user, JSON.stringify(user))
            const access = data?.tokens?.access ?? null
            const autoLogin = this.autoLogin
            if (access) {
                this.token.access = access
                $cookie.set($g.caches?.cookies?.token?.access, access, autoLogin ? 7 : null)
            }
            const refresh = data?.tokens?.refresh
            if (refresh) {
                this.token.refresh = refresh
                $cookie.set($g.caches?.cookies?.token?.refresh, refresh, autoLogin ? 7 : null)
            }
        },
        async login(data: LoginParams): Promise<any> {
            const url = data.url || api.login
            const method = data.method ?? 'post'
            const params = { ...data }
            if (params.url) delete params.url
            if (params.method) delete params.method
            return new Promise((resolve, reject) => {
                return $request[method.toLowerCase()](url, params)
                    .then((res: ResponseData) => {
                        if (res?.ret?.code === 200) {
                            const autoLogin = data?.remember ?? false
                            this.autoLogin = autoLogin
                            $cookie.set($g.caches?.cookies?.autoLogin, autoLogin, 7)
                            this.user((res?.data || {}) as LoginResponseData)
                            resolve(res)
                        }
                    })
                    .catch((err: any) => reject(err))
            })
        },
        async register(data: RegisterParams): Promise<any> {
            const url = data?.url || api.register
            const method = data.method ?? 'post'
            const params = { ...data }
            if (params.url) delete params.url
            if (params.method) delete params.method
            return new Promise((resolve, reject) => {
                return $request[method.toLowerCase()](url, params)
                    .then((res: ResponseData) => resolve(res))
                    .catch((err: any) => reject(err))
            })
        },
        authorize(data: LoginAuth): Promise<any> {
            return new Promise((resolve, reject) => {
                $request
                    .post(data.url, { token: data.token })
                    .then((res: ResponseData) => {
                        if (res?.ret?.code === 200) {
                            this.autoLogin = true
                            $cookie.set($g.caches?.cookies?.autoLogin, true, 7)
                            this.user(res?.data)
                        }
                        resolve(res)
                    })
                    .catch((err: any) => reject(err))
            })
        }
    }
})

export default useAuthStore
