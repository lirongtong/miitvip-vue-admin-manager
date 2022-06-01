import { App } from 'vue'
import mixins from './utils/mixins'
import global from './utils/global'
import cookie from './utils/cookie'
import storage from './utils/storage'
import request from './utils/request'
import tools from './utils/tools'

import { default as Layout } from './components/layout'
import { default as Notice } from './components/notice'
import { default as Menu } from './components/menu'

const components = [global, cookie, storage, request, tools, Notice, Layout, Menu]

let _init = false
const install = (app: App) => {
    if (!_init) {
        app.mixin(mixins)
        components.forEach((comp) => {
            app.use(
                comp as typeof comp & {
                    install: () => void
                }
            )
        })
        _init = true
    }
    return app
}

export { global, cookie, storage, request, tools, Notice, Layout, Menu }

export default {
    install
}
