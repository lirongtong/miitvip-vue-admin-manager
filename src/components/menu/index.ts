import { App, Plugin } from 'vue'
import Menu from './menu'
import MenuItem from './item'
import MenuItemLink from './link'

Menu.Item = MenuItem
Menu.Link = MenuItemLink
Menu.install = (app: App) => {
    app.component(Menu.name, Menu)
    app.component(Menu.Item.name, Menu.Item)
    app.component(Menu.Link.name, Menu.Link)
    return app
}
export default Menu as typeof Menu & Plugin