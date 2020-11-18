import { Module } from 'vuex'
import { RootState, LayoutState } from '../types'
import { state } from './state'
import { getters } from './getters'
import { mutation } from './mutations'

export const layout: Module<LayoutState, RootState> = {
    namespaced: true,
    state,
    getters,
    mutations: mutation
}
