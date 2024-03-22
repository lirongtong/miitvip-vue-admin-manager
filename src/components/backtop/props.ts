import { VNodeTypes } from 'vue'
import { PropTypes } from '../../utils/types'
import type { DeviceSize, Position } from '../../utils/types'
import { object } from 'vue-types'

/**
 * +======================+
 * |       回到顶部        |
 * +======================+
 * @param width 宽度
 * @param height 高度
 * @param radius 圆角弧度
 * @param offset 触发偏移量
 * @param duration 滚动时长
 * @param zIndex 层级
 * @param tip 提示语
 * @param position 定位
 * @param icon 图标
 * @param listenerContainer scroll 监听容器
 */
export interface BacktopProperties {
    width: number | string | DeviceSize
    height: number | string | DeviceSize
    radius: number | string | DeviceSize
    offset: number
    duration: number
    zIndex: number
    tip: string
    position: Position
    icon: VNodeTypes
    listenerContainer: HTMLElement
}

export const BacktopProps = () => ({
    width: PropTypes.oneOfType([PropTypes.string, PropTypes.number, object<DeviceSize>()]).def(48),
    height: PropTypes.oneOfType([PropTypes.string, PropTypes.number, object<DeviceSize>()]).def(48),
    radius: PropTypes.oneOfType([PropTypes.string, PropTypes.number, object<DeviceSize>()]).def(48),
    offset: PropTypes.number.def(200),
    duration: PropTypes.number.def(1000),
    zIndex: PropTypes.number.def(Date.now()),
    tip: PropTypes.string,
    position: object<Position>().def({ bottom: 40, right: 40 }),
    icon: PropTypes.any,
    listenerContainer: PropTypes.oneOfType([HTMLElement])
})
