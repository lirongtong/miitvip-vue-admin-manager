import { defineComponent, type SlotsType } from 'vue'
import { useI18n } from 'vue-i18n'
import { LayoutProps } from './props'
import { $g } from '../../utils/global'
import { useWindowResize } from '../../hooks/useWindowResize'
import { getPrefixCls, getPropSlot } from '../_utils/props'
import { ConfigProvider } from 'ant-design-vue'
import MiLayoutHeader from './Header'
import MiLayoutSider from './Sider'
import MiLayoutContent from './Content'
import MiLayoutFooter from './Footer'
import applyTheme from '../_utils/theme'
import styled from './style/layout.module.less'

const MiLayout = defineComponent({
    name: `MiLayout`,
    inheritAttrs: false,
    slots: Object as SlotsType<{
        default: any
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

        const renderLayout = () => {
            return slots?.default ? (
                slots.default()
            ) : (
                <>
                    {getPropSlot(slots, props, 'sider') ?? (
                        <MiLayoutSider {...props.siderSetting} />
                    )}
                    <section class={styled.content}>
                        {getPropSlot(slots, props, 'header') ?? (
                            <MiLayoutHeader {...props.headerSetting} />
                        )}
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

MiLayout.Header = MiLayoutHeader
MiLayout.Sider = MiLayoutSider
MiLayout.Content = MiLayoutContent
MiLayout.Footer = MiLayoutFooter

export default MiLayout as typeof MiLayout & {
    readonly Header: typeof MiLayoutHeader
    readonly Sider: typeof MiLayoutSider
    readonly Content: typeof MiLayoutContent
    readonly Footer: typeof MiLayoutFooter
}
