import { defineComponent, type SlotsType } from 'vue'
import { LayoutSiderProps } from './props'
import { getPropSlot } from '../_utils/props'
import MiLayoutSiderLogo from './Logo'
import applyTheme from '../_utils/theme'
import styled from './style/sider.module.less'

export default defineComponent({
    name: 'MiLayoutSider',
    inheritAttrs: false,
    slots: Object as SlotsType<{
        logo: any
        menu: any
    }>,
    props: LayoutSiderProps(),
    setup(props, { slots }) {
        applyTheme(styled)

        const renderLogo = () => {
            return getPropSlot(slots, props, 'logo') ?? <MiLayoutSiderLogo {...props.logoSetting} />
        }

        const renderMenu = () => {}

        return () => (
            <aside class={styled.container}>
                {renderLogo()}
                {renderMenu()}
            </aside>
        )
    }
})
