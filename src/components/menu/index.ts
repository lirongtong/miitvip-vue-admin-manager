import { App, Plugin } from 'vue'
import Menu from './menu'
import SubMenu from './submenu'
import MenuItem from './item'
import MenuItemLink from './link'
import './style'

Menu.SubMenu = SubMenu
Menu.Item = MenuItem
Menu.Link = MenuItemLink
Menu.install = (app: App) => {
    app.component(Menu.name, Menu)
    app.component(Menu.SubMenu.name, Menu.SubMenu)
    app.component(Menu.Item.name, Menu.Item)
    app.component(Menu.Link.name, Menu.Link)
    return app
}
export default Menu as typeof Menu &
    Plugin & {
        readonly SubMenu: typeof SubMenu
        readonly Item: typeof MenuItem
        readonly Link: typeof MenuItemLink
    }
