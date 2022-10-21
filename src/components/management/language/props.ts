import { PropType } from 'vue'
import PropTypes, { CommonRequestProps } from '../../_utils/props-types'

export interface LanguageFormState {
    id?: string | number
    cid?: string | number
    key: string
    language: string
    is_default?: number
    type?: string
}

export interface TranslateForm {
    url: string
    appid: string | number
    key: string | number
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
    defaultCategory: {
        type: Object as PropType<CommonRequestProps>,
        required: true,
        default: () => {
            return {
                url: null,
                method: 'PUT',
                params: {},
                callback: null
            }
        }
    },
    checkCategoryExist: {
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
    batchCreateLanguage: {
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
    checkLanguageExist: {
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
    translate: {
        type: Object as PropType<TranslateForm>,
        default: () => {
            return {
                url: '',
                appid: '',
                key: ''
            }
        }
    },
    paginationLocale: PropTypes.any
})
