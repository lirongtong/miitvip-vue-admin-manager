import type { App } from 'vue'
import Basic from './utils/basic'

import { default as Theme } from './components/theme'
import { default as Link } from './components/link'
import { default as Layout } from './components/layout'
import { default as Notice } from './components/notice'
import { default as Menu } from './components/menu'
import { default as Clock } from './components/clock'

import * as components from './components'
export * from './components'
export * from './stores'

let _init = false
const install = (app: App) => {
    if (!_init) {
        _init = true
        app.use(Basic)
        Object.keys(components).forEach((key: string) => {
            const component = components[key]
            if (component?.install) app.use(component)
        })
    }
    return app
}

declare module '@vue/runtime-core' {
    export interface GlobalComponents {
        MiTheme: typeof Theme
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
        MiMenu: typeof Menu
        MiMenuItem: typeof Menu.Item
        MiSubMenu: typeof Menu.SubMenu
    }
}

export default { install }
