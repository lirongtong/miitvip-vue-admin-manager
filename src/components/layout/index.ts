import { App, type Plugin } from 'vue'
import Basic, { __tree_shaking_basic__ } from '../../utils/basic'
import Layout from './Layout'

Layout.install = (app: App) => {
    if (!__tree_shaking_basic__) app.use(Basic)
    app.component(Layout.name, Layout)
    app.component(Layout.Content.name, Layout.Content)
    return app
}

export default Layout as typeof Layout & Plugin
