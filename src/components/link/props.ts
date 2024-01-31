import { PropTypes } from '../../utils/types'

/**
 * +===================+
 * |       Link        |
 * +===================+
 * @param type 可额外识别 `email`
 * @param path 链接地址
 * @param query 参数配置
 * @param vertical 是否垂直
 */
export interface LinkProperties {
    type: string
    path: string
    query: object
    vertical: boolean
}
export const LinkProps = () => ({
    type: PropTypes.string,
    path: PropTypes.string,
    query: PropTypes.object.def({}),
    vertical: PropTypes.bool.def(false)
})
