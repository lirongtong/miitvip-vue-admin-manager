import { defineComponent, computed } from 'vue'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'
import { layoutProps } from './props'
import { getPropSlot, getPrefixCls } from '../_utils/props-tools'
import { Layout } from 'ant-design-vue'
import { $g } from '../../utils/global'
import { useWindowResize } from '../../hooks/useWindowResize'
import MiLayoutHeader from './header'
import MiLayoutSide from './side'
import MiLayoutContent from './content'
import MiLayoutFooter from './footer'
import MiLayoutDrawerMenu from '../menu/drawer'

const MiLayout = defineComponent({
    name: 'MiLayout',
    inheritAttrs: false,
    slots: ['side', 'header', 'headerExtra', 'footer'],
    props: layoutProps(),
    setup(props, { slots }) {
        const { locale, t } = useI18n()
        const langCls = getPrefixCls(`lang-${locale.value}`, props.prefixCls)
        const prefixCls = getPrefixCls('layout', props.prefixCls)
        const { width } = useWindowResize()
        const store = useStore()
        const theme = computed(() => store.getters['layout/theme'])
        const themes = props.themes ?? [
            {
                thumb: $g.theme.thumbnails.dark,
                name: 'dark',
                label: t('theme.dark')
            },
            {
                thumb: $g.theme.thumbnails.light,
                name: 'light',
                label: t('theme.light')
            }
        ]
        const layoutCls = computed(() => {
            let layoutCls = getPrefixCls('layout-container')
            const themeCls = getPrefixCls('theme')
            layoutCls += width.value < $g.devices.mobile ? ` ${layoutCls}-mobile` : ''
            layoutCls += ['dark', 'light'].includes(theme.value)
                ? ` ${themeCls}-${theme.value}`
                : ''
            return layoutCls
        })
        const drawer = <MiLayoutDrawerMenu />
        const getHeader = () => {
            const extra = getPropSlot(slots, props, 'headerExtra')
            return (
                getPropSlot(slots, props, 'header') ?? (
                    <MiLayoutHeader class={props.headerClassName} extra={extra} themes={themes} />
                )
            )
        }
        const getSide = () => {
            return getPropSlot(slots, props, 'side') ?? <MiLayoutSide />
        }
        const getLayout = () => {
            return (
                <>
                    {getSide()}
                    <Layout class={`${prefixCls}`}>
                        {getHeader()}
                        <MiLayoutContent
                            animation={props.contentAnimation}
                            showRouteHistory={props.showRouteHistory}
                        />
                        {getPropSlot(slots, props, 'footer') ?? <MiLayoutFooter />}
                    </Layout>
                </>
            )
        }
        return () => (
            <>
                <Layout
                    class={`${layoutCls.value} ${langCls}`}
                    hasSider={width.value > $g.devices.mobile}>
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
