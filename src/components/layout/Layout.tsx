import { defineComponent, type SlotsType } from 'vue'
import { useI18n } from 'vue-i18n'
import { LayoutProps } from './props'
import { $g } from '../../utils/global'
import { useWindowResize } from '../../hooks/useWindowResize'
import { getPrefixCls, getPropSlot } from '../_utils/props'
import applyTheme from '../_utils/theme'
import { ConfigProvider } from 'ant-design-vue'
import MiLayoutSider from './Sider'
import MiLayoutContent from './Content'
import MiLayoutFooter from './Footer'
import styled from './style/layout.module.less'

const MiLayout = defineComponent({
    name: `MiLayout`,
    inheritAttrs: false,
    slots: Object as SlotsType<{
        header: any
        sider: any
        footer: any
    }>,
    props: LayoutProps(),
    setup(props, { slots }) {
        const { locale } = useI18n()
        const { width } = useWindowResize()
        const langClass = getPrefixCls(`lang-${locale}`, props.prefixCls)

        applyTheme(styled)

        const renderSider = () => {
            return getPropSlot(slots, props, 'sider') ?? <MiLayoutSider {...props.siderSetting} />
        }

        const renderHeader = () => {}

        const renderLayout = () => {
            return (
                <>
                    {renderSider()}
                    <section class={styled.content}>
                        {renderHeader()}
                        <MiLayoutContent {...props.contentSetting} />
                    </section>
                </>
            )
        }

        return () => (
            <ConfigProvider
                theme={{ token: { colorPrimary: $g.primaryColor, borderRadius: $g.radius } }}>
                <section
                    class={`${styled.container} ${langClass}`}
                    hasSider={width.value < $g.breakpoints?.md}>
                    {renderLayout()}
                </section>
            </ConfigProvider>
        )
    }
})

MiLayout.Content = MiLayoutContent
MiLayout.Footer = MiLayoutFooter

export default MiLayout as typeof MiLayout & {
    readonly Content: typeof MiLayoutContent
    readonly Footer: typeof MiLayoutFooter
}
