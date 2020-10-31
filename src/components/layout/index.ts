import { App } from 'vue'
import MiLayout from '/@src/components/layout/index.vue'
import MiLayoutSider from '/@src/components/layout/sider.vue'
import MiLayoutSiderLogo from '/@src/components/sider/logo.vue'
import MiLayoutSiderMenu from '/@src/components/sider/menu.vue'
import MiLayoutSiderSubMenu from '/@src/components/sider/submenu.vue'
import MiLayoutSiderMenuItem from '/@src/components/sider/item.vue'
import MiLayoutSiderMenuDrawer from '/@src/components/sider/drawer.vue'
import MiLayoutHeader from '/@src/components/layout/header.vue'
import MiLayoutHeaderDropdown from '/@src/components/header/dropdown.vue'
import MiLayoutHeaderNotice from '/@src/components/header/notice.vue'
import MiLayoutContent from '/@src/components/layout/content.vue'
import MiLayoutFooter from '/@src/components/layout/footer.vue'

const components = {
    MiLayout, MiLayoutSider, MiLayoutSiderLogo, MiLayoutSiderMenu,
    MiLayoutSiderMenuDrawer, MiLayoutSiderSubMenu, MiLayoutSiderMenuItem,
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