import { defineComponent } from 'vue'
import { MediumOutlined } from '@ant-design/icons-vue'
import { $g } from '../../utils/global'
import { useI18n } from 'vue-i18n'
import { getPrefixCls } from '../_utils/props-tools'
import PropTypes from '../_utils/props-types'
import { RouterLink } from 'vue-router'

export default defineComponent({
    name: 'MiLayoutSideLogo',
    inheritAttrs: false,
    props: {
        prefixCls: PropTypes.string,
        column: PropTypes.bool.def(true)
    },
    setup(props, { slots }) {
        const { t } = useI18n()
        const title = $g.site ?? t('site')
        const prefixCls = getPrefixCls('layout-side-logo', props.prefixCls)

        let logo = <MediumOutlined />
        if ($g.logo && $g.regExp.url.test($g.logo)) {
            logo = (
                <div class={`${prefixCls}-img`}>
                    <img src={$g.logo} alt={$g.site} />
                </div>
            )
        }

        const slot = slots?.default ?? (
            <RouterLink to={{ path: '/' }} class={`${prefixCls}-site`}>
                {logo}
                <h1 innerHTML={title}></h1>
            </RouterLink>
        )
        return () => (
            <div class={`${prefixCls}${props.column ? ` ${prefixCls}-column` : ''}`}>{slot}</div>
        )
    }
})
