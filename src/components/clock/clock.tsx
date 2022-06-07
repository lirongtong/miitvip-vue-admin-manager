import { defineComponent } from 'vue'
import PropTypes from '../_utils/props-types'
import { getPrefixCls } from '../_utils/props-tools'

export const clockProps = () => ({
    prefixCls: PropTypes.string,
    width: PropTypes.number.def(200),
    height: PropTypes.number.def(200)
})

export default defineComponent({
    name: 'MiClock',
    inheritAttrs: false,
    props: clockProps(),
    setup(props) {
        const prefixCls = getPrefixCls('clock', props.prefixCls)
        return () => (
            <div class={prefixCls}>
                <div class={`${prefixCls}-panel`}></div>
                <div class={`${prefixCls}-num ${prefixCls}-num-3`}>3</div>
                <div class={`${prefixCls}-num ${prefixCls}-num-6`}>6</div>
                <div class={`${prefixCls}-num ${prefixCls}-num-9`}>9</div>
                <div class={`${prefixCls}-num ${prefixCls}-num-12`}>12</div>
                <div class={`${prefixCls}-hour-pointer`}><div></div></div>
                <div class={`${prefixCls}-minute-pointer`}><div></div></div>
                <div class={`${prefixCls}-second-pointer`}><div></div></div>
                <div class={`${prefixCls}-point`}></div>
            </div>
        )
    }
})