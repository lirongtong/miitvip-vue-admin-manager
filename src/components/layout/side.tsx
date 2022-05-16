import { defineComponent, computed } from 'vue'
import { useStore } from 'vuex'
import { Layout } from 'ant-design-vue'
import PropTypes from '../_utils/props-types'
import { getPropSlot, getPrefixCls } from '../_utils/props-tools'
import { $g } from '../../utils/global'
import MiLayoutSideLogo from './logo'
import MiLayoutSideMenu from '../menu'

export const layoutSideProps = () => ({
    prefixCls: String,
    logo: PropTypes.any,
    menu: PropTypes.any
})

const MiLayoutSider = defineComponent({
    name: 'MiLayoutSide',
    inheritAttrs: false,
    slots: ['logo', 'menu'],
    props: layoutSideProps(),
    setup(props, {slots}) {
        const store = useStore()
        const isMobile = computed(() => store.getters['layout/mobile'])
        const prefixCls = getPrefixCls('layout-side', props.prefixCls)
        const setCollapsed = () => {}
        const getLogo = () => {
            let logo = getPropSlot(slots, props, 'logo')
            if (!logo && !isMobile.value) logo = <MiLayoutSideLogo />
            return logo
        }
        const getMenu = () => {
            return getPropSlot(slots, props, 'menu') ?? <MiLayoutSideMenu class={`${prefixCls}-menu`} items={$g.menus.items} />
        }
        return () => (
            <Layout.Sider class={prefixCls} width={$g.menus.width} breakpoint="lg" collapsed={$g.menus.collapsed} onBreakpoint={setCollapsed} trigger={null} collapsible={true}>
                {getLogo()}
                {getMenu()}
            </Layout.Sider>
        )
    }
})
export default MiLayoutSider
