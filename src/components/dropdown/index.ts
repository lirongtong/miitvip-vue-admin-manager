import { App, type Plugin } from 'vue'
import Mixins from '../../utils/mixins'
import Dropdown from './Dropdown'

Dropdown.install = (app: App) => {
    Mixins(app)
    app.component(Dropdown.name, Dropdown)
    app.component(Dropdown.Item.name, Dropdown.Item)
    return app
}

export default Dropdown as typeof Dropdown & Plugin
