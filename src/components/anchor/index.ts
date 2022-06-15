import { App, Plugin } from 'vue'
import Anchor from './anchor'

Anchor.install = function (app: App) {
    app.component(Anchor.name, Anchor)
    app.component(Anchor.Link.name, Anchor.Link)
    return app
}

export default Anchor as typeof Anchor & Plugin
