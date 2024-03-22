import { PropTypes, type DropdownItem } from '../../utils/types'
import { object } from 'vue-types'

/**
 * +========================+
 * |       Socialite        |
 * +========================+
 * @param tip 显示文案
 * @param domain 域名
 * @param showMore 更多下拉显示方式
 * @param items 下拉数据
 */
export interface SocialiteProperties {
    tip: string
    domain: string
    showMore: boolean
    items: Partial<DropdownItem>[]
}

export const SocialiteProps = () => ({
    tip: PropTypes.string,
    domain: PropTypes.string.def(undefined),
    showMore: PropTypes.bool.def(true),
    items: object<Partial<DropdownItem>[]>()
})
