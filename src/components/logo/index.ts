import { App } from 'vue'
import MiLayoutSiderLogo from './index.vue'

const LayoutSiderLogo = {
    name: 'MiLayoutSiderLogo',
    install: (app: App) => {
        app.component(LayoutSiderLogo.name, MiLayoutSiderLogo)
    }
}
export default LayoutSiderLogo