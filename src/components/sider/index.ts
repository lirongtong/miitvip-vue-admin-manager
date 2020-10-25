import { App } from 'vue'
import MiLayoutSider from './index.vue'

const LayoutSider = {
    name: 'MiLayoutSider',
    install: (app: App) => {
        app.component(LayoutSider.name, MiLayoutSider)
    }
}
export default LayoutSider