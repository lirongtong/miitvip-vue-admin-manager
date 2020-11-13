import { defineComponent } from 'vue'
import PropTypes, { getSlot } from '../../utils/props'

export default defineComponent({
    name: 'MiNoticeTab',
    props: {
        name: PropTypes.string.isRequired,
        title: PropTypes.any.isRequired.def('')
    },
    render() {
        const prefixCls = this.$tools.getPrefixCls('notice-tab')
        return (
            <div class={`${prefixCls}`}>
                <div class={`${prefixCls}-items`}>
                    { getSlot(this) }
                </div>
            </div>
        )
    }
})