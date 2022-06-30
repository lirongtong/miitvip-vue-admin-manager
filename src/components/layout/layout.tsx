import { defineComponent, computed } from 'vue'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'
import PropTypes from '../_utils/props-types'
import { getPropSlot, getPrefixCls } from '../_utils/props-tools'
import { Layout } from 'ant-design-vue'
import MiLayoutHeader from './header'
import MiLayoutSide from './side'
import MiLayoutContent from './content'
import MiLayoutFooter from './footer'

export const layoutProps = () => ({
    prefixCls: String,
    sideClassName: PropTypes.string,
    menuClassName: PropTypes.string,
    headerClassName: PropTypes.string,
    contentAnimation: PropTypes.string.def('page-slide'),
    showRouteHistory: PropTypes.bool.def(true),
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
        const { locale } = useI18n()
        const langCls = getPrefixCls(`lang-${locale.value}`, props.prefixCls)
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
            return (
                getPropSlot(slots, props, 'header') ?? (
                    <MiLayoutHeader class={props.headerClassName} extra={extra} />
                )
            )
        }
        const getSide = () => {
            let side = getPropSlot(slots, props, 'side') ?? <MiLayoutSide />
            if (isMobile.value) side = null
            return side
        }
        const getLayout = () => {
            return (
                <>
                    {getSide()}
                    <Layout class={`${prefixCls}`}>
                        {getHeader()}
                        <MiLayoutContent
                            animation={props.contentAnimation}
                            showRouteHistory={props.showRouteHistory} />
                        {getPropSlot(slots, props, 'footer') ?? <MiLayoutFooter />}
                    </Layout>
                </>
            )
        }
        return () => (
            <>
                <Layout class={`${layoutCls.value} ${langCls}`} hasSider={!isMobile.value}>
                    {getLayout}
                </Layout>
                {drawer}
            </>
        )
    }
})

MiLayout.Header = MiLayoutHeader
MiLayout.Side = MiLayoutSide
MiLayout.Content = MiLayoutContent
MiLayout.Footer = MiLayoutFooter

export default MiLayout as typeof MiLayout & {
    readonly Header: typeof MiLayoutHeader
    readonly Side: typeof MiLayoutSide
    readonly Content: typeof MiLayoutContent
    readonly Footer: typeof MiLayoutFooter
}
