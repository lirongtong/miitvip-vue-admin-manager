import { App } from 'vue'
import baseMixins from './mixins'

import config from './config'
import cookie from './cookie'
import storage from './storage'
import http from './http'
import tools from './tools'
import api from './api'

const components = [config, cookie, storage, http, tools, api]

let _Init = false
const install = (app: App) => {
    if (!_Init) {
        app.mixin(baseMixins)
        _Init = true
    }
    components.forEach((component) => {
        app.use(
            component as typeof component & {
                install: () => void
            }
        )
    })
    return app
}

export default { install }
