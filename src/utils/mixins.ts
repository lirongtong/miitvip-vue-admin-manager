import type { App } from 'vue'
import Theme from '../components/theme'
import Basic, { __tree_shaking_basic__ } from './basic'

export default (app: App) => {
    if (!__tree_shaking_basic__) {
        app.use(Basic)
        app.use(Theme)
    }
}
