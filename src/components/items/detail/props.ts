import { PropTypes } from '../../../utils/types'

/**
 * +====================================+
 * |       ItemsDetailProperties        |
 * +====================================+
 * @param fullScreen 展开的详情是否铺满全屏显示 ( 首选配置 )
 * @param fullBlock 展开的详情是否铺满父级容器 ( 与 fullScreen 互斥 )
 */
export interface ItemsDetailProperties {
    fullScreen?: boolean
    fullBlock?: boolean
}

export const ItemsDetailProps = () => ({
    fullScreen: PropTypes.bool.def(false),
    fullBlock: PropTypes.bool.def(true)
})
