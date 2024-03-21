import { Position, PropTypes } from './../../utils/types'
import { object } from 'vue-types'

/**
 * +======================+
 * |       锚点链接        |
 * +======================+
 * @param collectContainer 选择器 - 指定待收集的区域
 * @param selector 选择器 - 指定待收集的标签
 * @param requireAttr 收集的元素所要包含的指定属性 ( 比如必须包含 `id` 的元素 )
 * @param affix 固定悬浮
 * @param position 定位
 * @param scrollOffset 滚动定位偏移量
 * @param reserveOffset 预留偏移量
 * @param delayInit 延迟初始化 ( 避免渲染未完成, 节点获取失败 )
 * @param affixText 悬浮状态显示的文案
 */
export interface AnchorProperties {
    collectContainer: string
    selector: string | string[]
    requireAttr: string
    affix: boolean
    position: Position
    scrollOffset: number
    reserveOffset: number
    delayInit: number
    affixText: string
}

export const AnchorProps = () => ({
    collectContainer: PropTypes.string,
    selector: PropTypes.oneOfType([PropTypes.string, PropTypes.array]).def([
        'h1',
        'h2',
        'h3',
        'h4',
        'h5',
        'h6'
    ]),
    requireAttr: PropTypes.string,
    affix: PropTypes.bool,
    position: object<Position>().def({ top: 200 }),
    scrollOffset: PropTypes.number.def(80),
    reserveOffset: PropTypes.number,
    delayInit: PropTypes.number.def(400),
    affixText: PropTypes.string
})
