import { array, object } from 'vue-types'
import { PropTypes } from '../../../utils/types'

/**
 * +=========================+
 * |       百度翻译属性       |
 * +=========================+
 * @param url 翻译接口地址
 * @param key 翻译接口 key 值
 * @param appid 翻译接口 appid
 */
export interface BaiduTranslateProperties {
    url: string
    key: string | number
    appid: string | number
}

/**
 * +======================+
 * |       翻译属性       |
 * +======================+
 * @param baidu 百度翻译配置
 * @param languages 翻译语言列表
 */
export interface TranslateProperties {
    baidu: Partial<BaiduTranslateProperties>
    languages: Record<string, string>
    defaultLanguage: string
}

/**
 * +=======================+
 * |       语言项属性       |
 * +=======================+
 * @param id 语言项 id
 * @param cid 语言项 cid
 * @param key 语言项 key
 * @param language 语言
 * @param is_default 是否默认
 * @param type 语言类型
 */
export interface LanguageItemProperties {
    id: string | number
    cid: string | number
    key: string
    language: string
    is_default: number
    type: string
}

/**
 * +=========================+
 * |       语言配置属性       |
 * +=========================+
 * @param translate 翻译配置
 * @param data 语言项数据
 * @param category 语言分类数据
 * @param getCategoryAction 获取语言分类接口地址或自定义方法
 * @param getCategoryMethod 获取语言分类接口的请求方式 ( string 时有效 )
 * @param getCategoryParams 获取语言分类接口参数
 * @param createCategoryAction 创建语言分类接口地址或自定义方法
 * @param createCategoryMethod 创建语言分类接口的请求方式 ( string 时有效 )
 * @param createCategoryParams 创建语言分类接口参数
 * @param updateCategoryAction 更新语言分类接口地址或自定义方法
 * @param updateCategoryMethod 更新语言分类接口的请求方式 ( string 时有效 )
 * @param updateCategoryParams 更新语言分类接口参数
 * @param deleteCategoryAction 删除语言分类接口地址或自定义方法
 * @param deleteCategoryMethod 删除语言分类接口的请求方式 ( string 时有效 )
 * @param deleteCategoryParams 删除语言分类接口参数
 * @param setDefaultCategoryAction 设置默认语言分类接口地址或自定义方法
 * @param setDefaultCategoryMethod 设置默认语言分类接口的请求方式 ( string 时有效 )
 * @param setDefaultCategoryParams 设置默认语言分类接口参数
 * @param checkCategoryExistAction 检测语言分类是否存在接口地址或自定义方法
 * @param checkCategoryExistMethod 检测语言分类是否存在接口的请求方式 ( string 时有效 )
 * @param checkCategoryExistParams 检测语言分类是否存在接口参数
 * @param createAction 创建语言项接口地址或自定义方法
 * @param createMethod 创建语言项接口的请求方式 ( string 时有效 )
 * @param createParams 创建语言项接口参数
 * @param batchCreateAction 批量创建语言项接口地址或自定义方法
 * @param batchCreateMethod 批量创建语言项接口的请求方式 ( string 时有效 )
 * @param batchCreateParams 批量创建语言项接口参数
 * @param updateAction 更新语言项接口地址或自定义方法
 * @param updateMethod 更新语言项接口的请求方式 ( string 时有效 )
 * @param updateParams 更新语言项接口参数
 * @param deleteAction 删除语言项接口地址或自定义方法
 * @param deleteMethod 删除语言项接口的请求方式 ( string 时有效 )
 * @param deleteParams 删除语言项接口参数
 * @param searchAction 搜索语言项接口地址或自定义方法
 * @param searchMethod 搜索语言项接口的请求方式 ( string 时有效 )
 * @param searchParams 搜索语言项接口参数
 * @param getLanguageAction 获取语言项接口地址或自定义方法
 * @param getLanguageMethod 获取语言项接口的请求方式 ( string 时有效 )
 * @param getLanguageParams 获取语言项接口参数
 * @param checkLanguageExistAction 检测语言项是否存在接口地址或自定义方法
 * @param checkLanguageExistMethod 检测语言项是否存在接口的请求方式 ( string 时有效 )
 * @param checkLanguageExistParams 检测语言项是否存在接口参数
 * @param paginationLocale 分页组件语言包
 */
export interface LanguageProperties {
    translate: Partial<{
        baidu?: BaiduTranslateProperties
        languages?: Record<string, string>[]
    }>
    data: Partial<LanguageItemProperties>[]
    category: Partial<LanguageItemProperties>[]
    getCategoryAction: string | Function
    getCategoryMethod: string
    getCategoryParams: Record<any, any>
    createCategoryAction: string | Function
    createCategoryMethod: string
    createCategoryParams: Record<any, any>
    updateCategoryAction: string | Function
    updateCategoryMethod: string
    updateCategoryParams: Record<any, any>
    deleteCategoryAction: string | Function
    deleteCategoryMethod: string
    deleteCategoryParams: Record<any, any>
    setDefaultCategoryAction: string | Function
    setDefaultCategoryMethod: string
    setDefaultCategoryParams: Record<any, any>
    checkCategoryExistAction: string | Function
    checkCategoryExistMethod: string
    checkCategoryExistParams: Record<any, any>
    createAction: string | Function
    createMethod: string
    createParams: Record<any, any>
    batchCreateAction: string | Function
    batchCreateMethod: string
    batchCreateParams: Record<any, any>
    updateAction: string | Function
    updateMethod: string
    updateParams: Record<any, any>
    deleteAction: string | Function
    deleteMethod: string
    deleteParams: Record<any, any>
    searchAction: string | Function
    searchMethod: string
    searchParams: Record<any, any>
    getLanguageAction: string | Function
    getLanguageMethod: string
    getLanguageParams: Record<any, any>
    checkLanguageExistAction: string | Function
    checkLanguageExistMethod: string
    checkLanguageExistParams: Record<any, any>
    paginationLocale: any
}

export const LanguageProps = () => ({
    translate: object<Partial<TranslateProperties>>(),
    data: array<LanguageItemProperties>().def([]),
    category: array<LanguageItemProperties>().def([]),
    getCategoryAction: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
    getCategoryMethod: PropTypes.string.def('get'),
    getCategoryParams: PropTypes.object.def({}),
    createCategoryAction: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
    createCategoryMethod: PropTypes.string.def('post'),
    createCategoryParams: PropTypes.object.def({}),
    updateCategoryAction: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
    updateCategoryMethod: PropTypes.string.def('put'),
    updateCategoryParams: PropTypes.object.def({}),
    deleteCategoryAction: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
    deleteCategoryMethod: PropTypes.string.def('delete'),
    deleteCategoryParams: PropTypes.object.def({}),
    setDefaultCategoryAction: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
    setDefaultCategoryMethod: PropTypes.string.def('put'),
    setDefaultCategoryParams: PropTypes.object.def({}),
    checkCategoryExistAction: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
    checkCategoryExistMethod: PropTypes.string.def('get'),
    checkCategoryExistParams: PropTypes.object.def({}),
    createAction: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
    createMethod: PropTypes.string.def('post'),
    createParams: PropTypes.object.def({}),
    batchCreateAction: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
    batchCreateMethod: PropTypes.string.def('post'),
    batchCreateParams: PropTypes.object.def({}),
    updateAction: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
    updateMethod: PropTypes.string.def('put'),
    updateParams: PropTypes.object.def({}),
    deleteAction: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
    deleteMethod: PropTypes.string.def('delete'),
    deleteParams: PropTypes.object.def({}),
    searchAction: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
    searchMethod: PropTypes.string.def('get'),
    searchParams: PropTypes.object.def({}),
    getLanguageAction: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
    getLanguageMethod: PropTypes.string.def('get'),
    getLanguageParams: PropTypes.object.def({}),
    checkLanguageExistAction: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
    checkLanguageExistMethod: PropTypes.string.def('get'),
    checkLanguageExistParams: PropTypes.object.def({}),
    paginationLocale: PropTypes.any
})
