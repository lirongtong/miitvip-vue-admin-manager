import { App } from 'vue'
import MiLayout from './index.vue'
const Layout = {
    name: 'MiLayout',
    install: (app: App) => {
        app.component(Layout.name, MiLayout)
    }
}
export default Layout