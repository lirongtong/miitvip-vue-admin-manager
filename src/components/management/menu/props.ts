import { PropType } from 'vue'
import PropTypes, { CommonRequestProps } from '../../_utils/props-types'

export interface MenusDataItem {
    id: string | number
    pid: string | number
    type: string | number
    path: string
    page: string
    cid?: string | number
    icon?: string | number
    weight?: number
    lang?: string | number
}

export interface MenusTreeData {
    title: string
    value: string | number
    children?: any[]
}

export const menuManagementProps = () => ({
    prefixCls: PropTypes.string,
    dataSource: Array as PropType<MenusDataItem[]>,
    data: {
        type: Object as PropType<CommonRequestProps>,
        default: () => {
            return {
                url: null,
                method: 'GET',
                params: {},
                callback: null
            }
        }
    },
    addMenu: {
        type: Object as PropType<CommonRequestProps>,
        default: () => {
            return {
                url: null,
                method: 'POST',
                params: {},
                callback: null
            }
        }
    },
    paginationLocale: PropTypes.any
})
