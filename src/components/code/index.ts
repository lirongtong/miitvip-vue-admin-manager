import { App, type Plugin } from 'vue'
import Mixins from '../../utils/mixins'
import Code from './Code'

Code.install = (app: App) => {
    Mixins(app)
    if (typeof app.component(Code.name) === 'undefined') {
        app.component(Code.name, Code)
        app.component(Code.Demo.name, Code.Demo)
    }
    return app
}

export default Code as typeof Code & Plugin
