import { GetterTree } from 'vuex'
import { PassportState, RootState } from '../types'
import { $g } from '../../utils/config'
import { $storage } from '../../utils/storage'
import { $cookie } from '../../utils/cookie'

export const getters: GetterTree<PassportState, RootState> = {
    /**
     * User info.
     * @param state
     * @returns {any}
     */
    user: (state): any => {
        let user = state.user
        if (!user) user = JSON.parse($storage.get($g.caches.storages.user) ?? '{}')
        return user
    },

    /**
     * Access token.
     * @param state
     */
    access: (state): string | null => {
        let token = state.token.access
        if (!token) token = $cookie.get($g.caches.cookies.token.access)
        return token
    },

    /**
     * Refresh token.
     * @param state
     */
    refresh: (state) => {
        let token = state.token.refresh
        if (!token) token = $cookie.get($g.caches.cookies.token.refresh)
        return token
    },

    /**
     * Auto login.
     * @param state
     */
    auto: (state) => {
        let auto = state.auto
        if (auto === null) auto = $cookie.get($g.caches.cookies.auto)
        return auto
    }
}
