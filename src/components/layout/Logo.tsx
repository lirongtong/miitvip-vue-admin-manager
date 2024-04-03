import { defineComponent, computed, type SlotsType, Transition } from 'vue'
import { LayoutSiderLogoProps } from './props'
import { RouterLink } from 'vue-router'
import { $g } from '../../utils/global'
import { getPropSlot, getPrefixCls } from '../_utils/props'
import { useI18n } from 'vue-i18n'
import { useLayoutStore } from '../../stores/layout'
import { useWindowResize } from '../../hooks/useWindowResize'
import { __LOGO__ } from '../../utils/images'
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons-vue'
import MiNotice from '../notice'
import applyTheme from '../_utils/theme'
import styled from './style/logo.module.less'

const MiLayoutSiderLogo = defineComponent({
    name: 'MiLayoutSiderLogo',
    inheritAttrs: false,
    slots: Object as SlotsType<{
        default: any
        collapsed: any
        notice: any
    }>,
    props: LayoutSiderLogoProps(),
    setup(props, { slots }) {
        const { t } = useI18n()
        const title = $g.site || t('global.site')
        const store = useLayoutStore()
        const { width } = useWindowResize()
        const collapsedState = computed(() => store.collapsed)
        const anim = getPrefixCls('anim-fade')
        applyTheme(styled)

        const renderCollapsed = () => {
            if (width.value > $g.breakpoints.sm && width.value < $g.breakpoints.md) {
                store.$patch({ collapsed: true })
                return null
            } else
                return (
                    getPropSlot(slots, props, 'collapsed') ?? (
                        <div class={styled.trigger} onClick={() => store.updateCollapsed()}>
                            {!collapsedState.value ? <MenuFoldOutlined /> : <MenuUnfoldOutlined />}
                        </div>
                    )
                )
        }

        const renderNotice = () => {
            return (
                <div class={styled.trigger}>
                    {getPropSlot(slots, props, 'notice') ?? (
                        <MiNotice
                            iconSetting={{ size: 16 }}
                            width={340}
                            placement={collapsedState.value ? 'topRight' : 'bottom'}
                        />
                    )}
                </div>
            )
        }

        const renderLogo = (
            <div class={styled.logo}>
                <img src={$g.logo ?? __LOGO__} alt={title} />
            </div>
        )

        const slot = slots?.default ? (
            slots?.default()
        ) : (
            <RouterLink to={{ path: '/' }} class={styled.site}>
                {renderLogo}
                <Transition name={anim} appear={true}>
                    {title && !collapsedState.value ? (
                        <div class={styled.siteTitle} innerHTML={title} />
                    ) : null}
                </Transition>
            </RouterLink>
        )

        return () => (
            <div
                class={`${styled.container}${props.circle ? ` ${styled.circle}` : ''}${
                    collapsedState.value ? ` ${styled.collapsed}` : ''
                }`}>
                {props.showAction ? (
                    <div class={styled.action}>
                        {renderCollapsed()}
                        {renderNotice()}
                    </div>
                ) : null}
                <div class={styled.inner}>{slot}</div>
            </div>
        )
    }
})

export default MiLayoutSiderLogo
