import { defineComponent } from 'vue'
import PropTypes from '../_utils/props-types'
import { getPrefixCls, getPropSlot } from '../_utils/props-tools'

export default defineComponent({
    name: 'MiQuotes',
    props: {
        prefixCls: PropTypes.string
    },
    setup(props, { slots }) {
        const prefixCls = getPrefixCls('quotes', props.prefixCls)

        return () => (
            <div class={prefixCls}>
                <div class={`${prefixCls}-content`}>{getPropSlot(slots, props, 'default')}</div>
            </div>
        )
    }
})
