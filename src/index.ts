import { App } from 'vue'
import { createStore } from 'vuex'
import baseMixins from './utils/mixins'

import config from './utils/config'
import cookie from './utils/cookie'
import storage from './utils/storage'
import http from './utils/http'
import tools from './utils/tools'
import api from './utils/api'

import { default as Layout } from './components/layout'
import { default as Notice } from './components/notice'
import { default as Dropdown } from './components/dropdown'
import { default as Modal } from './components/modal'

const components = [
    config, cookie, storage, http, tools, api,
    Layout, Notice, Dropdown, Modal
]

const env = process.env.NODE_ENV
let _Init = false
let _Vue: boolean | null = null
const install = (app: App) => {
    components.forEach((component) => {
        app.use(
            component as typeof component & {
                install: () => void
            }
        )
    })
    if (!_Init) {
        app.mixin({
            beforeMount() {
                if (!_Vue) {
                    try {
                        if (!this.$store) {
                            app.use(createStore({
                                strict: env !== 'production'
                            }))
                        }
                        //this.$store.registerModule(['layout'], layout)
                        //this.$store.registerModule(['passport'], passport)
                        _Vue = true
                    } catch (e) {
                        throw new Error('Vuex must be required. Please import vuex before makeit-admin-pro\r\n' + e)
                    }
                }
            }
        }).mixin(baseMixins)
        _Init = true
    }
    return app
}

export { config, cookie, storage, http, tools, api, Layout }

export default {
    version: `${process.env.VERSION}`,
    install
}
