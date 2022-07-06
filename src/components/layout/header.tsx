import { defineComponent, computed, ref } from 'vue'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'
import { Layout, Popover, Radio, message } from 'ant-design-vue'
import PropTypes from '../_utils/props-types'
import { getPropSlot, getPrefixCls } from '../_utils/props-tools'
import { $g } from '../../utils/global'
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    BgColorsOutlined,
    ExpandOutlined,
    CompressOutlined
} from '@ant-design/icons-vue'
import { mutations } from '../../store/types'
import MiDropdown from '../dropdown'
import MiNotice from '../notice'
import MiBreadcrumb from './breadcrumb'
import screenfull from 'screenfull'

export const layoutHeaderProps = () => ({
    prefixCls: String,
    stretch: PropTypes.any,
    notice: PropTypes.any,
    dropdown: PropTypes.any,
    extra: PropTypes.any
})

export default defineComponent({
    name: 'MiLayoutHeader',
    inheritAttrs: false,
    props: layoutHeaderProps(),
    slots: ['stretch', 'notice', 'dropdown', 'extra'],
    setup(props, { slots, attrs }) {
        const store = useStore()
        const { t } = useI18n()
        const prefixCls = getPrefixCls('layout-header', props.prefixCls)
        const popoverCls = getPrefixCls('popover', props.prefixCls)
        const collapsed = computed(() => store.getters['layout/collapsed'])
        const headerCls = {
            left: `${prefixCls}-left`,
            right: `${prefixCls}-right`,
            trigger: `${prefixCls}-trigger`,
            palette: `${prefixCls}-palette`
        }
        const full = ref<boolean>(false)

        const getStretch = () => {
            let stretch = getPropSlot(slots, props, 'stretch')
            if (!stretch) {
                if ($g.isMobile) stretch = <MenuUnfoldOutlined />
                else if (!collapsed.value) stretch = <MenuFoldOutlined />
                else stretch = <MenuUnfoldOutlined />
            }
            return stretch
        }

        const getScreenfull = () => {
            let elem = !full.value ? (
                <ExpandOutlined onClick={screenfullQuitOrIn} />
            ) : (
                <CompressOutlined onClick={screenfullQuitOrIn} />
            )
            if ($g.isMobile) elem = null
            return elem
        }

        const changePalette = (theme = 'dark') => {
            $g.theme.active = theme
        }

        const getPalette = () => {
            const getPaletteContent = () => {
                return (
                    <div class={headerCls.palette}>
                        <div
                            class={`${headerCls.palette}-item${
                                $g.theme.active === 'dark' ? ` ${headerCls.palette}-active` : ''
                            }`}
                            onClick={() => changePalette('dark')}>
                            <div class={`${headerCls.palette}-thumb`}>
                                <img src={$g.theme.thumbnails.dark} />
                            </div>
                            <div class={`${headerCls.palette}-radio`}>
                                <Radio checked={$g.theme.active === 'dark'}>
                                    {t('theme.dark')}
                                </Radio>
                            </div>
                        </div>
                        <div
                            class={`${headerCls.palette}-item${
                                $g.theme.active === 'light' ? ` ${headerCls.palette}-active` : ''
                            }`}
                            onClick={() => changePalette('light')}>
                            <div class={`${headerCls.palette}-thumb`}>
                                <img src={$g.theme.thumbnails.light} />
                            </div>
                            <div class={`${headerCls.palette}-radio`}>
                                <Radio checked={$g.theme.active === 'light'}>
                                    {t('theme.light')}
                                </Radio>
                            </div>
                        </div>
                    </div>
                )
            }

            return (
                getPropSlot(slots, props, 'stretch') ?? (
                    <Popover
                        trigger={['click']}
                        overlayClassName={popoverCls}
                        placement={'bottom'}
                        content={getPaletteContent()}>
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
            if ($g.isMobile) {
                $g.menus.drawer = !$g.menus.drawer
            } else {
                const collapse = !collapsed.value
                $g.menus.collapsed = collapse
                store.commit(`layout/${mutations.layout.collapsed}`, collapse)
            }
        }

        const triggerCls = `${headerCls.trigger} ${headerCls.trigger}-min`

        return () => (
            <Layout.Header class={`${prefixCls}`} {...attrs}>
                {/* left */}
                <div class={headerCls.left}>
                    <div
                        class={`${headerCls.trigger} ${headerCls.trigger}-no-bg`}
                        onClick={setCollapsed}>
                        {getStretch()}
                    </div>
                    <div class={`${headerCls.trigger}`}>
                        <MiBreadcrumb />
                    </div>
                </div>
                {/* right */}
                <div class={headerCls.right}>
                    {getPropSlot(slots, props, 'extra')}
                    <div class={triggerCls}>{getScreenfull() ?? null}</div>
                    <div class={triggerCls}>
                        {getPropSlot(slots, props, 'notice') ?? (
                            <MiNotice class={`${prefixCls}-notice`} />
                        )}
                    </div>
                    <div class={triggerCls}>{getPalette()}</div>
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
