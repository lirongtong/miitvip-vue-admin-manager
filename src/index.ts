import type { App } from 'vue'
import i18n from './locales'

import mixins from './utils/mixins'
import { default as Api, api } from './utils/api'
import global, { $g } from './utils/global'
import cookie, { $cookie } from './utils/cookie'
import storage, { $storage } from './utils/storage'
import request, { $request } from './utils/request'
import tools, { $tools } from './utils/tools'

import async from './utils/async'
import prism from './directives/prism'
import inputLimit from './directives/input_limit'

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
import { default as Title } from './components/title'
import { default as Quotes } from './components/quotes'

import { default as LanguageManagement } from './components/management/language'
import { default as MenuManagement } from './components/management/menu'
import { default as AppsManagement } from './components/management/application'

const components = [
    i18n,
    Api,
    global,
    cookie,
    storage,
    request,
    tools,
    inputLimit,
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
    Title,
    Quotes,
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
    Api,
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
    Title,
    Quotes,
    LanguageManagement,
    MenuManagement,
    AppsManagement
}

declare module '@vue/runtime-core' {
    export interface ComponentCustomProperties {
        $g: typeof $g
        api: typeof api
        $tools: typeof $tools
        $request: typeof $request
        $cookie: typeof $cookie
        $storage: typeof $storage
        $modal: typeof Modal
    }

    export interface GlobalComponents {
        MiLayout: typeof Layout
        MiLayoutHeader: typeof Layout.Header
        MiLayoutSide: typeof Layout.Side
        MiLayoutContent: typeof Layout.Content
        MiLayoutFooter: typeof Layout.Footer
        MiNotice: typeof Notice
        MiNoticeTab: typeof Notice.Tab
        MiNoticeItem: typeof Notice.Item
        MiMenu: typeof Menu
        MiSubMenu: typeof Menu.SubMenu
        MiMenuItem: typeof Menu.Item
        MiMenuItemLink: typeof Menu.Link
        MiDropdown: typeof Dropdown
        MiClock: typeof Clock
        MiSearch: typeof Search
        MiSearchKey: typeof Search.Key
        MiCaptcha: typeof Captcha
        MiPassword: typeof Password
        MiAnchor: typeof Anchor
        MiModal: typeof Modal
        MiLogin: typeof Login
        MiRegister: typeof Register
        MiForget: typeof Forget
        MiHistory: typeof History
        MiCode: typeof Code
        MiTitle: typeof Title
        MiQuotes: typeof Quotes
        MiLanguageManagement: typeof LanguageManagement
        MenuManagement: typeof MenuManagement
        AppsManagement: typeof AppsManagement
    }
}

export default {
    install
}
