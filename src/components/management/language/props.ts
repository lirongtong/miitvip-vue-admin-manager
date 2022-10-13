import { PropType } from 'vue'
import PropTypes from '../../_utils/props-types'

export interface LanguageFormState {
    id?: string | number
    key: string
    language: string
}

export interface CommonRequestProps {
    url?: String
    method?: String
    params?: Object
    callback?: Function
}

export const languageProps = () => ({
    prefixCls: PropTypes.string,
    dataSource: Array as PropType<LanguageFormState[]>,
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
    categorySource: Array as PropType<LanguageFormState[]>,
    category: {
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
    createCategory: {
        type: Object as PropType<CommonRequestProps>,
        required: true,
        default: () => {
            return {
                url: null,
                method: 'POST',
                params: {},
                callback: null
            }
        }
    },
    updateCategory: {
        type: Object as PropType<CommonRequestProps>,
        required: true,
        default: () => {
            return {
                url: null,
                method: 'POST',
                params: {},
                callback: null
            }
        }
    },
    deleteCategory: {
        type: Object as PropType<CommonRequestProps>,
        required: true,
        default: () => {
            return {
                url: null,
                method: 'DELETE',
                params: {},
                callback: null
            }
        }
    },
    createLanguage: {
        type: Object as PropType<CommonRequestProps>,
        required: true,
        default: () => {
            return {
                url: null,
                method: 'POST',
                params: {},
                callback: null
            }
        }
    },
    updateLanguage: {
        type: Object as PropType<CommonRequestProps>,
        required: true,
        default: () => {
            return {
                url: null,
                method: 'DELETE',
                params: {},
                callback: null
            }
        }
    },
    deleteLanguage: {
        type: Object as PropType<CommonRequestProps>,
        required: true,
        default: () => {
            return {
                url: null,
                method: 'DELETE',
                params: {},
                callback: null
            }
        }
    },
    searchLanguage: {
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
    checkLanguageKeyExist: {
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
