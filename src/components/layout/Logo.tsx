import { defineComponent, computed, type SlotsType } from 'vue'
import { LayoutSiderLogoProps } from './props'
import { RouterLink } from 'vue-router'
import { $g } from '../../utils/global'
import { getPropSlot } from '../_utils/props'
import { useI18n } from 'vue-i18n'
import { useLayoutStore } from '../../stores/layout'
import { logo } from '../../utils/images'
import { useWindowResize } from '../../hooks/useWindowResize'
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons-vue'
import MiNotice from '../notice'
import applyTheme from '../_utils/theme'
import styled from './style/logo.module.less'

export default defineComponent({
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
        const { width } = useWindowResize()
        const store = useLayoutStore()
        const collapsedState = computed(() => store.collapsed)

        applyTheme(styled)

        const renderCollapsed = () => {
            const collapsed = (
                <div class={styled.trigger}>
                    {width.value < $g.breakpoints.md ? (
                        <MenuUnfoldOutlined />
                    ) : !collapsedState.value ? (
                        <MenuFoldOutlined />
                    ) : (
                        <MenuUnfoldOutlined />
                    )}
                </div>
            )
            return getPropSlot(slots, props, 'collapsed') ?? collapsed
        }

        const renderNotice = () => {
            return (
                <div class={styled.trigger}>
                    {getPropSlot(slots, props, 'notice') ?? (
                        <MiNotice iconSetting={{ size: 16 }} width={340} />
                    )}
                </div>
            )
        }

        const renderLogo = (
            <div class={styled.logo}>
                <img src={$g.logo ?? logo} alt={title} />
            </div>
        )

        const slot = slots?.default ?? (
            <RouterLink to={{ path: '/' }} class={styled.site}>
                {renderLogo}
                {title ? <h3 innerHTML={title} /> : null}
            </RouterLink>
        )

        return () => (
            <div class={`${styled.container}${props.circle ? ` ${styled.circle}` : ''}`}>
                <div class={styled.action}>
                    {renderCollapsed()}
                    {renderNotice()}
                </div>
                <div class={styled.inner}>{slot}</div>
            </div>
        )
    }
})
