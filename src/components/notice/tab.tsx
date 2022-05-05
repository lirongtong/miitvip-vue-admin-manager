import { defineComponent } from 'vue'
import PropTypes from '../_utils/props-types'
import { getPropSlot, getPrefixCls } from '../_utils/props-tools'

export default defineComponent({
    name: 'MiNoticeTab',
    props: {
        name: PropTypes.string.isRequired,
        title: PropTypes.any.isRequired.def('')
    },
    setup(props, { slots }) {
        const prefixCls = getPrefixCls('notice-tab')
        return (
            <div class={prefixCls}>
                <div class={`${prefixCls}-items`}>{getPropSlot(slots, props)}</div>
            </div>
        )
    }
})
