import { defineComponent, type SlotsType } from 'vue'
import { LayoutSiderProps } from './props'
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
    setup() {
        applyTheme(styled)

        const renderLogo = () => {}
        const renderMenu = () => {}

        return () => (
            <aside class={styled.container}>
                {renderLogo()}
                {renderMenu()}
            </aside>
        )
    }
})
