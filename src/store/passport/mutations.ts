import { MutationTree } from 'vuex'
import { PassportState, mutations } from '../types'
import { $g } from '../../utils/config'
import { $storage } from '../../utils/storage'
import { $cookie } from '../../utils/cookie'

export const mutation: MutationTree<PassportState> = {
    /**
     * User info.
     * @param state
     * @param user
     */
    [mutations.passport.user](state, user: { [index: string]: any }) {
        state.user = user
        $storage.set($g.caches.storages.user, JSON.stringify(user))
    },

    /**
     * Access token.
     * @param state
     * @param token
     */
    [mutations.passport.token.access](state, token: string) {
        state.token.access = token
        $cookie.set($g.caches.cookies.token.access, token, state.auto ? 7 : null)
    },

    /**
     * Refresh token.
     * @param state
     * @param token
     */
    [mutations.passport.token.refresh](state, token: string) {
        state.token.refresh = token
        $cookie.set($g.caches.cookies.token.refresh, token, state.auto ? 7 : null)
    },

    /**
     * Tokens, including `access` and `refresh` token.
     * @param state
     */
    [mutations.passport.refresh](state) {
        state.token.access = $cookie.get($g.caches.cookies.token.access)
        state.token.refresh = $cookie.get($g.caches.cookies.token.refresh)
        state.auto = $cookie.get($g.caches.cookies.auto)
    },

    /**
     * Auto login.
     * @param state
     * @param auto
     */
    [mutations.passport.auto](state, auto) {
        state.auto = auto
        $cookie.set($g.caches.cookies.auto, auto, 7)
    },

    /**
     * Reset attributes.
     * @param state
     */
    [mutations.passport.reset](state) {
        state.token.access = null
        state.token.refresh = null
        state.auto = null
        state.user = {}
        $storage.del($g.caches.storages.user)
        $cookie.del([
            $g.caches.cookies.token.access,
            $g.caches.cookies.token.refresh,
            $g.caches.cookies.auto
        ])
    }
}
