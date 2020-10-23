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
import { getters } from './getters'

export const layout: Module<LayoutState, RootState> = {
    namespaced: true,
    getters
}