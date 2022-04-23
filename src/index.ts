import { App } from 'vue'
import baseMixins from './utils/mixins'
import global from './utils/global'
import cookie from './utils/cookie'
import storage from './utils/storage'
import request from './utils/request'
import tools from './utils/tools'

const components = [global, cookie, storage, request, tools]

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

export default {
    install
}
