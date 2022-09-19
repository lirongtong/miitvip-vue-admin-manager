import { PropType } from 'vue'
import PropTypes from '../../_utils/props-types'

export interface CommonApiProps {
    url?: string
    method?: string
    params?: object
}

export const languageProps = () => ({
    prefixCls: PropTypes.string,
    listConfig: {
        type: Object as PropType<CommonApiProps>,
        default: () => {
            return {
                url: null,
                method: 'GET',
                params: {}
            }
        }
    },
    categoryconfig: {
        type: Object as PropType<CommonApiProps>,
        default: () => {
            return {
                url: null,
                method: 'GET',
                params: {}
            }
        }
    },
    addConfig: {
        type: Object as PropType<CommonApiProps>,
        default: () => {
            return {
                url: null,
                method: 'POST',
                params: {}
            }
        }
    },
    paginationLocale: PropTypes.any
})
