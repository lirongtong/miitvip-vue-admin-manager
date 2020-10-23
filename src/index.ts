/*
 * +-------------------------------------------+
 * |                  MIITVIP                  |
 * +-------------------------------------------+
 * | Copyright (c) 2020 makeit.vip             |
 * +-------------------------------------------+
 * | Author: makeit <lirongtong@hotmail.com>   |
 * | Homepage: https://www.makeit.vip          |
 * | Github: https://github.com/lirongtong     |
 * | Date: 2020-5-25 11:07                     |
 * +-------------------------------------------+
 */
import { App } from 'vue'
import { createStore, useStore } from 'vuex'
import config from './utils/config'
import cookie from './utils/cookie'
import storage from './utils/storage'
import http from './utils/http'
import tools from './utils/tools'
import { layout } from './store/layout'
import { passport } from './store/passport'
import MiLayout from './components/layout'

const components: {[index: string]: any} = {
    config, cookie, storage, http, tools,
    MiLayout
}
const env = (import.meta as any).env.NODE_ENV
let _Vue: boolean | null = null
let _Ready = null
const install = (app: App) => {
    Object.keys(components).forEach((name) => {
        app.use(components[name])
    })
    /**
     * mixin.
     * 1. Dynamic loading state management module (eg,. `layout`, `passport`).
     * 2. Add axios interceptor (request and response).
     */
    app.mixin({
        beforeMount() {
            if (!_Vue) {
                try {
                    if (!this.$store) {
                        app.use(createStore({
                            strict: env !== 'production'
                        }))
                    }
                    this.$store.registerModule(['layout'], layout)
                    this.$store.registerModule(['passport'], passport)
                    _Vue = true
                } catch (e) {
                    throw new Error('Vuex must be installed and registered. \r\n' + e)
                }
            }
        },

        mounted() {
            
        }
    })
}

export default class MakeitAdmin {
    static install: (app: App) => void
    static version: string
    constructor() {}
}
MakeitAdmin.install = install
MakeitAdmin.version = `${process.env.VERSION}`