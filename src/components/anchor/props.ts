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
 * @param duration 滚动动画时长
 * @param listenerContainer scroll 监听容器
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
    duration: number
    listenerContainer: HTMLElement
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
    affix: PropTypes.bool.def(false),
    position: object<Position>().def({ top: 200 }),
    scrollOffset: PropTypes.number.def(80),
    reserveOffset: PropTypes.number,
    delayInit: PropTypes.number.def(800),
    affixText: PropTypes.string,
    duration: PropTypes.number.def(1000),
    listenerContainer: PropTypes.oneOfType([HTMLElement])
})

/**
 * +==========================+
 * |       Anchor Link        |
 * +==========================+
 * @param id 唯一值
 * @param title 标题
 * @param active 是否选中
 */
export interface AnchorLinkProperties {
    id: string
    title: string
    active: boolean
}

export const AnchorLinkProps = () => ({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    active: PropTypes.bool.def(false)
})
