import { MutationTree } from 'vuex'
import { LayoutState, mutations } from '../types'
import { $g } from '../../utils/config'
import { $storage } from '../../utils/storage'

export const mutation: MutationTree<LayoutState> = {
    /**
     * Set the left menu to expand or collapse.
     * @param state
     * @param status
     */
    [mutations.layout.collapsed](state, status: boolean | null = null) {
        state.collapsed = status
        $storage.set($g.caches.storages.collapsed, status)
    },

    /**
     * The currently open menu item.
     * @param state
     * @param opens
     */
    [mutations.layout.opens](state, opens: string | string[]) {
        state.opens = Array.isArray(opens) ? opens : [opens]
    },

    /**
     * The currently selected menu item.
     * @param state
     * @param active
     */
    [mutations.layout.active](state, active: string[]) {
        state.active = active
    },

    /**
     * Whether to open the drawer menu.
     * @param state
     * @param status
     */
    [mutations.layout.drawer](state, status: boolean) {
        state.drawer = status
    },

    /**
     * Whether is mobile phone.
     * The visible area on the PC browser is less than 600px, and the value is also `true`.
     * This value is synchronized with `this.G.mobile`.
     * @param state
     * @param status
     */
    [mutations.layout.mobile](state, status: boolean) {
        state.mobile = status
    },

    /**
     * Screen type size (xs, xl, sm ...)
     * @param state
     * @param type
     */
    [mutations.layout.type](state, type: string) {
        state.type = type
    },

    /**
     * history routes.
     * @param state
     * @param routes
     */
    [mutations.layout.routes](state, routes: any) {
        state.routes = routes
        $storage.set($g.caches.storages.routes, JSON.stringify(routes))
    }
}
