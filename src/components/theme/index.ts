import type { App, Plugin } from 'vue'
import Theme from './Theme'

Theme.install = (app: App) => {
    if (typeof app.component(Theme.name) === 'undefined') {
        app.component(Theme.name, Theme)
    }
    return app
}

export default Theme as typeof Theme & Plugin
