import { computed, defineComponent } from 'vue'
import { ItemsTextMarkerProps } from './props'
import { $tools } from '../../../utils/tools'
import applyTheme from '../../_utils/theme'
import styled from './style/marker.module.less'

const MiItemsTextMarker = defineComponent({
    name: 'MiItemsTextMarker',
    props: ItemsTextMarkerProps(),
    setup(props) {
        applyTheme(styled)

        const margin = computed(() => {
            return typeof props?.marker?.margin === 'string' ||
                typeof props?.marker?.margin === 'number'
                ? { margin: $tools.convert2rem($tools.distinguishSize(props?.marker?.margin)) }
                : { ...$tools.wrapPositionOrSpacing(props?.marker?.margin || {}, 'margin') }
        })

        const markerShapeStyle = computed(() => {
            return {
                width: $tools.convert2rem($tools.distinguishSize(props?.marker?.size)),
                height: $tools.convert2rem($tools.distinguishSize(props?.marker?.size)),
                minWidth: $tools.convert2rem($tools.distinguishSize(props?.marker?.size)),
                backgroundColor: props?.marker?.color || null,
                ...margin.value
            }
        })

        const markerTextStyle = computed(() => {
            return {
                ...margin.value,
                color: props?.marker?.color || null
            }
        })

        const NUMBERS = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十']
        const upperNumber = computed((): string => {
            const multiple = Math.floor(props.number / 10)
            return typeof props.number !== 'undefined'
                ? multiple > 0
                    ? NUMBERS[multiple - 1] + NUMBERS[props.number]
                    : NUMBERS[props.number]
                : ''
        })

        const renderMarker = () => {
            let marker = ''
            switch (props?.marker?.type) {
                case 'number':
                    marker = (
                        <span
                            class={styled.markerText}
                            style={markerTextStyle.value}
                            innerHTML={props.number + 1}></span>
                    )
                    break
                case 'upper-number':
                    marker = (
                        <span
                            class={styled.markerText}
                            style={markerTextStyle.value}
                            innerHTML={upperNumber.value}></span>
                    )
                    break
                case 'letter':
                    const letter = String.fromCharCode(props.number + 65).toLowerCase()
                    marker = (
                        <span
                            class={styled.markerText}
                            style={markerTextStyle.value}
                            innerHTML={letter}></span>
                    )
                    break
                case 'upper-letter':
                    marker = (
                        <span
                            class={styled.markerText}
                            style={markerTextStyle.value}
                            innerHTML={String.fromCharCode(props.number + 65)}></span>
                    )
                    break
                case 'circle':
                    marker = (
                        <span
                            class={[styled.marker, styled.circle]}
                            style={{ ...markerShapeStyle.value }}></span>
                    )
                    break
                case 'square':
                    marker = (
                        <span
                            class={[styled.marker, styled.square]}
                            style={{ ...markerShapeStyle.value }}></span>
                    )
                    break
                case 'roman-number':
                    marker = (
                        <span
                            class={styled.markerText}
                            style={markerTextStyle.value}
                            innerHTML={$tools.convert2RomanNumber(props.number + 1)}></span>
                    )
                    break
            }
            return marker
        }

        return () => (
            <div
                class={styled.container}
                style={{
                    marginRight: $tools.convert2rem($tools.distinguishSize(props?.marker?.gap || 8))
                }}>
                {props?.marker?.prefix ? <span innerHTML={props?.marker?.prefix}></span> : null}
                {renderMarker()}
                {props?.marker?.suffix ? <span innerHTML={props?.marker?.suffix}></span> : null}
            </div>
        )
    }
})

export default MiItemsTextMarker
