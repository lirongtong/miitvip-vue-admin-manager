import { App, Plugin } from 'vue'
import Dropdown from './dropdown'

Dropdown.install = function (app: App) {
    app.component(Dropdown.name, Dropdown)
    app.component(Dropdown.Item.name, Dropdown.Item)
    return app
}

export default Dropdown as typeof Dropdown & Plugin
