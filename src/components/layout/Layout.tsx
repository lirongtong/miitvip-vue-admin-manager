import { computed, defineComponent, type SlotsType, Transition } from 'vue'
import { useI18n } from 'vue-i18n'
import { LayoutProps } from './props'
import { $g } from '../../utils/global'
import { $tools } from '../../utils/tools'
import { useLayoutStore } from '../../stores/layout'
import { getPrefixCls, getPropSlot } from '../_utils/props'
import { ConfigProvider } from 'ant-design-vue'
import { useWindowResize } from '../../hooks/useWindowResize'
import MiNotice from '../notice/Notice'
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
        content: any
        footer: any
    }>,
    props: LayoutProps(),
    setup(props, { slots }) {
        const store = useLayoutStore()
        const collapsed = computed(() => store.collapsed)
        const { locale } = useI18n()
        const { width } = useWindowResize()
        const anim = getPrefixCls('anim-scale')
        const langClass = getPrefixCls(`lang-${locale.value}`, $g.prefix)

        applyTheme(styled)

        const renderLayoutHeaderExtra = () => {
            return width.value < $g.breakpoints.sm ? (
                <div class={styled.notice}>
                    <MiNotice iconSetting={{ size: 20 }} width={340} placement={'bottom'} />
                </div>
            ) : null
        }

        const renderLayout = () => {
            return slots?.default ? (
                slots.default()
            ) : (
                <>
                    <Transition name={anim} appear={true}>
                        {width.value > $g.breakpoints.sm
                            ? getPropSlot(slots, props, 'sider') ?? (
                                  <MiLayoutSider {...props.siderSetting} />
                              )
                            : null}
                    </Transition>
                    <section
                        class={`${styled.content}${collapsed.value ? ` ${styled.collapsed}` : ''}${
                            width.value > $g.breakpoints.sm ? ` ${styled.hasSider}` : ''
                        }`}>
                        <div class={styled.inner}>
                            {getPropSlot(slots, props, 'header') ?? (
                                <MiLayoutHeader
                                    extra={renderLayoutHeaderExtra()}
                                    {...props.headerSetting}
                                />
                            )}
                            <MiLayoutContent
                                content={getPropSlot(slots, props, 'content')}
                                {...props.contentSetting}
                            />
                            {getPropSlot(slots, props, 'footer') ?? <MiLayoutFooter />}
                        </div>
                    </section>
                </>
            )
        }

        return () => (
            <ConfigProvider theme={{ ...$tools.getAntdvThemeProperties() }}>
                <section class={`${styled.container} ${langClass}`}>{renderLayout()}</section>
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
