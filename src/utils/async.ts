import { App } from 'vue'
import baseMixins from './mixins'
import i18n from '../locales'
import global from './global'
import cookie from './cookie'
import storage from './storage'
import request from './request'
import tools from './tools'

const components = [i18n, global, cookie, storage, request, tools]

let _init = false
const install = (app: App) => {
    if (!_init) {
        components.forEach((comp) => {
            app.use(
                comp as typeof comp & {
                    install: () => void
                }
            )
        })
        app.mixin(baseMixins)
        _init = true
    }
    return app
}

export default { install }
