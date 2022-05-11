import { defineComponent, computed } from 'vue'
import { useStore } from 'vuex'
import PropTypes from '../_utils/props-types'
import { getPropSlot, getPrefixCls } from '../_utils/props-tools'
import { Layout } from 'ant-design-vue'
import MiLayoutHeader from './header'

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
        const isPhone = computed(() => store.getters['layout/phone'])
        const layoutCls = computed(() => {
            let layoutCls = getPrefixCls('layout-container')
            const themeCls = getPrefixCls('theme')
            layoutCls += isPhone.value ? ` ${layoutCls}-phone` : ''
            layoutCls += ['dark', 'light'].includes(theme.value)
                ? ` ${themeCls}-${theme.value}`
                : ''
            return layoutCls
        })
        const drawer = isPhone.value ? <div></div> : null
        const getHeader = () => {
            let header = getPropSlot(slots, props, 'header')
            const extra = getPropSlot(slots, props, 'headerExtra')
            if (!header)
                header = (
                    <MiLayoutHeader class={props.headerClassName} extra={extra}></MiLayoutHeader>
                )
            return header
        }
        const getLayout = () => {
            return <Layout class={`${prefixCls}`}>{getHeader}</Layout>
        }
        return () => (
            <>
                <Layout class={layoutCls.value} hasSider={!isPhone.value}>
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
