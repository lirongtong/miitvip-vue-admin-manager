import { App } from 'vue'
import MiLayoutSiderMenuItem from './item.vue'

const LayoutSiderMenuItem = {
    name: 'MiLayoutSiderMenuItem',
    install: (app: App) => {
        app.component(LayoutSiderMenuItem.name, MiLayoutSiderMenuItem)
    }
}
export default LayoutSiderMenuItem