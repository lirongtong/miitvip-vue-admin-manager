import { App, Plugin } from 'vue'
import Layout from './layout'

Layout.install = function (app: App) {
    app.component(Layout.name, Layout)
    app.component(Layout.Header.name, Layout.Header)
    app.component(Layout.Side.name, Layout.Side)
    app.component(Layout.Content.name, Layout.Content)
    app.component(Layout.Footer.name, Layout.Footer)
    return app
}

export default Layout as typeof Layout & Plugin
