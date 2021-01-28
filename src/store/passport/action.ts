import { ActionTree } from 'vuex'
import { PassportState, RootState, mutations } from '../types'
import { $http } from '../../utils/http'
import { api } from '../../utils/api'

export const actions: ActionTree<PassportState, RootState> = {
    /**
     * Login action.
     * @param param
     * @param data
     * @returns {Promise<R>}
     */
    login(
        { dispatch, commit },
        data: {
            url?: string
            username: string
            password: string
            remember: boolean | number
            captcha: boolean
            uuid: string
        }
    ): Promise<any> {
        const url = data.url ?? api.api.login
        if (data.url) delete data.url
        return new Promise((resolve, reject) => {
            $http
                .post(url, data)
                .then((res: any) => {
                    if (res.ret.code === 1) {
                        commit(mutations.passport.auto, data.remember ?? false)
                        dispatch('user', res.data)
                    }
                    resolve(res)
                })
                .catch((err: any) => {
                    reject(err)
                })
        })
    },

    /**
     * Logout action.
     * @param param
     * @param data
     */
    logout({ commit }, data: any) {
        const url = data.url ?? api.api.logout
        return new Promise((resolve, reject) => {
            $http
                .get(url)
                .then((res: any) => {
                    if (res.ret.code === 1) commit(mutations.passport.reset)
                    resolve(res)
                })
                .catch((err: any) => {
                    reject(err)
                })
        })
    },

    /**
     * Register action.
     * @param param
     * @param data
     */
    register(
        {},
        data: {
            url?: string
            username: string
            email: string
            password: string
            repeat: string
            captcha: boolean
            uuid: string
        }
    ): Promise<any> {
        const url = data.url ?? api.api.register
        if (data.url) delete data.url
        return new Promise((resolve, reject) => {
            $http
                .post(url, data)
                .then((res: any) => {
                    resolve(res)
                })
                .catch((err: any) => {
                    reject(err)
                })
        })
    },

    /**
     * Social account binding action.
     * eg.,
     * Weibo / Alipay / Wechat ...
     * @param param
     * @param data
     */
    binding(
        { dispatch, commit },
        data: {
            username: string
            email: string
            password: string
            uuid: string
            token: string
            type: string
        }
    ): Promise<any> {
        const url = `${api.api.register}/${data.type}`
        return new Promise((resolve, reject) => {
            $http
                .post(url, data)
                .then((res: any) => {
                    if (res.ret.code === 1) {
                        commit(mutations.passport.auto, true)
                        dispatch('user', res.data)
                    }
                    resolve(res)
                })
                .catch((err: any) => {
                    reject(err)
                })
        })
    },

    /**
     * Authorize action.
     * @param param0
     * @param data
     */
    authorize({ dispatch, commit }, data: any): Promise<any> {
        return new Promise((resolve, reject) => {
            $http
                .post(data.url, { token: data.token })
                .then((res: any) => {
                    if (res.ret.code === 1) {
                        commit(mutations.passport.auto, true)
                        dispatch('user', res.data)
                    }
                    resolve(res)
                })
                .catch((err: any) => {
                    reject(err)
                })
        })
    },

    /**
     * Refresh token action.
     * @param commit
     * @param data
     * @returns {Promise<R>}
     */
    refresh({ commit }, data): Promise<any> {
        const url = data.url ?? api.api.refresh
        data.url && delete data.url
        return new Promise((resolve, reject) => {
            $http
                .post(url, data)
                .then((res: any) => {
                    if (res.ret.code === 1) {
                        commit(mutations.passport.token.access, res.data.access_token)
                        commit(mutations.passport.token.refresh, res.data.refresh_token)
                    }
                    resolve(res)
                })
                .catch((err: any) => {
                    reject(err)
                })
        })
    },

    /**
     * Set user info action.
     * @param commit
     * @param data
     */
    user({ commit }, data: any) {
        commit(mutations.passport.user, data.user)
        commit(mutations.passport.token.access, data.tokens.access_token)
        commit(mutations.passport.token.refresh, data.tokens.refresh_token)
    }
}
