import { defineComponent, type SlotsType, type Plugin, computed } from 'vue'
import { LayoutSiderProps } from './props'
import { getPropSlot } from '../_utils/props'
import { useLayoutStore } from '../../stores/layout'
import { useMenuStore } from '../../stores/menu'
import { Skeleton } from 'ant-design-vue'
import MiMenu from '../menu/Menu'
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
        const useLayout = useLayoutStore()
        const useMenu = useMenuStore()
        const collapsed = computed(() => useLayout.collapsed)
        const menus = computed(() => useMenu.menus)
        const loading = computed(() => useMenu.loading)
        applyTheme(styled)

        const renderLogo = () => {
            return getPropSlot(slots, props, 'logo') ?? <MiLayoutSiderLogo {...props.logoSetting} />
        }

        const renderMenu = () => {
            return (
                getPropSlot(slots, props, 'menu') ?? (
                    <Skeleton active={true} loading={loading.value}>
                        <MiMenu items={menus.value} />
                    </Skeleton>
                )
            )
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
