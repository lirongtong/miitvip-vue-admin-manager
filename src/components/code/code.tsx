import { defineComponent } from 'vue'
import { getPropSlot, getPrefixCls } from '../_utils/props-tools'
import PropTypes from '../_utils/props-types'

export default defineComponent({
    name: 'MiCode',
    inheritAttrs: false,
    props: {
        prefixCls: PropTypes.string,
        language: PropTypes.string.def('html'),
        content: PropTypes.any
    },
    setup(props, { slots, attrs }) {
        const prefixCls = getPrefixCls('code', props.prefixCls)
        return () => {
            const content = getPropSlot(slots, props, 'content') ?? null
            return (
                <pre {...attrs} v-prism>
                    <code class={`${prefixCls} language-${props.language}`}>
                        {content}
                    </code>
                </pre>
            )
        }
    }
})