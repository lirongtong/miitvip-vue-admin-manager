import { defineComponent, computed, ref, SlotsType } from 'vue'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'
import { Layout, Popover, Radio, message } from 'ant-design-vue'
import { layoutHeaderProps } from './props'
import { getPropSlot, getPrefixCls } from '../_utils/props-tools'
import { $g } from '../../utils/global'
import { $tools } from '../../utils/tools'
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    BgColorsOutlined,
    ExpandOutlined,
    CompressOutlined,
    CheckCircleOutlined
} from '@ant-design/icons-vue'
import { mutations } from '../../store/types'
import { useWindowResize } from '../../hooks/useWindowResize'
import MiDropdown from '../dropdown'
import MiNotice from '../notice'
import MiBreadcrumb from './breadcrumb'
import screenfull from 'screenfull'

export default defineComponent({
    name: 'MiLayoutHeader',
    inheritAttrs: false,
    props: layoutHeaderProps(),
    slots: Object as SlotsType<{
        stretch: any
        notice: any
        dropdown: any
        extra: any
    }>,
    setup(props, { slots }) {
        const store = useStore()
        const { t } = useI18n()
        const prefixCls = getPrefixCls('layout-header', props.prefixCls)
        const popoverCls = getPrefixCls('popover', props.prefixCls)
        const collapsed = computed(() => store.getters['layout/collapsed'])
        const { width } = useWindowResize()
        const headerCls = {
            left: `${prefixCls}-left`,
            right: `${prefixCls}-right`,
            trigger: `${prefixCls}-trigger`,
            palette: `${prefixCls}-palette`,
            paletteActive: `${prefixCls}-palette-active`
        }
        const full = ref<boolean>(false)
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

        const renderStretch = () => {
            let stretch = getPropSlot(slots, props, 'stretch')
            if (!stretch) {
                if (width.value < $g.devices.mobile) stretch = <MenuUnfoldOutlined />
                else if (!collapsed.value) stretch = <MenuFoldOutlined />
                else stretch = <MenuUnfoldOutlined />
            }
            return stretch
        }

        const renderScreenfull = () => {
            let elem: any = !full.value ? (
                <ExpandOutlined onClick={screenfullQuitOrIn} />
            ) : (
                <CompressOutlined onClick={screenfullQuitOrIn} />
            )
            if ($g.isMobile) elem = null
            return elem ? <div class={triggerCls}>{elem}</div> : null
        }

        const changePalette = (theme = 'dark') => {
            $g.theme.active = theme
        }

        const renderPalette = () => {
            const renderPaletteContent = () => {
                const tempThemes: any[] = []
                themes.forEach((theme: any) => {
                    const thumbStyle = {
                        width: theme.width ? $tools.convert2Rem(theme.width) : null,
                        height: theme.height ? $tools.convert2Rem(theme.height) : null
                    }
                    tempThemes.push(
                        <div
                            class={`${headerCls.palette}-item${
                                $g.theme.active === theme.name ? ` ${headerCls.paletteActive}` : ''
                            }`}
                            onClick={() => changePalette(theme.name)}>
                            <div class={`${headerCls.palette}-thumb`} style={thumbStyle}>
                                {theme.thumb ? <img src={theme.thumb} /> : null}
                            </div>
                            <div class={`${headerCls.palette}-radio`}>
                                <Radio checked={$g.theme.active === theme.name}>
                                    {theme.label}
                                </Radio>
                            </div>
                            <div class={`${headerCls.palette}-selected`}>
                                <CheckCircleOutlined />
                            </div>
                        </div>
                    )
                })
                return <div class={headerCls.palette}>{...tempThemes}</div>
            }

            return (
                getPropSlot(slots, props, 'stretch') ?? (
                    <Popover
                        trigger={['click']}
                        overlayClassName={popoverCls}
                        placement={'bottom'}
                        content={renderPaletteContent()}>
                        <BgColorsOutlined />
                    </Popover>
                )
            )
        }

        const screenfullQuitOrIn = () => {
            if (screenfull.isEnabled) {
                const elem = document.body
                if (elem) {
                    full.value = !full.value
                    if (full.value) {
                        screenfull.request(elem)
                        screenfull.on('error', () => message.error(t('screenfull.error')))
                    } else screenfull.exit()
                    screenfull.onchange(() => {
                        full.value = screenfull.isFullscreen
                    })
                } else message.warning(t('screenfull.capture'))
            } else message.warning(t('screenfull.support'))
        }

        const setCollapsed = () => {
            if (width.value < $g.devices.mobile) {
                $g.menus.drawer = !$g.menus.drawer
            } else {
                const collapse = !collapsed.value
                $g.menus.collapsed = collapse
                store.commit(`layout/${mutations.layout.collapsed}`, collapse)
            }
        }

        const triggerCls = `${headerCls.trigger} ${headerCls.trigger}-min`

        return () => (
            <Layout.Header class={prefixCls}>
                {/* left */}
                <div class={headerCls.left}>
                    <div
                        class={`${headerCls.trigger} ${headerCls.trigger}-no-bg`}
                        onClick={setCollapsed}>
                        {renderStretch()}
                    </div>
                    <div class={`${headerCls.trigger}`}>
                        <MiBreadcrumb />
                    </div>
                </div>
                {/* right */}
                <div class={headerCls.right}>
                    {getPropSlot(slots, props, 'extra')}
                    {renderScreenfull()}
                    <div class={triggerCls}>
                        {getPropSlot(slots, props, 'notice') ?? (
                            <MiNotice class={`${prefixCls}-notice`} />
                        )}
                    </div>
                    <div class={triggerCls}>{renderPalette()}</div>
                    <div class={triggerCls}>
                        {getPropSlot(slots, props, 'dropdown') ?? (
                            <MiDropdown class={`${prefixCls}-dropdown`} />
                        )}
                    </div>
                </div>
            </Layout.Header>
        )
    }
})
