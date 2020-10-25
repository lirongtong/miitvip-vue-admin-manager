import { App } from 'vue'
import MiLayoutFooter from './index.vue'

const LayoutFooter = {
    name: 'MiLayoutFooter',
    install: (app: App) => {
        app.component(LayoutFooter.name, MiLayoutFooter)
    }
}
export default LayoutFooter