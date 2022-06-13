import { defineComponent, computed, ref } from 'vue'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'
import { Layout, Popover, Radio } from 'ant-design-vue'
import PropTypes from '../_utils/props-types'
import { getPropSlot, getPrefixCls } from '../_utils/props-tools'
import { $g } from '../../utils/global'
import {
    MenuFoldOutlined, MenuUnfoldOutlined, BgColorsOutlined,
    ExpandOutlined, CompressOutlined
} from '@ant-design/icons-vue'
import { mutations } from '../../store/types'
import MiDropdown from '../dropdown'
import MiNotice from '../notice'
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
        const isMobile = computed(() => store.getters['layout/mobile'])
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
                if (isMobile.value) stretch = <MenuUnfoldOutlined />
                else if (!collapsed.value) stretch = <MenuFoldOutlined />
                else stretch = <MenuUnfoldOutlined />
            }
            return stretch
        }

        const getScreenfull = () => {
            let elem = !full.value
                ? <ExpandOutlined onClick={screenfullQuitOrIn} />
                : <CompressOutlined onClick={screenfullQuitOrIn} />
            if (isMobile.value) elem = null
            return elem
        }

        const changePalette = (theme = 'dark') => {
            $g.theme.active = theme
        }

        const getPalette = () => {
            const getPaletteContent = () => {
                return (
                    <div class={headerCls.palette}>
                        <div class={`${headerCls.palette}-item${$g.theme.active === 'dark' ? ` ${headerCls.palette}-active` : ''}`} onClick={() => changePalette('dark')}>
                            <div class={`${headerCls.palette}-thumb`}>
                                <img src={$g.theme.thumbnails.dark} />
                            </div>
                            <div class={`${headerCls.palette}-radio`}>
                                <Radio checked={$g.theme.active === 'dark'}>{t('theme.dark')}</Radio>
                            </div>
                        </div>
                        <div class={`${headerCls.palette}-item${$g.theme.active === 'light' ? ` ${headerCls.palette}-active` : ''}`} onClick={() => changePalette('light')}>
                            <div class={`${headerCls.palette}-thumb`}>
                                <img src={$g.theme.thumbnails.light} />
                            </div>
                            <div class={`${headerCls.palette}-radio`}>
                                <Radio checked={$g.theme.active === 'light'}>{t('theme.light')}</Radio>
                            </div>
                        </div>
                    </div>
                )
            }

            return getPropSlot(slots, props, 'stretch') ?? (
                <Popover trigger={['click']}
                    overlayClassName={popoverCls}
                    placement={'bottom'}
                    content={getPaletteContent()}>
                    <BgColorsOutlined />
                </Popover>
            )
        }

        const screenfullQuitOrIn = () => {
            if (screenfull.isEnabled) {
                const elem = document.body
                if (elem) {
                    full.value = !full.value
                    if (full.value) {
                        screenfull.request(elem)
                        screenfull.on('error', () => console.log(t('screenfull.error')))
                    } else screenfull.exit()
                    screenfull.onchange(() => {
                        full.value = screenfull.isFullscreen
                    })
                } else console.log(t('screenfull.capture'))
            } else console.log(t('screenfull.support'))
        }

        const setCollapsed = () => {
            if (isMobile.value) {
                $g.menus.drawer = !$g.menus.drawer
            } else {
                const collapse = !collapsed.value
                $g.menus.collapsed = collapse
                store.commit(`layout/${mutations.layout.collapsed}`, collapse)
            }
        }

        return () => (
            <Layout.Header class={`${prefixCls}`} {...attrs}>
                {/* left */}
                <div class={headerCls.left}>
                    <div class={`${headerCls.trigger} ${headerCls.trigger}-no-bg`}
                        onClick={setCollapsed}>
                        {getStretch()}
                    </div>
                </div>
                {/* right */}
                <div class={headerCls.right}>
                    {getPropSlot(slots, props, 'extra')}
                    <div class={`${headerCls.trigger} ${headerCls.trigger}-min`}>
                        { getScreenfull() ??  null }
                    </div>
                    <div class={`${headerCls.trigger} ${headerCls.trigger}-min`}>
                        {getPropSlot(slots, props, 'notice') ?? (
                            <MiNotice class={`${prefixCls}-notice`} />
                        )}
                    </div>
                    <div class={`${headerCls.trigger} ${headerCls.trigger}-min`}>{getPalette()}</div>
                    <div class={`${headerCls.trigger} ${headerCls.trigger}-min`}>
                        {getPropSlot(slots, props, 'dropdown') ?? <MiDropdown />}
                    </div>
                </div>
            </Layout.Header>
        )
    }
})
