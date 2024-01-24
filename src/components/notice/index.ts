import type { App, Plugin } from 'vue'
import Mixins from '../../utils/mixins'
import Notice from './Notice'

Notice.install = (app: App) => {
    Mixins(app)
    if (typeof app.component(Notice.name) === 'undefined') {
        app.component(Notice.name, Notice)
        app.component(Notice.Tab.name, Notice.Tab)
        app.component(Notice.Item.name, Notice.Item)
    }
    return app
}

export default Notice as typeof Notice & Plugin
