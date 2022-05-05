import { GetterTree } from 'vuex'
import { RootState, LayoutState } from '../types'
import { $g } from '../../utils/global'
import { $storage } from '../../utils/storage'
import { $cookie } from '../../utils/cookie'

export const getters: GetterTree<LayoutState, RootState> = {
    collapsed: (state): boolean | null => {
        let collapsed = state.collapsed
        if (collapsed === null) collapsed = $storage.get($g.caches.storages.collapsed)
        return collapsed
    },
    opens: (state): string[] => {
        return state.opens
    },
    active: (state): string[] | null => {
        return state.active
    },
    drawer: (state): boolean => {
        return state.drawer
    },
    phone: (state): boolean => {
        return state.phone
    },
    theme: (state): string | null | undefined => {
        let theme = state.theme
        theme = theme === null ? theme : $cookie.get($g.caches.cookies.theme)
        return theme
    },
    routes: (state): any => {
        let routes = state.routes
        if (Object.keys(routes).length <= 0) {
            routes = JSON.parse($storage.get($g.caches.storages.routes) ?? '{}')
        }
        return routes
    }
}
