import { defineComponent, reactive, ref, inject, getCurrentInstance } from 'vue'
import { useI18n } from 'vue-i18n'
import { getPrefixCls } from '../../../components/_utils/props-tools'
import { languageProps, LanguageFormState } from './props'
import md5 from 'md5'
import {
    Table,
    Input,
    Form,
    FormItem,
    Textarea,
    ConfigProvider,
    Select,
    SelectOption,
    Button,
    Popconfirm,
    message,
    FormInstance,
    Row,
    Col,
    Empty,
    RadioGroup,
    Tooltip
} from 'ant-design-vue'
import {
    FormOutlined,
    DeleteOutlined,
    EditOutlined,
    CloseCircleFilled,
    PlusOutlined,
    GlobalOutlined,
    SearchOutlined,
    ReloadOutlined,
    InfoCircleOutlined,
    CheckOutlined
} from '@ant-design/icons-vue'
import { $g } from '../../../utils/global'
import { $tools } from '../../../utils/tools'
import MiModal from '../../modal'
import { $request } from '../../../utils/request'
import { Rule } from 'ant-design-vue/es/form'

export declare type Key = string | number

export default defineComponent({
    name: 'MiLanguageManagement',
    inheritAttrs: false,
    props: languageProps(),
    setup(props) {
        const instance = getCurrentInstance()
        const { messages, locale, t } = useI18n()
        const i18n = inject('$i18n') as any
        let languages = reactive<LanguageFormState[]>([])
        let total = 0
        let builtInLanguages = reactive<LanguageFormState[]>([])
        const btnCls = `${$g.prefix}btn`
        const formCls = `${$g.prefix}form`
        const searchCls = `${$g.prefix}list-search`
        const prefixCls = getPrefixCls('language', props.prefixCls)
        const formRef = ref<FormInstance>()
        const addOrUpdateFormRef = ref<FormInstance>()
        let batchDeleteIds = reactive<any[]>([])

        const checkCateogryKeyValidate = async (_rule: Rule, value: string) => {
            if (!value) return Promise.reject(t('language.error.key.empty'))
            if (props.checkCategoryExist?.url) {
                const res: any = await $request[
                    (props.checkCategoryExist?.method || 'GET').toLocaleLowerCase()
                ](
                    props.checkCategoryExist.url,
                    Object.assign(
                        {},
                        {
                            id: params.id,
                            key: params.form.validate.key,
                            edit: params.isEdit ? 1 : 0
                        },
                        { ...props.checkCategoryExist.params }
                    )
                )
                if (res) {
                    if (res?.ret?.code === 200) return Promise.resolve()
                    else return Promise.reject(res?.ret?.message)
                } else return Promise.reject(t('language.error.key.error'))
            } else return Promise.resolve()
        }

        const checkLanguageKeyValidate = async (_rule: Rule, value: string) => {
            if (!value) return Promise.reject(t('language.placeholder.config.key'))
            if (props.checkLanguageExist?.url) {
                const res: any = await $request[
                    (props.checkLanguageExist?.method || 'GET').toLocaleLowerCase()
                ](
                    props.checkLanguageExist.url,
                    Object.assign(
                        {},
                        {
                            lang: params.current,
                            id: params.id,
                            key: params.addOrUpdateForm.validate.key,
                            edit: params.isEdit ? 1 : 0
                        },
                        { ...props.checkLanguageExist.params }
                    )
                )
                if (res) {
                    if (res?.ret?.code === 200) return Promise.resolve()
                    else return Promise.reject(res?.ret?.message)
                } else return Promise.reject(t('language.error.key.error'))
            } else return Promise.resolve()
        }

        const params = reactive({
            loading: false,
            pagination: {
                page: 1,
                size: 10
            },
            tab: 'customize',
            table: {
                loading: false,
                columns: [
                    {
                        title: t('key'),
                        key: 'key',
                        dataIndex: 'key',
                        align: 'left',
                        width: 320
                    },
                    {
                        key: 'language',
                        dataIndex: 'language',
                        align: 'left',
                        width: 520
                    },
                    {
                        title: t('opt'),
                        key: 'action',
                        align: 'right',
                        width: 180,
                        fixed: 'right',
                        customRender: (record: any) => {
                            return (
                                <div class={`${$g.prefix}table-btns`}>
                                    <a
                                        class="edit"
                                        onClick={() => updateLanguageConfigurationVisible(record)}>
                                        <FormOutlined />
                                        {t('edit')}
                                    </a>
                                    <span></span>
                                    <a class="delete">
                                        <Popconfirm
                                            title={t('delete-confirm')}
                                            style={{ zIndex: Date.now() }}
                                            okText={t('ok')}
                                            cancelText={t('cancel')}
                                            okButtonProps={{
                                                onClick: () => deleteLanguageConfiguration(record)
                                            }}
                                            key={record.record.key}>
                                            <DeleteOutlined />
                                            {t('delete')}
                                        </Popconfirm>
                                    </a>
                                </div>
                            )
                        }
                    }
                ] as any,
                data: [] as LanguageFormState[],
                builtin: {
                    columns: [
                        {
                            title: t('key'),
                            key: 'key',
                            dataIndex: 'key',
                            align: 'left',
                            width: 320
                        },
                        {
                            key: 'language',
                            dataIndex: 'language',
                            align: 'left',
                            width: 520
                        }
                    ] as any
                }
            },
            visible: {
                update: false,
                management: false,
                create: false
            },
            current: $g.locale,
            currentId: 0,
            categories: [] as LanguageFormState[],
            categoriyIds: {} as any,
            builtInCategories: [
                { key: 'zh-cn', language: t('language.zh-cn') },
                { key: 'en-us', language: t('language.en-us') }
            ] as LanguageFormState[],
            builtInCurrent: $g.locale,
            types: {} as any,
            id: 0,
            isEdit: false,
            form: {
                validate: {
                    key: '',
                    language: '',
                    is_default: 0
                },
                rules: {
                    key: [
                        {
                            required: true,
                            validator: checkCateogryKeyValidate,
                            trigger: 'blur'
                        }
                    ],
                    language: [{ required: true, message: t('language.error.language') }],
                    is_default: [{ required: true, message: t('language.error.is-default') }]
                } as any,
                editTempKey: '',
                defaultOptions: [
                    { label: t('yes'), value: 1 },
                    { label: t('no'), value: 0 }
                ]
            },
            addOrUpdateForm: {
                editTempKey: '',
                validate: {
                    key: '',
                    language: ''
                },
                rules: {
                    key: [
                        {
                            required: true,
                            validator: checkLanguageKeyValidate,
                            trigger: 'blur'
                        }
                    ],
                    language: [{ required: true, message: t('language.placeholder.config.value') }]
                } as any
            },
            search: {
                lang: 'zh-cn',
                key: ''
            },
            translate: {
                languages: {
                    zh: t('language.list.zh'),
                    en: t('language.list.en'),
                    jp: t('language.list.jp'),
                    kor: t('language.list.kor'),
                    fra: t('language.list.fra'),
                    spa: t('language.list.spa'),
                    th: t('language.list.th'),
                    ara: t('language.list.ara'),
                    ru: t('language.list.ru'),
                    pt: t('language.list.pt'),
                    de: t('language.list.de'),
                    it: t('language.list.it'),
                    el: t('language.list.el'),
                    nl: t('language.list.nl'),
                    pl: t('language.list.pl'),
                    bul: t('language.list.bul'),
                    est: t('language.list.est'),
                    dan: t('language.list.dan'),
                    fin: t('language.list.fin'),
                    cs: t('language.list.cs'),
                    rom: t('language.list.rom'),
                    slo: t('language.list.slo'),
                    swe: t('language.list.swe'),
                    hu: t('language.list.hu'),
                    cht: t('language.list.cht'),
                    vie: t('language.list.vie')
                },
                form: {
                    translate: 1,
                    target: 'zh'
                }
            }
        })

        const initLanguageConfiguration = async () => {
            setLanguageConfigurationList()
            setLanguageCategory()
        }

        const setLanguageConfigurationList = async (keyword?: string, lang?: string) => {
            languages = []
            if (props.dataSource) {
                params.table.data = props.dataSource
            } else {
                await getLanguageConfiguration(keyword, lang)
                params.table.data = languages
            }
        }

        const setLanguageCategory = () => {
            if (props.categorySource) params.categories = props.categorySource
            else getLanguageCategory()
        }

        // language
        const getLanguageConfiguration = async (keyword?: string, lang?: string) => {
            if (props.data.url) {
                if (params.table.loading) return
                params.table.loading = true
                const condition = Object.assign(
                    { keyword },
                    params.pagination,
                    { lang },
                    props.data.params || {}
                )
                await $request[(props.data.method || 'GET').toLowerCase()](
                    props.data.url,
                    condition
                )
                    .then((res: any) => {
                        params.table.loading = false
                        if (res) {
                            if (res?.ret?.code === 200) {
                                languages = res?.data
                                total = res?.total
                                if (props.data.callback) props.data.callback(res?.data)
                            } else message.error(res?.ret?.message)
                        }
                    })
                    .catch((err: any) => {
                        params.table.loading = false
                        message.error(err.message)
                    })
            }
        }

        // built-in languages.
        const getBuiltInLanguageConfiguration = (data: any, idx?: string) => {
            for (const i in data) {
                const type = typeof data[i]
                const key = (!$tools.isEmpty(idx) ? idx + '.' : '') + i
                if (['object', 'array'].includes(type))
                    getBuiltInLanguageConfiguration(data[i], key)
                else {
                    const item = {
                        key,
                        language: data[i],
                        type: 'system'
                    } as LanguageFormState
                    if (data.id) item.id = data.id
                    builtInLanguages.push(item)
                }
            }
        }

        // category is changed.
        const changLanguageCategory = (lang: any) => {
            languages = [] as LanguageFormState[]
            params.current = lang
            setLanguageConfigurationList('', lang)
            params.table.data = languages
        }

        const changBuiltInLanguageCategory = (lang: any) => {
            builtInLanguages = []
            params.builtInCurrent = lang
            if (params.search.key) {
                search()
            } else {
                getBuiltInLanguageConfiguration((messages as any).value[lang] || {})
                instance?.proxy?.$forceUpdate()
            }
        }

        // modal - create category
        const createLanguageCategoryVisible = () => {
            params.isEdit = false
            params.id = 0
            params.visible.management = !params.visible.management
            params.visible.create = !params.visible.create
        }

        // modal - update category
        const updateLanguageCategoryVisible = (data?: any) => {
            params.visible.management = !params.visible.management
            params.visible.create = !params.visible.create
            params.isEdit = true
            if (data?.id) {
                params.id = data?.id
                params.form.validate = {
                    key: data?.key,
                    language: data?.language,
                    is_default: data?.is_default
                }
            } else params.form.validate = { key: '', language: '', is_default: 0 }
        }

        // cancel modal - category
        const cancelLanguageCategoryVisible = () => {
            params.visible.management = true
            params.visible.create = false
            params.isEdit = false
            params.id = 0
            params.form.validate = { key: '', language: '', is_default: 0 }
            if (formRef.value) formRef.value.clearValidate()
        }

        // category
        const getLanguageCategory = () => {
            if (props.category.url) {
                if (params.loading) return
                params.loading = true
                $request[(props.category.method || 'GET').toLowerCase()](
                    props.category.url,
                    props.category.params || {}
                )
                    .then((res: any) => {
                        params.loading = false
                        if (res) {
                            if (res?.ret?.code === 200) {
                                params.categories = res?.data
                                for (let i = 0, l = res?.data.length; i < l; i++) {
                                    const cur = res?.data[i]
                                    params.types[cur?.key] = cur?.language
                                    params.categoriyIds[cur?.key] = cur?.id
                                    if (cur?.is_default) params.currentId = cur?.id
                                }
                                if (props.category.callback) props.category.callback(res?.data)
                            } else message.error(res?.ret?.message)
                        }
                    })
                    .catch((err: any) => {
                        params.loading = false
                        message.error(err.message)
                    })
            }
        }

        const setDefaultCategory = () => {
            if (params.categories.length <= 0) {
                message.error(t('language.error.no-data'))
                return
            }
            if (params.currentId === params.categoriyIds[params.current]) {
                message.success(t('language.error.default'))
                return
            }
            if (params.loading) return
            params.loading = true
            if (props.defaultCategory.url) {
                $request[(props.defaultCategory.method || 'DELETE').toLowerCase()](
                    $tools.replaceUrlParams(props.defaultCategory.url, {
                        id: params.categoriyIds[params.current]
                    }),
                    props.defaultCategory.params || {}
                )
                    .then((res: any) => {
                        params.loading = false
                        if (res) {
                            if (res?.ret?.code === 200) {
                                message.success(t('success'))
                                getLanguageCategory()
                            } else message.error(res?.ret?.message)
                        }
                    })
                    .catch((err: any) => {
                        params.loading = false
                        message.error(err.message)
                    })
            }
        }

        // action - create or update category.
        const createOrUpdateLanguageCategory = () => {
            if (formRef.value) {
                if (params.loading) return
                params.loading = true
                formRef.value
                    .validate()
                    .then(() => {
                        if (params.isEdit) {
                            // update
                            if (props.updateCategory.url) {
                                $request[(props.updateCategory.method || 'PUT').toLowerCase()](
                                    $tools.replaceUrlParams(props.updateCategory.url, {
                                        id: params.id
                                    }),
                                    Object.assign(
                                        {},
                                        { ...params.form.validate },
                                        { ...props.updateCategory.params }
                                    )
                                )
                                    .then((res: any) => {
                                        params.loading = false
                                        if (res) {
                                            if (res?.ret?.code === 200) {
                                                params.isEdit = false
                                                cancelLanguageCategoryVisible()
                                                getLanguageCategory()
                                                if (props.updateCategory.callback)
                                                    props.updateCategory.callback()
                                                message.success(t('success'))
                                            } else message.error(res?.ret?.message)
                                        }
                                    })
                                    .catch((err: any) => {
                                        params.loading = false
                                        message.error(err.message)
                                    })
                            }
                        } else {
                            // create
                            if (props.createCategory.url) {
                                const query = Object.assign({}, props.createCategory.params || {}, {
                                    ...params.form.validate
                                })
                                $request[(props.createCategory.method || 'POST').toLowerCase()](
                                    props.createCategory.url,
                                    query
                                )
                                    .then((res: any) => {
                                        params.loading = false
                                        if (res) {
                                            if (res?.ret?.code === 200) {
                                                message.success(t('success'))
                                                cancelLanguageCategoryVisible()
                                                getLanguageCategory()
                                                if (params.translate.form.translate)
                                                    automaticTranslate(res?.data)
                                                if (formRef.value) formRef.value.resetFields()
                                                if (props.createCategory.callback)
                                                    props.createCategory.callback()
                                            } else message.error(res?.ret?.message)
                                        }
                                    })
                                    .catch((err: any) => {
                                        params.loading = false
                                        message.error(err.message)
                                    })
                            }
                        }
                    })
                    .catch(() => (params.loading = false))
            }
        }

        // action - delete category.
        const deleteLanguageCategory = (id: string | number) => {
            if (params.loading) return
            params.loading = true
            if (props.deleteCategory.url) {
                $request[(props.deleteCategory.method || 'DELETE').toLowerCase()](
                    $tools.replaceUrlParams(props.deleteCategory.url, {
                        id
                    }),
                    props.deleteCategory.params || {}
                )
                    .then((res: any) => {
                        params.loading = false
                        if (res) {
                            if (res?.ret?.code === 200) {
                                message.success(t('success'))
                                getLanguageCategory()
                            } else message.error(res?.ret?.message)
                        }
                    })
                    .catch((err: any) => {
                        params.loading = false
                        message.error(err.message)
                    })
            }
        }

        // modal - language - create.
        const createLanguageConfigurationVisible = () => {
            params.isEdit = false
            params.id = 0
            params.addOrUpdateForm.validate = {
                key: '',
                language: ''
            }
            params.visible.update = !params.visible.update
        }

        // modal - language - update.
        const updateLanguageConfigurationVisible = (data?: any) => {
            params.isEdit = true
            params.visible.update = !params.visible.update
            if (data?.record) {
                params.id = data.record?.id
                params.addOrUpdateForm.validate = JSON.parse(JSON.stringify(data.record))
                params.addOrUpdateForm.editTempKey = data?.record?.key
            } else params.addOrUpdateForm.validate = { key: '', language: '' }
        }

        const cancelLanguageConfigurationVisible = () => {
            params.visible.update = false
            params.isEdit = false
            params.id = 0
            params.addOrUpdateForm.validate = { key: '', language: '' }
            if (addOrUpdateFormRef.value) addOrUpdateFormRef.value.clearValidate()
        }

        const createOrUpdateLanguageConfiguration = () => {
            if (addOrUpdateFormRef.value) {
                if (params.loading) return
                params.loading = true
                addOrUpdateFormRef.value
                    .validate()
                    .then(() => {
                        const newOne = {}
                        newOne[params.addOrUpdateForm.validate.key] =
                            params.addOrUpdateForm.validate.language
                        const afterAction = () => {
                            message.success(t('success'))
                            setLanguageConfigurationList('', params.current)
                            updateSystemLocaleData(newOne)
                        }
                        if (params.isEdit) {
                            // update
                            if (!params.id) {
                                message.error(t('no-id'))
                                return
                            }
                            if (props.updateLanguage.url) {
                                $request[(props.updateLanguage.method || 'PUT').toLowerCase()](
                                    $tools.replaceUrlParams(props.updateLanguage.url, {
                                        id: params.id
                                    }),
                                    Object.assign(
                                        {},
                                        { ...params.addOrUpdateForm.validate },
                                        { ...props.updateLanguage.params }
                                    )
                                )
                                    .then((res: any) => {
                                        params.loading = false
                                        if (res) {
                                            if (res?.ret?.code === 200) {
                                                params.isEdit = false
                                                params.id = 0
                                                params.visible.update = !params.visible.update
                                                afterAction()
                                                if (props.updateLanguage.callback)
                                                    props.updateLanguage.callback()
                                            } else message.error(res?.ret?.message)
                                        }
                                    })
                                    .catch((err: any) => {
                                        params.loading = false
                                        message.error(err.message)
                                    })
                            }
                        } else {
                            // add
                            if (props.createLanguage.url) {
                                $request[(props.createLanguage.method || 'POST').toLowerCase()](
                                    props.createLanguage.url,
                                    Object.assign(
                                        {},
                                        { lang: params.current },
                                        { ...params.addOrUpdateForm.validate },
                                        { ...props.createLanguage.params }
                                    )
                                )
                                    .then((res: any) => {
                                        params.loading = false
                                        if (res) {
                                            if (res?.ret?.code === 200) {
                                                cancelLanguageConfigurationVisible()
                                                afterAction()
                                                if (props.createLanguage.callback)
                                                    props.createLanguage.callback()
                                            } else message.error(res?.ret?.message)
                                        }
                                    })
                                    .catch((err: any) => {
                                        params.loading = false
                                        message.error(err.message)
                                    })
                            }
                        }
                    })
                    .catch(() => (params.loading = false))
            }
        }

        // delete language.
        const deleteLanguageConfiguration = (data: any) => {
            if (params.loading) return
            params.loading = true
            if (props.deleteLanguage.url) {
                const record = data?.record
                $request[(props.deleteLanguage.method || 'DELETE').toLowerCase()](
                    $tools.replaceUrlParams(props.deleteLanguage.url, {
                        id: record.id
                    }),
                    props.createLanguage.params
                )
                    .then((res: any) => {
                        params.loading = false
                        if (res) {
                            if (res?.ret?.code === 200) {
                                message.success(t('success'))
                                setLanguageConfigurationList('', params.current)
                            } else message.error(res?.ret?.message)
                        }
                    })
                    .catch((err: any) => {
                        params.loading = false
                        message.error(err.message)
                    })
            }
        }

        // search
        const resetSearch = () => {
            params.search.key = ''
            if (params.tab === 'customize') setLanguageConfigurationList()
            else changBuiltInLanguageCategory(params.current)
        }

        const searchInput = (evt: any) => {
            const value = evt?.target?.value
            if ($tools.isEmpty(value)) {
                if (params.tab === 'customize') {
                    setLanguageConfigurationList(params.search.key, params.current)
                } else {
                    changBuiltInLanguageCategory(params.current)
                }
            }
        }

        const search = () => {
            if (params.search.key) {
                if (params.tab === 'customize') {
                    setLanguageConfigurationList(params.search.key, params.current)
                } else {
                    builtInLanguages = []
                    getBuiltInLanguageConfiguration(
                        (messages as any).value[params.builtInCurrent] || {}
                    )
                    const reg = new RegExp(params.search.key, 'ig')
                    const res: LanguageFormState[] = []
                    for (const i in builtInLanguages) {
                        const cur = builtInLanguages[i]
                        if (reg.test(cur.key) || reg.test(cur.language)) res.push(cur)
                    }
                    builtInLanguages = res
                    instance?.proxy?.$forceUpdate()
                }
            }
        }

        const batchDelete = () => {
            if (batchDeleteIds.length <= 0) {
                message.error(t('delete-select'))
                return
            }
            if (params.loading) return
            params.loading = true
            if (props.deleteLanguage.url) {
                $request[(props.deleteLanguage.method || 'DELETE').toLowerCase()](
                    $tools.replaceUrlParams(props.deleteLanguage.url, {
                        id: batchDeleteIds.join(',')
                    }),
                    props.deleteLanguage.params
                )
                    .then((res: any) => {
                        params.loading = false
                        if (res) {
                            if (res?.ret?.code === 200) {
                                message.success(t('success'))
                                setLanguageConfigurationList('', params.current)
                            } else message.error(res?.ret?.message)
                        }
                    })
                    .catch((err: any) => {
                        params.loading = false
                        message.error(err.message)
                    })
            }
        }

        const batchDeleteItemChange = (_keys: Key[], rows: any[]) => {
            const ids: any[] = []
            for (let i = 0, l = rows.length; i < l; i++) {
                const id = rows[i]?.id || rows[i]?.key
                if (id) ids.push(id)
            }
            batchDeleteIds = ids
        }

        // update i18n locale ( messages ).
        const updateSystemLocaleData = (message?: {}) => {
            if (locale.value === params.current) {
                if (message && Object.keys(message).length > 0) {
                    i18n.setLocale(locale.value, message)
                }
            }
        }

        // table pagination change.
        const changePagination = (page: number, size: number) => {
            batchDeleteIds = []
            params.pagination.page = page
            params.pagination.size = size
            if (props.data.url) setLanguageConfigurationList()
        }

        // sign
        const automaticTranslate = async (data: any) => {
            const id = data?.id
            const list = data?.translate
            if (
                props.translate.url &&
                props.translate.appid &&
                props.translate.key &&
                id &&
                list &&
                props.batchCreateLanguage?.url
            ) {
                const queries = [] as string[]
                for (let i = 0, l = list.length; i < l; i++) {
                    const cur = list[i]
                    queries.push(cur?.language)
                }
                const salt = $tools.uid()
                const query = queries.join('\n')
                const sign = md5(props.translate.appid + query + salt + props.translate.key)
                $request
                    .get(props.translate.url, {
                        q: query,
                        from: 'auto',
                        to: params.translate.form.target,
                        appid: props.translate.appid,
                        salt,
                        sign
                    })
                    .then((res: any) => {
                        if (res.trans_result) {
                            const items = [] as LanguageFormState[]
                            // TODO: 翻译目标语系与默认语系一致
                            const temp = res.trans_result[0]
                            if ((temp ? temp?.dst.indexOf('\n') : -1) !== -1) {
                                for (let x = 0, y = list.length; x < y; x++) {
                                    items.push({
                                        cid: id,
                                        key: list[x].key,
                                        language: list[x].language
                                    })
                                }
                            } else {
                                for (let n = 0, m = res.trans_result.length; n < m; n++) {
                                    const item = res.trans_result[n]
                                    const origin = list[n] as any
                                    items.push({
                                        cid: id,
                                        key: origin?.key,
                                        language: item?.dst
                                    })
                                }
                            }
                            $request
                                .post(props.batchCreateLanguage.url, {
                                    data: items
                                })
                                .then((res: any) => {
                                    if (res?.ret?.code !== 200) message.error(res?.ret?.message)
                                })
                                .catch((err: any) => {
                                    message.error(err?.message)
                                })
                        } else message.error(res?.error_msg)
                    })
            } else message.error(t('language.translate.config'))
        }

        getBuiltInLanguageConfiguration((messages as any).value[locale.value])
        initLanguageConfiguration()

        // render
        const renderLanguageSelectionOptions = () => {
            const options = [] as any[]
            for (let i = 0, l = params.categories.length; i < l; i++) {
                const cur = params.categories[i] as LanguageFormState
                const elem = cur.is_default ? (
                    <>
                        <span innerHTML={cur.language} />
                        <span class="theme"> - {t('language.default-language')}</span>
                    </>
                ) : (
                    cur.language
                )
                options.push(<SelectOption value={cur.key}>{elem}</SelectOption>)
            }
            return options
        }

        const renderTargetLanguageOptions = () => {
            const options = [] as any[]
            for (const i in params.translate.languages) {
                const cur = params.translate.languages[i]
                options.push(<SelectOption value={i}>{cur}</SelectOption>)
            }
            return options
        }

        const renderLanguageSelection = () => {
            return params.categories.length > 0 ? (
                <Select
                    v-model:value={params.current}
                    onChange={changLanguageCategory}
                    placeholder={t('language.placeholder.current')}
                    style={{ minWidth: $tools.convert2Rem(220) }}>
                    {renderLanguageSelectionOptions()}
                </Select>
            ) : (
                <>
                    <span innerHTML={t('language.no-data')} />
                    <a
                        class="theme"
                        style={{ marginLeft: $tools.convert2Rem(4) }}
                        onClick={() => (params.visible.management = !params.visible.management)}
                        innerHTML={t('add-now')}
                    />
                </>
            )
        }

        const renderBuiltInLanguageSelection = () => {
            const options = [] as any[]
            for (let i = 0, l = params.builtInCategories.length; i < l; i++) {
                const cur = params.builtInCategories[i] as LanguageFormState
                options.push(<SelectOption value={cur.key}>{cur.language}</SelectOption>)
            }
            return (
                <Select
                    v-model:value={params.builtInCurrent}
                    onChange={changBuiltInLanguageCategory}
                    style={{ minWidth: $tools.convert2Rem(120) }}>
                    {options}
                </Select>
            )
        }

        const renderEmpty = () => {
            return <Empty description={t('no-data')} />
        }

        const renderLanguageTags = () => {
            if (params.categories.length <= 0) {
                return renderEmpty()
            } else {
                const langs = [] as any[]
                for (let i = 0, l = params.categories.length; i < l; i++) {
                    const cur = params.categories[i] as LanguageFormState
                    langs.push(
                        <div class={`${prefixCls}-cate`}>
                            <span class={`${prefixCls}-cate-name`} innerHTML={cur.language} />
                            <div
                                class={`${prefixCls}-cate-edit`}
                                onClick={() => updateLanguageCategoryVisible(cur)}>
                                <EditOutlined />
                            </div>
                            <Popconfirm
                                title={t('delete-confirm')}
                                style={{ zIndex: Date.now() }}
                                okText={t('ok')}
                                onConfirm={() => deleteLanguageCategory(cur.id || cur.key)}
                                cancelText={t('cancel')}>
                                <span class={`${prefixCls}-cate-close`}>
                                    <CloseCircleFilled />
                                </span>
                            </Popconfirm>
                        </div>
                    )
                }
                return <div class={`${prefixCls}-cates`}>{langs}</div>
            }
        }

        const renderLanguagesModalTitle = () => {
            return (
                <>
                    <span
                        innerHTML={t('language.management')}
                        style={{ marginRight: $tools.convert2Rem(16) }}
                    />
                    <Button type="primary" onClick={createLanguageCategoryVisible}>
                        {t('language.add-language')}
                    </Button>
                </>
            )
        }

        const renderLanguagesModal = () => {
            return (
                <MiModal
                    wrapClass={`${prefixCls}-modal`}
                    v-model:visible={params.visible.management}
                    maskClosable={false}
                    width={640}
                    animation="flip"
                    title={renderLanguagesModalTitle()}
                    footer={false}>
                    {renderLanguageTags()}
                </MiModal>
            )
        }

        const renderAddOrUpdateLanguageModal = () => {
            return (
                <MiModal
                    v-model:visible={params.visible.create}
                    title={t('language.add-language')}
                    maskClosable={false}
                    animation="flip"
                    onCancel={cancelLanguageCategoryVisible}
                    onOk={createOrUpdateLanguageCategory}
                    footerBtnPosition="center">
                    <Form
                        class={`${formCls} ${formCls}-theme`}
                        labelCol={{ style: { width: $tools.convert2Rem(146) } }}
                        model={params.form.validate}
                        rules={params.form.rules}
                        ref={formRef}>
                        <FormItem label={t('language.is-default')} name="is_default">
                            <RadioGroup
                                options={params.form.defaultOptions}
                                v-model:value={params.form.validate.is_default}
                            />
                        </FormItem>
                        <FormItem label={t('language.key')} name="key">
                            <Input
                                name="key"
                                v-model:value={params.form.validate.key}
                                maxlength={64}
                                autocomplete="off"
                                placeholder={t('language.placeholder.key')}
                            />
                        </FormItem>
                        <FormItem label={t('language.display-language')} name="language">
                            <Input
                                name="language"
                                v-model:value={params.form.validate.language}
                                maxlength={64}
                                autocomplete="off"
                                placeholder={t('language.placeholder.language')}
                            />
                        </FormItem>
                        <FormItem
                            v-slots={{
                                label: () => {
                                    return (
                                        <>
                                            <span style={{ marginRight: $tools.convert2Rem(4) }}>
                                                {t('language.is-translate')}
                                            </span>
                                            <Tooltip
                                                v-slots={{
                                                    title: () => {
                                                        return (
                                                            <div
                                                                innerHTML={t(
                                                                    'language.auto'
                                                                )}></div>
                                                        )
                                                    }
                                                }}>
                                                <span
                                                    class="theme"
                                                    style={{ marginRight: $tools.convert2Rem(4) }}>
                                                    <InfoCircleOutlined />
                                                </span>
                                            </Tooltip>
                                        </>
                                    )
                                }
                            }}>
                            <RadioGroup
                                options={params.form.defaultOptions}
                                v-model:value={params.translate.form.translate}
                            />
                        </FormItem>
                        <FormItem label={t('language.target')}>
                            <Select
                                v-model:value={params.translate.form.target}
                                placeholder={t('language.placeholder.current')}
                                style={{ width: '100%' }}>
                                {renderTargetLanguageOptions()}
                            </Select>
                        </FormItem>
                    </Form>
                </MiModal>
            )
        }

        const renderCreateOrUpdateLanguageConfiguration = () => {
            const title = params.isEdit ? t('language.update-title') : t('language.add-title')
            return (
                <MiModal
                    v-model:visible={params.visible.update}
                    title={title}
                    width={360}
                    maskClosable={false}
                    onCancel={cancelLanguageConfigurationVisible}
                    onOk={createOrUpdateLanguageConfiguration}
                    footerBtnPosition="center">
                    <Form
                        class={`${formCls} ${formCls}-theme`}
                        model={params.addOrUpdateForm.validate}
                        rules={params.addOrUpdateForm.rules}
                        ref={addOrUpdateFormRef}>
                        <FormItem label={t('language.current')}>
                            <span
                                class={`${prefixCls}-current-name`}
                                innerHTML={params.types[params.current]}
                            />
                        </FormItem>
                        <FormItem name="key">
                            <Input
                                v-model:value={params.addOrUpdateForm.validate.key}
                                maxlength={64}
                                autocomplete="off"
                                placeholder={t('language.placeholder.config.key')}
                            />
                        </FormItem>
                        <FormItem name="language">
                            <Textarea
                                v-model:value={params.addOrUpdateForm.validate.language}
                                autoSize={{ minRows: 4, maxRows: 8 }}
                                placeholder={t('language.placeholder.config.value')}
                            />
                        </FormItem>
                    </Form>
                </MiModal>
            )
        }

        const renderActionBtns = () => {
            const addOrNot = params.types[params.current] ? (
                <span class="theme">{params.types[params.current]}</span>
            ) : (
                <a class="theme">{t('no-data')}</a>
            )
            const btns =
                params.tab === 'customize' ? (
                    <Col xs={24} md={10}>
                        <div class={`${searchCls}-btns-r multiple`}>
                            <Popconfirm
                                style={{ zIndex: Date.now() }}
                                okText={t('ok')}
                                placement="topRight"
                                onConfirm={() => setDefaultCategory()}
                                v-slots={{
                                    title: () => {
                                        return (
                                            <div
                                                class="title-limit"
                                                style={{ maxWidth: $tools.convert2Rem(285) }}>
                                                <div innerHTML={t('language.default-tip')}></div>
                                                <div style={{ marginTop: $tools.convert2Rem(8) }}>
                                                    <span>{t('language.current')}</span>
                                                    {addOrNot}
                                                </div>
                                            </div>
                                        )
                                    }
                                }}
                                cancelText={t('cancel')}>
                                <Button class={`${btnCls}-warning`} icon={<CheckOutlined />}>
                                    {t('language.default')}
                                </Button>
                            </Popconfirm>
                            <Popconfirm
                                style={{ zIndex: Date.now() }}
                                okText={t('ok')}
                                onConfirm={() => batchDelete()}
                                v-slots={{
                                    title: () => {
                                        return (
                                            <div
                                                class="title-limit"
                                                style={{ maxWidth: $tools.convert2Rem(180) }}>
                                                <div innerHTML={t('delete-confirm')}></div>
                                            </div>
                                        )
                                    }
                                }}
                                cancelText={t('cancel')}>
                                <Button type="primary" danger={true} icon={<DeleteOutlined />}>
                                    {t('batch-delete')}
                                </Button>
                            </Popconfirm>
                            <Button
                                class={`${btnCls}-success`}
                                icon={<EditOutlined />}
                                onClick={createLanguageConfigurationVisible}>
                                {t('language.add')}
                            </Button>
                        </div>
                    </Col>
                ) : null
            const searchBtn = props.data.url ? (
                <Col xs={24} md={params.tab === 'customize' ? 14 : 24}>
                    <div class={`${searchCls}-btns-l multiple`}>
                        <div class={`${searchCls}-item`}>
                            <label>{t('key')}</label>
                            <Input
                                placeholder={t('language.placeholder.search')}
                                onInput={searchInput}
                                onPressEnter={search}
                                v-model:value={params.search.key}
                            />
                        </div>
                        <div class={`${searchCls}-btns-l-b`}>
                            <Button
                                class={`${btnCls}-info`}
                                onClick={search}
                                style={{ marginRight: $tools.convert2Rem(8) }}
                                v-slots={{
                                    icon: () => {
                                        return <SearchOutlined />
                                    }
                                }}>
                                {t('seek')}
                            </Button>
                            <Button
                                class={`${btnCls}-info`}
                                onClick={resetSearch}
                                v-slots={{
                                    icon: () => {
                                        return <ReloadOutlined />
                                    }
                                }}>
                                {t('reset')}
                            </Button>
                        </div>
                    </div>
                </Col>
            ) : null
            return (
                <Row class={`${searchCls}-btns${props.data.url ? '' : ' no-search'}`}>
                    {searchBtn}
                    {btns}
                </Row>
            )
        }

        const renderTabItems = () => {
            return (
                <div class={`${prefixCls}-tabs`}>
                    <div
                        class={`${prefixCls}-tab ${params.tab === 'customize' ? 'active' : ''}`}
                        onClick={() => (params.tab = 'customize')}>
                        <PlusOutlined />
                        {t('customize')}
                    </div>
                    <div
                        class={`${prefixCls}-tab ${params.tab === 'built-in' ? 'active' : ''}`}
                        onClick={() => (params.tab = 'built-in')}>
                        <FormOutlined />
                        {t('language.system')}
                    </div>
                    <div
                        class={`${prefixCls}-tab ${params.tab === 'manage' ? 'active' : ''}`}
                        onClick={() => (params.visible.management = !params.visible.management)}>
                        <GlobalOutlined />
                        {t('language.management')}
                    </div>
                </div>
            )
        }

        const renderTable = () => {
            const table =
                params.tab === 'customize' ? (
                    <>
                        <Table
                            columns={params.table.columns}
                            dataSource={params.table.data}
                            rowSelection={{
                                columnWidth: 60,
                                onChange: (keys: Key[], rows: any[]) => {
                                    batchDeleteItemChange(keys, rows)
                                }
                            }}
                            pagination={{
                                showLessItems: true,
                                showQuickJumper: true,
                                onChange: changePagination,
                                responsive: true,
                                total,
                                current: params.pagination.page,
                                pageSize: params.pagination.size
                            }}
                            loading={params.table.loading}
                            v-slots={{
                                headerCell: (record: any) => {
                                    if (record.column.key === 'language') {
                                        return renderLanguageSelection()
                                    }
                                }
                            }}
                            scroll={{ x: '100%' }}
                        />
                    </>
                ) : params.tab === 'built-in' ? (
                    <>
                        <Table
                            columns={params.table.builtin.columns}
                            dataSource={builtInLanguages}
                            pagination={{
                                showLessItems: true,
                                showQuickJumper: true,
                                responsive: true
                            }}
                            v-slots={{
                                headerCell: (record: any) => {
                                    if (record.column.key === 'language') {
                                        return renderBuiltInLanguageSelection()
                                    }
                                }
                            }}
                            scroll={{ x: '100%' }}
                        />
                    </>
                ) : null
            return (
                <div class={`${prefixCls}-table`}>
                    <ConfigProvider
                        locale={props.paginationLocale}
                        renderEmpty={() => renderEmpty()}>
                        {renderTabItems()}
                        {renderActionBtns()}
                        <div class={`${prefixCls}-list`}>
                            <div class={`${prefixCls}-list-scroll`}>
                                <div class={`${prefixCls}-list-item`}>{table}</div>
                            </div>
                        </div>
                    </ConfigProvider>
                </div>
            )
        }

        return () => (
            <div class={prefixCls}>
                {renderTable()}
                {renderCreateOrUpdateLanguageConfiguration()}
                {renderLanguagesModal()}
                {renderAddOrUpdateLanguageModal()}
            </div>
        )
    }
})
