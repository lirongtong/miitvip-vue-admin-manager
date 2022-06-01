import { defineComponent, computed } from 'vue'
import { Layout } from 'ant-design-vue'
import { $g } from '../../utils/global'
import { getPropSlot, getPrefixCls } from '../_utils/props-tools'

export default defineComponent({
    name: 'MiLayoutFooter',
    inheritAttrs: false,
    props: {
        prefixCls: String
    },
    setup(props, { slots }) {
        const prefixCls = getPrefixCls('layout-footer', props.prefixCls)
        const copyright = computed(() => $g.isMobile ? $g.copyright.mobile : $g.copyright.pc)
        return () => (
            <Layout.Footer class={prefixCls}>
                {getPropSlot(slots, props) ?? <div class={`${prefixCls}-content`} innerHTML={copyright.value}></div>}
            </Layout.Footer>
        )
    }
})
