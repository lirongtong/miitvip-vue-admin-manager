import { defineComponent, reactive, onUnmounted } from 'vue'
import PropTypes from '../_utils/props-types'
import { getPrefixCls } from '../_utils/props-tools'
import { $tools } from '../../utils/tools'

export const clockProps = () => ({
    prefixCls: PropTypes.string,
    width: PropTypes.number.def(240)
})

export default defineComponent({
    name: 'MiClock',
    inheritAttrs: false,
    props: clockProps(),
    setup(props) {
        const prefixCls = getPrefixCls('clock', props.prefixCls)
        const width = props.width < 200 ? 200 : props.width
        const rotates = reactive({
            hour: '0deg',
            minute: '0deg',
            second: '0deg'
        })
        let rid = 0

        const getPosition = (phase: number, offset = 10) => {
            const radius = Math.ceil(width / 2) - offset
            const theta = phase * 2 * Math.PI
            return {
                top: $tools.px2Rem(Math.round(-radius * Math.cos(theta) * 100) / 100),
                left: $tools.px2Rem(Math.round(radius * Math.sin(theta) * 100) / 100)
            }
        }

        const getCalibrationAnchor = () => {
            const anchors = []
            for (let i = 1; i <= 60; i++) {
                let anchor = null
                if (i % 5 === 0) {
                    const point = getPosition(i / 60)
                    anchor = (
                        <div
                            class={`${prefixCls}-mins-text`}
                            style={{
                                left: `${point.left}rem`,
                                top: `${point.top}rem`
                            }}>
                            {i}
                        </div>
                    )
                } else {
                    anchor = (
                        <div
                            class={`${prefixCls}-anchor`}
                            style={{ transform: `rotate(${i * 6}deg)` }}>
                            <div
                                class={`${prefixCls}-mins-line`}
                                style={{
                                    transform: `translate(-50%, -100%) translateY(-${$tools.px2Rem(
                                        width / 2 - 10
                                    )}rem)`
                                }}></div>
                        </div>
                    )
                }
                anchors.push(anchor)
            }
            return anchors
        }

        const getCalibrationHour = () => {
            const hours = []
            for (let i = 1; i <= 12; i++) {
                const point = getPosition(i / 12, 36)
                hours.push(
                    <div
                        class={`${prefixCls}-hour-text`}
                        style={{
                            left: `${point.left}rem`,
                            top: `${point.top}rem`
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

        onUnmounted(() => {
            if (rid) $tools.caf(rid)
        })

        return () => (
            <div
                class={prefixCls}
                style={{
                    width: `${$tools.px2Rem(width)}rem`,
                    height: `${$tools.px2Rem(width)}rem`
                }}>
                <div class={`${prefixCls}-calibration`}>
                    {getCalibrationAnchor()}
                    {getCalibrationHour()}
                </div>
                <div class={`${prefixCls}-pointer`}></div>
                <div
                    class={`${prefixCls}-point ${prefixCls}-point-hour`}
                    style={{
                        transform: rotates.hour
                    }}>
                    <div class={`${prefixCls}-hand`}></div>
                    <div
                        class={`${prefixCls}-hand ${prefixCls}-hand-fat`}
                        style={{
                            height: `${$tools.px2Rem(width / 6)}rem`
                        }}></div>
                </div>
                <div
                    class={`${prefixCls}-point ${prefixCls}-point-minute`}
                    style={{
                        transform: rotates.minute
                    }}>
                    <div class={`${prefixCls}-hand`}></div>
                    <div
                        class={`${prefixCls}-hand ${prefixCls}-hand-fat`}
                        style={{
                            height: `${$tools.px2Rem(width / 4)}rem`
                        }}></div>
                </div>
                <div
                    class={`${prefixCls}-point ${prefixCls}-point-second`}
                    style={{
                        transform: rotates.second
                    }}>
                    <div
                        class={`${prefixCls}-hand ${prefixCls}-hand-second`}
                        style={{
                            height: `${$tools.px2Rem(width / 2)}rem`
                        }}></div>
                </div>
                <div class={`${prefixCls}-pointer ${prefixCls}-pointer-mid`}></div>
                <div class={`${prefixCls}-pointer ${prefixCls}-pointer-top`}></div>
            </div>
        )
    }
})
