import { defineComponent, type SlotsType, type Plugin, computed } from 'vue'
import { LayoutSiderProps } from './props'
import { $g } from '../../utils/global'
import { getPropSlot } from '../_utils/props'
import { useLayoutStore } from '../../stores/layout'
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
        const store = useLayoutStore()
        const collapsed = computed(() => store.collapsed)
        applyTheme(styled)

        const renderLogo = () => {
            return getPropSlot(slots, props, 'logo') ?? <MiLayoutSiderLogo {...props.logoSetting} />
        }

        const renderMenu = () => {
            return getPropSlot(slots, props, 'menu') ?? <MiMenu items={$g.menus} />
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
