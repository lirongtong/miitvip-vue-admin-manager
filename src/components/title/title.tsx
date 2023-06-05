import { defineComponent } from 'vue'
import PropTypes from '../_utils/props-types'
import { getPrefixCls, getPropSlot } from '../_utils/props-tools'
import { $tools } from '../../utils/tools'

export const titleProps = () => ({
    prefixCls: PropTypes.string,
    title: PropTypes.string.isRequired,
    center: PropTypes.bool.def(false),
    size: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).def(32)
})

export default defineComponent({
    name: 'MiTitle',
    inheritAttrs: false,
    props: titleProps(),
    setup(props, { slots }) {
        const prefixCls = getPrefixCls('title', props.prefixCls)

        return () => (
            <div class={prefixCls}>
                <div class={`${prefixCls}-wrap${props.center ? ' center' : ''}`}>
                    <h2
                        class={`${prefixCls}-content`}
                        innerHTML={props.title}
                        style={{ fontSize: $tools.convert2Rem(props.size) }}></h2>
                    <div class={`${prefixCls}-extra`}>{getPropSlot(slots, props, 'default')}</div>
                </div>
            </div>
        )
    }
})
