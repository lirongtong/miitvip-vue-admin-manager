import { App, type Plugin } from 'vue'
import Basic, { __tree_shaking_basic__ } from '../../utils/basic'
import Layout from './Layout'

Layout.install = (app: App) => {
    if (!__tree_shaking_basic__) app.use(Basic)
    app.component(Layout.name, Layout)
    app.component(Layout.Header.name, Layout.Header)
    app.component(Layout.Sider.name, Layout.Sider)
    app.component(Layout.Content.name, Layout.Content)
    app.component(Layout.Footer.name, Layout.Footer)
    return app
}

export default Layout as typeof Layout & Plugin
