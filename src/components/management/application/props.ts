import { PropType } from 'vue'
import PropTypes, { CommonRequestProps } from '../../_utils/props-types'

export const AppsManagementProps = () => ({
    prefixCls: PropTypes.string,
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
    createApp: {
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
    updateApp: {
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
    deleteApp: {
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
