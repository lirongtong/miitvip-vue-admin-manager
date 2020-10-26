import { App } from 'vue'
import MiLayoutSiderMenu from './index.vue'

const LayoutSiderMenu = {
    name: 'MiLayoutSiderMenu',
    install: (app: App) => {
        app.component(LayoutSiderMenu.name, MiLayoutSiderMenu)
    }
}
export default LayoutSiderMenu