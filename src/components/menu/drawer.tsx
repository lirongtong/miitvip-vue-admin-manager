import { defineComponent } from 'vue'
import { Layout, Drawer } from 'ant-design-vue'
import MiLayoutSiderLogo from '../logo'
import MiLayoutSiderMenu from './menu'

export default defineComponent({
    name: 'MiMenuDrawer',
    methods: {
        getPrefixCls(name = 'layout') {
            return this.$tools.getPrefixCls(name)
        }
    },
    render() {
        return (
            <Drawer
                width="256"
                placement="left"
                closable={false}
                visible={this.$g.menus.drawer}
                onClose={() => this.$g.menus.drawer = !this.$g.menus.drawer}
                class={this.getPrefixCls('layout-sider-menu-drawer')}>
                <Layout class={`${this.getPrefixCls()} ${this.getPrefixCls('layout-mobile')}`} hasSider={true}>
                    <Layout.Sider width="256">
                        <MiLayoutSiderLogo></MiLayoutSiderLogo>
                        <MiLayoutSiderMenu className={this.getPrefixCls('layout-sider-menu')} items={this.$g.menus.items}></MiLayoutSiderMenu>
                    </Layout.Sider>
                </Layout>
            </Drawer>
        )
    }
})