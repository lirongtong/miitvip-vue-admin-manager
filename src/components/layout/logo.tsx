import { defineComponent } from 'vue'
import { MediumOutlined } from '@ant-design/icons-vue'
import { $g } from '../../utils/global'
import { getPrefixCls } from '../_utils/props-tools'
import { RouterLink } from 'vue-router'

export default defineComponent({
    name: 'MiLayoutSideLogo',
    inheritAttrs: false,
    props: {
        prefixCls: String
    },
    setup(props, { slots }) {
        const title = $g.site ?? '麦可易特网'
        const prefixCls = getPrefixCls('layout-side-logo', props.prefixCls)
        let logo = <MediumOutlined />
        if ($g.logo && $g.regExp.url.test($g.logo)) {
            logo = <img src={$g.logo} alt={$g.site} />
        }
        const slot = slots?.default ?? (
            <RouterLink to={{ path: '/' }} class={`${prefixCls}-site`}>
                {logo}
                <h1 innerHTML={title}></h1>
            </RouterLink>
        )
        return () => <div class={prefixCls}>{slot}</div>
    }
})
