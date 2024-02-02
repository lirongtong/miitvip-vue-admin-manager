import { App, type Plugin } from 'vue'
import Mixins from '../../utils/mixins'
import Menu from './Menu'

Menu.install = (app: App) => {
    Mixins(app)
    app.component(Menu.name, Menu)
    app.component(Menu.SubMenu.name, Menu.SubMenu)
    app.component(Menu.Item.name, Menu.Item)
    app.component(Menu.Item.Title.name, Menu.Item.Title)
    return app
}

export default Menu as typeof Menu & Plugin
