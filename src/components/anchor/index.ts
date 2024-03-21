import { App, type Plugin } from 'vue'
import Mixins from '../../utils/mixins'
import Anchor from './Anchor'

Anchor.install = (app: App) => {
    Mixins(app)
    if (typeof app.component(Anchor.name) === 'undefined') {
        app.component(Anchor.name, Anchor)
        app.component(Anchor.Link.name, Anchor.Link)
    }
    return app
}

export default Anchor as typeof Anchor & Plugin
