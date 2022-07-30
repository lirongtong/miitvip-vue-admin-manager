import { defineComponent } from 'vue'
import { Layout, Drawer } from 'ant-design-vue'
import { $g } from '../../utils/global'
import { getPrefixCls } from '../_utils/props-tools'
import MiLayoutSideLogo from '../layout/logo'
import MiLayoutSideMenu from './menu'

export default defineComponent({
    name: 'MiDrawerMenu',
    inheritAttrs: false,
    props: {
        prefixCls: String
    },
    setup(props) {
        const layoutPrefixCls = getPrefixCls('layout', props.prefixCls)
        const containerPrefixCls = getPrefixCls('layout-container', props.prefixCls)
        const drawerPrefixCls = getPrefixCls('layout-side-menu-drawer', props.prefixCls)
        const width = 256
        return () => (
            <Drawer width={width}
                placement="left"
                closable={false}
                visible={$g.menus.drawer}
                onClose={() => $g.menus.drawer = !$g.menus.drawer}
                class={drawerPrefixCls}
                zIndex={Date.now()}>
                <Layout class={`${containerPrefixCls} ${layoutPrefixCls}-mobile`} hasSider={true}>
                    <Layout.Sider class={`${layoutPrefixCls}-side`}
                        width={width}
                        style={{display: 'flex'}}>
                        <MiLayoutSideLogo />
                        <MiLayoutSideMenu items={$g.menus.items} />
                    </Layout.Sider>
                </Layout>
            </Drawer>
        )
    }
})