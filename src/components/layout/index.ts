import { App, type Plugin } from 'vue'
import Mixins from '../../utils/mixins'
import Layout from './Layout'

Layout.install = (app: App) => {
    Mixins(app)
    if (typeof app.component(Layout.name) === 'undefined') {
        app.component(Layout.name, Layout)
        app.component(Layout.Header.name, Layout.Header)
        app.component(Layout.Sider.name, Layout.Sider)
        app.component(Layout.Sider.Logo.name, Layout.Sider.Logo)
        app.component(Layout.Content.name, Layout.Content)
        app.component(Layout.Footer.name, Layout.Footer)
    }
    return app
}

export default Layout as typeof Layout & Plugin
