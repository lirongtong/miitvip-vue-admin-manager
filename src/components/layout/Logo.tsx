import { defineComponent } from 'vue'
import { LayoutSiderLogoProps } from './props'
import { RouterLink } from 'vue-router'
import { $g } from '../../utils/global'
import { useI18n } from 'vue-i18n'
import { logo } from '../../utils/images'
import applyTheme from '../_utils/theme'
import styled from './style/logo.module.less'

export default defineComponent({
    name: 'MiLayoutSiderLogo',
    inheritAttrs: false,
    props: LayoutSiderLogoProps(),
    setup(props, { slots }) {
        const { t } = useI18n()
        const title = $g.site || t('site')

        applyTheme(styled)

        const renderLogo = (
            <div class={styled.logo}>
                <img src={$g.logo ?? logo} alt={title} />
            </div>
        )

        const slot = slots?.default ?? (
            <RouterLink to={{ path: '/' }} class={styled.site}>
                {renderLogo}
                {title ? <h1 innerHTML={title} /> : null}
            </RouterLink>
        )
        return () => (
            <div
                class={`${styled.container}${props.vertical ? ` ${styled.vertical}` : ''}${
                    props.circle ? ` ${styled.circle}` : ''
                }`}>
                {slot}
            </div>
        )
    }
})
