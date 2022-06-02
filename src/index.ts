import { App } from 'vue'
import mixins from './utils/mixins'
import global from './utils/global'
import cookie from './utils/cookie'
import storage from './utils/storage'
import request from './utils/request'
import tools from './utils/tools'
import async from './utils/async'

import { default as Layout } from './components/layout'
import { default as Notice } from './components/notice'
import { default as Menu } from './components/menu'
import { default as Dropdown } from './components/dropdown'

const components = [global, cookie, storage, request, tools, Notice, Layout, Menu, Dropdown]

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

export { global, cookie, storage, request, tools, async, Notice, Layout, Menu, Dropdown }

export default {
    install
}
