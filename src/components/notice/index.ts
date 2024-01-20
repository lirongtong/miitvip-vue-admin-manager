import type { App, Plugin } from 'vue'
import Notice from './Notice'

Notice.install = (app: App) => {
    app.component(Notice.name, Notice)
    return app
}

export default Notice as typeof Notice & Plugin
