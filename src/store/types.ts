export interface RootState {
    version: string
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