import { App, Plugin } from 'vue'
import Menu from './menu'

Menu.install = (app: App) => {
    app.component(Menu.name, Menu)
    return app
}
export default Menu as typeof Menu & Plugin