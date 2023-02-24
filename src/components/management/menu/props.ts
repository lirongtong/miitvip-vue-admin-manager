import { PropType } from 'vue'
import PropTypes, { CommonRequestProps } from '../../_utils/props-types'

export interface MenusDataItem {
    name: string | number
    id: string | number
    pid: string | number
    type: string | number
    path: string
    page: string
    title: string | number
    value: string | number
    cid?: string | number
    icon?: string | number
    weight?: number
    lang?: string | number
    children?: MenusDataItem[]
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
    updateMenu: {
        type: Object as PropType<CommonRequestProps>,
        default: () => {
            return {
                url: null,
                method: 'PUT',
                params: {},
                callback: null
            }
        }
    },
    deleteMenu: {
        type: Object as PropType<CommonRequestProps>,
        default: () => {
            return {
                url: null,
                method: 'DELETE',
                params: {},
                callback: null
            }
        }
    },
    paginationLocale: PropTypes.any
})
