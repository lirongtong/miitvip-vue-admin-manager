import { App } from 'vue'
import MiLayout from './index.vue'
import MiLayoutSider from './sider.vue'
import MiLayoutSiderLogo from '../sider/logo.vue'
import MiLayoutSiderMenu from '../sider/menu.vue'
import MiLayoutSiderSubMenu from '../sider/submenu.vue'
import MiLayoutSiderMenuItem from '../sider/item.vue'
import MiLayoutSiderDrawer from '../sider/drawer.vue'
import MiLayoutHeader from './header.vue'
import MiLayoutHeaderDropdown from '../header/dropdown.vue'
import MiLayoutHeaderNotice from '../header/notice.vue'
import MiLayoutContent from './content.vue'
import MiLayoutFooter from './footer.vue'

const components = {
    MiLayout, MiLayoutSider, MiLayoutSiderLogo, MiLayoutSiderMenu,
    MiLayoutSiderDrawer, MiLayoutSiderSubMenu, MiLayoutSiderMenuItem,
    MiLayoutHeader, MiLayoutHeaderDropdown, MiLayoutHeaderNotice, MiLayoutContent,
    MiLayoutFooter
} as any

const Layout = {
    install: (app: App) => {
        Object.keys(components).forEach(name => {
            app.component(name, components[name])
        })
    }
}
export default Layout