import { GetterTree } from 'vuex'
import { PassportState, RootState } from '../types'
import { $g } from '../../utils/global'
import { $storage } from '../../utils/storage'
import { $cookie } from '../../utils/cookie'

export const getters: GetterTree<PassportState, RootState> = {
    /**
     * 用户信息 ( User info ).
     * @param state
     * @returns {any}
     */
    user: (state): any => {
        let user = state.user
        if (!user) user = JSON.parse($storage.get($g.caches.storages.user) ?? '{}')
        return user
    },

    /**
     * 获取 access token.
     * @param state
     */
    access: (state): string | null => {
        let token = state.token.access
        if (!token) token = $cookie.get($g.caches.cookies.token.access)
        return token
    },

    /**
     * 获取 refresh token.
     * @param state
     */
    refresh: (state) => {
        let token = state.token.refresh
        if (!token) token = $cookie.get($g.caches.cookies.token.refresh)
        return token
    },

    /**
     * 是否自动登录 ( auto login ).
     * @param state
     */
    auto: (state) => {
        let auto = state.auto
        if (auto === null) auto = $cookie.get($g.caches.cookies.auto)
        return auto
    }
}
