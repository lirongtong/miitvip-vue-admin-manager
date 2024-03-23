import { defineComponent, computed } from 'vue'
import { Drawer, Layout } from 'ant-design-vue'
import { DrawerMenuProps } from './props'
import { $tools } from '../../utils/tools'
import { useMenuStore } from '../../stores/menu'
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons-vue'
import MiMenu from '../menu/Menu'
import MiLayoutSiderLogo from '../layout/Logo'
import applyTheme from '../_utils/theme'
import styled from './style/drawer.module.less'

const MiDrawerMenu = defineComponent({
    name: 'MiDrawerMenu',
    inheritAttrs: false,
    props: DrawerMenuProps(),
    emits: ['update:open'],
    setup(props, { emit }) {
        const useMenu = useMenuStore()
        const open = computed(() => props.open)
        const menus = computed(() => useMenu.menus)
        applyTheme(styled)

        const handleOpen = () => {
            emit('update:open', true)
            useMenu.$patch({ drawer: true })
        }

        const handleClose = () => {
            useMenu.$patch({ drawer: false })
            emit('update:open', false)
        }

        return () => (
            <>
                <div class={styled.icon} onClick={handleOpen}>
                    {open.value ? <MenuFoldOutlined /> : <MenuUnfoldOutlined />}
                </div>
                <Drawer
                    width={$tools.distinguishSize(props.width)}
                    placement={props.placement}
                    v-model:open={open.value}
                    mask={props.mask}
                    maskClosable={props.maskClosable}
                    zIndex={props.zIndex}
                    closable={false}
                    rootClassName={styled.container}
                    onClose={handleClose}>
                    <Layout class={styled.layout} hasSider={true}>
                        <Layout.Sider
                            class={styled.layoutSider}
                            width={$tools.distinguishSize(props.width)}>
                            <MiLayoutSiderLogo showAction={false} />
                            <MiMenu items={menus.value} />
                        </Layout.Sider>
                    </Layout>
                </Drawer>
            </>
        )
    }
})

export default MiDrawerMenu
