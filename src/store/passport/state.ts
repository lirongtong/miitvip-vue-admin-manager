import { PassportState } from '../types'

export const state: PassportState = {
    user: null,
    token: {
        access: null,
        refresh: null
    },
    auto: false
}
