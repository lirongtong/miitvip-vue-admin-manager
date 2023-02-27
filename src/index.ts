import { App } from 'vue'
import i18n from './locales'
import mixins from './utils/mixins'
import { default as api } from './utils/api'
import global from './utils/global'
import cookie from './utils/cookie'
import storage from './utils/storage'
import request from './utils/request'
import tools from './utils/tools'
import async from './utils/async'
import prism from './directives/prism'

import { default as Layout } from './components/layout'
import { default as Notice } from './components/notice'
import { default as Menu } from './components/menu'
import { default as Dropdown } from './components/dropdown'
import { default as Clock } from './components/clock'
import { default as Search } from './components/search'
import { default as Captcha } from './components/captcha'
import { default as Password } from './components/password'
import { default as Anchor } from './components/anchor'
import { default as Modal } from './components/modal'
import { default as Login } from './components/login'
import { default as Register } from './components/register'
import { default as Forget } from './components/forget'
import { default as History } from './components/history'
import { default as Code } from './components/code'

import { default as LanguageManagement } from './components/management/language'
import { default as MenuManagement } from './components/management/menu'
import { default as AppsManagement } from './components/management/application'

const components = [
    i18n,
    api,
    global,
    cookie,
    storage,
    request,
    tools,
    prism,
    Layout,
    Notice,
    Menu,
    Dropdown,
    Clock,
    Search,
    Captcha,
    Password,
    Anchor,
    Modal,
    Login,
    Register,
    Forget,
    History,
    Code,
    LanguageManagement,
    MenuManagement,
    AppsManagement
]

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

export {
    global,
    cookie,
    storage,
    request,
    tools,
    async,
    prism,
    Layout,
    Notice,
    Menu,
    Dropdown,
    Clock,
    Search,
    Captcha,
    Password,
    Anchor,
    Modal,
    Login,
    Register,
    Forget,
    History,
    Code,
    LanguageManagement,
    MenuManagement,
    AppsManagement
}

export default {
    install
}
