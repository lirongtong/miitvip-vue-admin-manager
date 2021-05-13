import { App } from 'vue'
import { version } from '../package.json'
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
import { default as Anchor } from './components/anchor'
import { default as Tooltip } from './components/tooltip'
import { default as Search } from './components/search'
import { default as Captcha } from './components/captcha'
import { default as Uploader } from './components/uploader'

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
    Anchor,
    Captcha,
    Tooltip,
    Search,
    Uploader
]

let _Init = false
const install = (app: App) => {
    if (!_Init) {
        app.mixin(baseMixins)
        components.forEach((component) => {
            app.use(
                component as typeof component & {
                    install: () => void
                }
            )
        })
        _Init = true
    }
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
    Anchor,
    Captcha,
    Tooltip,
    Search
}

export default {
    version,
    install
}
