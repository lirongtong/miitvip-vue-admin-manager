import { defineComponent, computed } from 'vue'
import { useStore } from 'vuex'
import PropTypes from '../_utils/props-types'
import { getPropSlot, getPrefixCls } from '../_utils/props-tools'
import { Layout } from 'ant-design-vue'
import MiLayoutHeader from './header'
import MiLayoutSide from './side'

export const layoutProps = () => ({
    prefixCls: String,
    sideClassName: PropTypes.string,
    menuClassName: PropTypes.string,
    headerClassName: PropTypes.string,
    side: PropTypes.any,
    header: PropTypes.any,
    headerExtra: PropTypes.any,
    footer: PropTypes.any
})

const MiLayout = defineComponent({
    name: 'MiLayout',
    inheritAttrs: false,
    slots: ['side', 'header', 'headerExtra', 'footer'],
    props: layoutProps(),
    setup(props, { slots }) {
        const prefixCls = getPrefixCls('layout', props.prefixCls)
        const store = useStore()
        const theme = computed(() => store.getters['layout/theme'])
        const isMobile = computed(() => store.getters['layout/mobile'])
        const layoutCls = computed(() => {
            let layoutCls = getPrefixCls('layout-container')
            const themeCls = getPrefixCls('theme')
            layoutCls += isMobile.value ? ` ${layoutCls}-mobile` : ''
            layoutCls += ['dark', 'light'].includes(theme.value)
                ? ` ${themeCls}-${theme.value}`
                : ''
            return layoutCls
        })
        const drawer = isMobile.value ? <div></div> : null
        const getHeader = () => {
            const extra = getPropSlot(slots, props, 'headerExtra')
            const header = getPropSlot(slots, props, 'header') ?? <MiLayoutHeader class={props.headerClassName} extra={extra} />
            return header
        }
        const getSide = () => {
            let side = getPropSlot(slots, props, 'side') ?? <MiLayoutSide />
            if (isMobile.value) side = null
            return side
        }
        const getLayout = () => {
            return (
                <>
                    { getSide() }
                    <Layout class={`${prefixCls}`}>{getHeader}</Layout>
                </>
            )
        }
        return () => (
            <>
                <Layout class={layoutCls.value} hasSider={!isMobile.value}>
                    {getLayout}
                </Layout>
                {drawer}
            </>
        )
    }
})

MiLayout.Header = MiLayoutHeader

export default MiLayout as typeof MiLayout & {
    readonly Header: typeof MiLayoutHeader
}
