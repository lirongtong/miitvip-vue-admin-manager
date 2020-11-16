import { App, Plugin } from 'vue'
import Menu from './menu'
import MenuItem from './item'

Menu.Item = MenuItem
Menu.install = (app: App) => {
    app.component(Menu.name, Menu)
    app.component(Menu.Item.name, Menu.Item)
    return app
}
export default Menu as typeof Menu & Plugin