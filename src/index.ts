import { App } from 'vue'
import Captcha from 'makeit-captcha'
import Tooltip from 'makeit-tooltip'
import Search from 'makeit-search'
import async from './utils/async'
import baseMixins from './utils/mixins'

import config from './utils/config'
import cookie from './utils/cookie'
import storage from './utils/storage'
import http from './utils/http'
import tools from './utils/tools'
import api from './utils/api'

import { default as Login } from './components/login'
import { default as Register } from './components/register'
import { default as Password } from './components/password'
import { default as Layout } from './components/layout'
import { default as History } from './components/history'
import { default as Notice } from './components/notice'
import { default as Dropdown } from './components/dropdown'
import { default as Modal } from './components/modal'
import { default as Menu } from './components/menu'

const components = [
    config,
    cookie,
    storage,
    http,
    tools,
    api,
    Login,
    Register,
    Password,
    Layout,
    History,
    Notice,
    Dropdown,
    Modal,
    Menu,
    Captcha,
    Tooltip,
    Search
]

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

export {
    config,
    cookie,
    storage,
    http,
    tools,
    api,
    async,
    Login,
    Register,
    Password,
    Layout,
    History,
    Notice,
    Dropdown,
    Modal,
    Menu,
    Captcha
}

export default {
    version: `${process.env.VERSION}`,
    install
}
