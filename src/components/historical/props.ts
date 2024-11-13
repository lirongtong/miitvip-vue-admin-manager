import { PropTypes } from '../../utils/types'

/**
 * +======================+
 * |       Routing        |
 * +======================+
 * @param name 名称
 * @param title 标题
 * @param path 路由
 */
export interface Routing {
    name: string
    title: string
    path: string
}

/**
 * +==========================================+
 * |       HistoricalRoutingProperties        |
 * +==========================================+
 * @param animationName 动画名称
 * @param animationDuration 动画时长
 */
export interface HistoricalRoutingProperties {
    animationName: string
    animationDuration: number
}

export const HistoricalRoutingProps = () => ({
    animationName: PropTypes.string.def('false'),
    animationDuration: PropTypes.number.def(400)
})
