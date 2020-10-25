import { App } from 'vue'
import MiLayoutHeader from './index.vue'

const LayoutHeader = {
    name: 'MiLayoutHeader',
    install: (app: App) => {
        app.component(LayoutHeader.name, MiLayoutHeader)
    }
}
export default LayoutHeader