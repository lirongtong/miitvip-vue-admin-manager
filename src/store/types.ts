export interface RootState {
    version: string
}

export interface LayoutState {
    /**
     * The left menu is to expand or collapse.
     * @type {boolean | null}
     */
    collapsed: boolean | null

    /**
     * The selected menu item in the left menu.
     * @type {string | null}
     */
    active: string[] | null

    /**
     * Menu expansion.
     * @type {Array}
     */
    opens: string[]

    /**
     * Whether is mobile phone.
     * @type {boolean}
     */
    mobile: boolean

    /**
     * Whether to open the drawer menu.
     * @type {boolean}
     */
    drawer: boolean

    /**
     * Is it a small screen, but not mobile phone.
     * @type {boolean}
     */
    small: boolean

    /**
     * Screen type (xl, lg, xxl ...).
     * @type {string | null}
     */
    type: string | null

    /**
     * The last routing info.
     * @type {Object}
     */
    routes: any
}

export interface PassportState {
    user: { [index: string]: any } | null
    token: {
        access: string | null
        refresh: string | null
    }
    auto: boolean | null
}

export const mutations = {
    layout: {
        collapsed: 'SET_MENU_COLLAPSED',
        opens: 'SET_MENU_OPENS',
        active: 'SET_MENU_ACTIVE',
        drawer: 'IS_OPEN_DRAWER',
        mobile: 'IS_MOBILE',
        type: 'SET_SCREEN_TYPE',
        routes: 'SET_HISTORY_ROUTES'
    },
    passport: {
        user: 'SET_USER_INFO',
        token: {
            access: 'SET_ACCESS_TOKEN',
            refresh: 'SET_REFRESH_TOKEN'
        },
        refresh: 'REFRESH_TOKEN_AUTO',
        auto: 'SET_AUTO_LOGIN',
        reset: 'RESET_USER_TOKEN_AUTO'
    }
}
