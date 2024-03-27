import { computed, defineComponent, type SlotsType } from 'vue'
import { TitleProps } from './props'
import { $tools } from '../../utils/tools'
import { getPropSlot } from '../_utils/props'
import { useWindowResize } from '../../hooks/useWindowResize'
import applyTheme from '../_utils/theme'
import styled from './style/title.module.less'

const MiTitle = defineComponent({
    name: 'MiTitle',
    inheritAttrs: false,
    props: TitleProps(),
    slots: Object as SlotsType<{ extra: any }>,
    setup(props, { slots }) {
        applyTheme(styled)

        const { width } = useWindowResize()
        const fontSize = computed(() => {
            return $tools.convert2rem($tools.distinguishSize(props.size, width.value))
        })
        const style = computed(() => {
            return {
                fontSize: fontSize.value,
                color: props?.color ?? null,
                ...$tools.wrapPositionOrSpacing(props.margin, 'margin')
            }
        })
        const extra = getPropSlot(slots, props, 'default')
        return () => (
            <div class={styled.container}>
                <div class={`${styled.inner}${props.center ? ` ${styled.center}` : ''}`}>
                    <h2 class={styled.content} innerHTML={props.title} style={style.value} />
                    {extra ? <div class={styled.extra}>{extra}</div> : null}
                </div>
            </div>
        )
    }
})

export default MiTitle
