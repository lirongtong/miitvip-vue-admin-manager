import { App } from 'vue'
import MiLayoutContent from './index.vue'

const LayoutContent = {
    name: 'MiLayoutContent',
    install: (app: App) => {
        app.component(LayoutContent.name, MiLayoutContent)
    }
}
export default LayoutContent