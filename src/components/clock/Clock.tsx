import { defineComponent, reactive, onUnmounted, computed } from 'vue'
import { ClockProps } from './props'
import { $tools } from '../../utils/tools'
import { useWindowResize } from '../../hooks/useWindowResize'
import applyTheme from '../_utils/theme'
import styled from './style/clock.module.less'

const MiClock = defineComponent({
    name: 'MiClock',
    inheritAttrs: false,
    props: ClockProps(),
    setup(props) {
        const { width } = useWindowResize()
        const size = computed(() => {
            return $tools.distinguishSize(props.size, width.value)
        })
        const style = computed(() => {
            return {
                width: $tools.convert2rem(size.value),
                height: $tools.convert2rem(size.value)
            }
        })
        applyTheme(styled)

        const rotates = reactive({
            hour: '0deg',
            minute: '0deg',
            second: '0deg'
        }) as { [index: string]: string }
        let rid = 0

        const getPosition = (phase: number, offset = 10) => {
            const radius = Math.ceil(size.value / 2) - offset
            const theta = phase * 2 * Math.PI
            return {
                top: $tools.convert2rem(Math.round(-radius * Math.cos(theta) * 100) / 100),
                left: $tools.convert2rem(Math.round(radius * Math.sin(theta) * 100) / 100)
            }
        }

        const renderCalibrationAnchor = () => {
            const anchors: any[] = []
            for (let i = 1; i <= 60; i++) {
                let anchor: any = null
                if (i % 5 === 0) {
                    const point = getPosition(i / 60)
                    anchor = (
                        <div
                            class={styled.minsText}
                            style={{
                                left: point.left,
                                top: point.top
                            }}>
                            {i}
                        </div>
                    )
                } else {
                    anchor = (
                        <div class={styled.anchor} style={{ transform: `rotate(${i * 6}deg)` }}>
                            <div
                                class={styled.minsLine}
                                style={{
                                    transform: `translate(-50%, -100%) translateY(-${$tools.convert2rem(
                                        size.value / 2 - 10
                                    )})`
                                }}></div>
                        </div>
                    )
                }
                anchors.push(anchor)
            }
            return anchors
        }

        const renderCalibrationHour = () => {
            const hours: any[] = []
            for (let i = 1; i <= 12; i++) {
                const point = getPosition(i / 12, 36)
                hours.push(
                    <div
                        class={styled.hourText}
                        style={{
                            left: point.left,
                            top: point.top
                        }}>
                        {i}
                    </div>
                )
            }
            return hours
        }

        const runClock = () => {
            const now = new Date()
            const time =
                now.getHours() * 3600 +
                now.getMinutes() * 60 +
                now.getSeconds() * 1 +
                now.getMilliseconds() / 1000
            rotates.hour = `rotate(${(time / 120) % 360}deg)`
            rotates.minute = `rotate(${(time / 10) % 360}deg)`
            rotates.second = `rotate(${(time * 6) % 360}deg)`
            rid = $tools.raf(runClock)
        }
        runClock()

        onUnmounted(() => $tools.caf(rid))

        return () => (
            <div class={styled.container} style={style.value}>
                <div class={styled.calibration}>
                    {renderCalibrationAnchor()}
                    {renderCalibrationHour()}
                </div>
                <div class={styled.pointer}></div>
                <div class={styled.point} style={{ transform: rotates.hour }}>
                    <div class={styled.hand}></div>
                    <div
                        class={`${styled.hand} ${styled.handFat} ${styled.handHour}`}
                        style={{ height: $tools.convert2rem(size.value / 6) }}></div>
                </div>
                <div class={styled.point} style={{ transform: rotates.minute }}>
                    <div class={styled.hand}></div>
                    <div
                        class={`${styled.hand} ${styled.handFat} ${styled.handMinute}`}
                        style={{ height: $tools.convert2rem(size.value / 4) }}></div>
                </div>
                <div class={styled.point} style={{ transform: rotates.second }}>
                    <div
                        class={`${styled.hand} ${styled.handSecond}`}
                        style={{ height: $tools.convert2rem(size.value / 2) }}></div>
                </div>
                <div class={`${styled.pointer} ${styled.pointerMid}`}></div>
                <div class={`${styled.pointer} ${styled.pointerTop}`}></div>
            </div>
        )
    }
})

export default MiClock
