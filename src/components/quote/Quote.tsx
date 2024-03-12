import { defineComponent } from 'vue'
import { getPropSlot } from '../_utils/props'
import { QuoteProps } from './props'
import applyTheme from '../_utils/theme'
import styled from './style/quote.module.less'

const MiQuote = defineComponent({
    name: 'MiQuote',
    inheritAttrs: false,
    props: QuoteProps(),
    setup(props, { slots }) {
        applyTheme(styled)
        return () => (
            <div class={styled.container} style={{ background: props?.background ?? null }}>
                <div class={styled.content}>{getPropSlot(slots, props, 'default')}</div>
            </div>
        )
    }
})

export default MiQuote
