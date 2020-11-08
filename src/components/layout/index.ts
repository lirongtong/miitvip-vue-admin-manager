import { App, Plugin } from 'vue'
import Layout from './layout'

Layout.install = function (app: App) {
    app.component(Layout.name, Layout)
    app.component(Layout.Sider.name, Layout.Sider)
    app.component(Layout.Sider.Logo.name, Layout.Sider.Logo)
    app.component(Layout.Header.name, Layout.Header)
    app.component(Layout.Content.name, Layout.Content)
    app.component(Layout.Footer.name, Layout.Footer)
    return app
}

export default Layout as typeof Layout & Plugin
