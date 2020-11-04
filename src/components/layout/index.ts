import { App, Plugin } from 'vue'
import Layout from './layout'

Layout.install = function(app: App) {
    app.component(Layout.name, Layout)
    return app
}

export default Layout as typeof Layout & Plugin