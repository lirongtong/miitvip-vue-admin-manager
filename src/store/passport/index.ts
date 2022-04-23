import { Module } from 'vuex'
import { RootState, PassportState } from '../types'
import { state } from './state'
import { getters } from './getters'
import { mutation } from './mutations'
import { actions } from './action'

export const passport: Module<PassportState, RootState> = {
    namespaced: true,
    state,
    getters,
    mutations: mutation,
    actions
}
