/*
 * +-------------------------------------------+
 * |                  MIITVIP                  |
 * +-------------------------------------------+
 * | Copyright (c) 2020 makeit.vip             |
 * +-------------------------------------------+
 * | Author: makeit <lirongtong@hotmail.com>   |
 * | Homepage: https://www.makeit.vip          |
 * | Github: https://github.com/lirongtong     |
 * | Date: 2020-5-28 11:12                     |
 * +-------------------------------------------+
 */
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