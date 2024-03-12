import { defineComponent, type SlotsType } from 'vue'
import { TitleProps } from './props'
import { $tools } from '../../utils/tools'
import { getPropSlot } from '../_utils/props'
import applyTheme from '../_utils/theme'
import styled from './style/title.module.less'

const MiTitle = defineComponent({
    name: 'MiTitle',
    inheritAttrs: false,
    props: TitleProps(),
    slots: Object as SlotsType<{ extra: any }>,
    setup(props, { slots }) {
        applyTheme(styled)

        const style = {
            fontSize: $tools.convert2rem($tools.distinguishSize(props.size)),
            color: props?.color ?? null
        }
        const extra = getPropSlot(slots, props, 'default')
        return () => (
            <div class={styled.container}>
                <div class={`${styled.inner}${props.center ? ` ${styled.center}` : ''}`}>
                    <h2 class={styled.content} innerHTML={props.title} style={style} />
                    {extra ? <div class={styled.extra}>{extra}</div> : null}
                </div>
            </div>
        )
    }
})

export default MiTitle
