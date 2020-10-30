import { App } from 'vue'
import MiLayoutSiderMenuDrawer from './item.vue'

const LayoutSiderMenuDrawer = {
    name: 'MiLayoutSiderMenuDrawer',
    install: (app: App) => {
        app.component(LayoutSiderMenuDrawer.name, MiLayoutSiderMenuDrawer)
    }
}
export default LayoutSiderMenuDrawer