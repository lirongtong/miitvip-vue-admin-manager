import { defineComponent, computed } from 'vue'
import { Layout } from 'ant-design-vue'
import { $g } from '../../utils/global'
import { getPropSlot, getPrefixCls } from '../_utils/props-tools'
import PropTypes from '../_utils/props-types'
import { useWindowResize } from '../../hooks/useWindowResize'

export default defineComponent({
    name: 'MiLayoutFooter',
    inheritAttrs: false,
    props: {
        prefixCls: PropTypes.string
    },
    setup(props, { slots }) {
        const prefixCls = getPrefixCls('layout-footer', props.prefixCls)
        const { width } = useWindowResize()
        const copyright = computed(() => {
            return width.value < $g.devices.mobile ? $g.copyright.mobile : $g.copyright.pc
        })
        return () => (
            <Layout.Footer class={prefixCls}>
                {getPropSlot(slots, props) ?? (
                    <div class={`${prefixCls}-content`} innerHTML={copyright.value}></div>
                )}
            </Layout.Footer>
        )
    }
})
