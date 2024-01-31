import { defineComponent, type SlotsType, type Plugin, computed } from 'vue'
import { LayoutSiderProps } from './props'
import { getPropSlot } from '../_utils/props'
import { useLayoutStore } from '../../stores/layout'
import { useMenuStore } from '../../stores/menu'
import MiMenu from '../menu'
import MiLayoutSiderLogo from './Logo'
import applyTheme from '../_utils/theme'
import styled from './style/sider.module.less'

const MiLayoutSider = defineComponent({
    name: 'MiLayoutSider',
    inheritAttrs: false,
    slots: Object as SlotsType<{
        logo: any
        menu: any
    }>,
    props: LayoutSiderProps(),
    setup(props, { slots }) {
        const layoutStore = useLayoutStore()
        const menuStore = useMenuStore()
        const collapsed = computed(() => layoutStore.collapsed)
        const menus = computed(() => menuStore.menus)
        applyTheme(styled)

        const renderLogo = () => {
            return getPropSlot(slots, props, 'logo') ?? <MiLayoutSiderLogo {...props.logoSetting} />
        }

        const renderMenu = () => {
            return getPropSlot(slots, props, 'menu') ?? <MiMenu items={menus.value} />
        }

        return () => (
            <aside class={`${styled.container}${collapsed.value ? ` ${styled.collapsed}` : ''}`}>
                {renderLogo()}
                {renderMenu()}
            </aside>
        )
    }
})

MiLayoutSider.Logo = MiLayoutSiderLogo

export default MiLayoutSider as typeof MiLayoutSider &
    Plugin & {
        readonly Logo: typeof MiLayoutSiderLogo
    }
