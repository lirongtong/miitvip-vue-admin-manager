import type { App } from 'vue'
import Basic from './utils/basic'

import { default as Theme } from './components/theme'
import { default as Link } from './components/link'
import { default as Layout } from './components/layout'
import { default as Notice } from './components/notice'
import { default as Breadcrumb } from './components/breadcrumb'
import { default as Menu } from './components/menu'
import { default as Clock } from './components/clock'
import { default as Search } from './components/search'
import { default as Palette } from './components/palette'
import { default as Dropdown } from './components/dropdown'
import { default as Code } from './components/code'
import { default as Title } from './components/title'
import { default as Quote } from './components/quote'
import { default as Modal } from './components/modal'
import { default as Captcha } from './components/captcha'
import { default as Password } from './components/password'
import { default as Login } from './components/login'
import { default as Register } from './components/register'
import { default as Forget } from './components/forget'
import { default as Backtop } from './components/backtop'
import { default as Anchor } from './components/anchor'
import { default as Socialite } from './components/socialite'
import { default as HistoricalRouting } from './components/historical'
import { default as Image } from './components/image'
import { default as Button } from './components/button'
import { default as ItemsText } from './components/items/text'
import { default as ItemsImage } from './components/items/image'
import { default as ItemsList } from './components/items/list'
import { default as ItemsDetail } from './components/items/detail'
import { default as AppsLanguage } from './components/apps/language'
import { default as AppsMenu } from './components/apps/menu'

import * as components from './components'
export * from './components'
export * from './stores'
export * from './utils/types'
export * from './hooks'

let _init = false
const install = (app: App) => {
    if (!_init) {
        _init = true
        app.use(Basic)
        Object.keys(components || {}).forEach((key: string) => {
            const component = components[key]
            if (component?.install) app.use(component)
        })
    }
    return app
}

declare module '@vue/runtime-core' {
    export interface ComponentCustomProperties {
        $modal: typeof Modal
    }

    export interface GlobalComponents {
        MiTheme: typeof Theme
        MiThemeProvider: typeof Theme.Provider
        MiLink: typeof Link
        MiLayout: typeof Layout
        MiLayoutHeader: typeof Layout.Header
        MiLayoutSider: typeof Layout.Sider
        MiLayoutSiderLogo: typeof Layout.Sider.Logo
        MiLayoutContent: typeof Layout.Content
        MiLayoutFooter: typeof Layout.Footer
        MiNotice: typeof Notice
        MiNoticeTab: typeof Notice.Tab
        MiNoticeItem: typeof Notice.Item
        MiClock: typeof Clock
        MiBreadcrumb: typeof Breadcrumb
        MiMenu: typeof Menu
        MiMenuItem: typeof Menu.Item
        MiSubMenu: typeof Menu.SubMenu
        MiSearch: typeof Search
        MiSearchKey: typeof Search.Key
        MiPalette: typeof Palette
        MiDropdown: typeof Dropdown
        MiDropdownItem: typeof Dropdown.Item
        MiCode: typeof Code
        MiCodeDemo: typeof Code.Demo
        MiTitle: typeof Title
        MiQuote: typeof Quote
        MiModal: typeof Modal
        MiCaptcha: typeof Captcha
        MiPassword: typeof Password
        MiLogin: typeof Login
        MiRegister: typeof Register
        MiForget: typeof Forget
        MiBacktop: typeof Backtop
        MiAnchor: typeof Anchor
        MiSocialite: typeof Socialite
        MiHistoricalRouting: typeof HistoricalRouting
        MiImage: typeof Image
        MiButton: typeof Button
        MiItemsText: typeof ItemsText
        MiItemsImage: typeof ItemsImage
        MiItemsList: typeof ItemsList
        MiItemsDetail: typeof ItemsDetail
        MiAppsLanguage: typeof AppsLanguage
        MiAppsMenu: typeof AppsMenu
    }
}

export default { install }
