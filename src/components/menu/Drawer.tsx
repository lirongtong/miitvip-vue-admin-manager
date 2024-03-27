import { defineComponent, computed } from 'vue'
import { Drawer } from 'ant-design-vue'
import { DrawerMenuProps } from './props'
import { $tools } from '../../utils/tools'
import { useMenuStore } from '../../stores/menu'
import { useLayoutStore } from '../../stores/layout'
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons-vue'
import { useWindowResize } from '../../hooks/useWindowResize'
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
        const useLayout = useLayoutStore()
        const open = computed(() => props.open)
        const menus = computed(() => useMenu.menus)
        const { width } = useWindowResize()
        const size = computed(() => $tools.distinguishSize(props.width, width.value))

        applyTheme(styled)

        const handleOpen = () => {
            useMenu.$patch({ drawer: true })
            useLayout.$patch({ collapsed: false })
            emit('update:open', true)
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
                    width={size.value}
                    placement={props.placement}
                    open={open.value}
                    mask={props.mask}
                    maskClosable={props.maskClosable}
                    zIndex={props.zIndex}
                    closable={false}
                    rootClassName={styled.container}
                    onClose={handleClose}>
                    <div class={styled.layout}>
                        <MiLayoutSiderLogo showAction={false} />
                        <MiMenu items={menus.value} />
                    </div>
                </Drawer>
            </>
        )
    }
})

export default MiDrawerMenu
