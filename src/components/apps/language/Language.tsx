import { defineComponent, reactive, ref, inject, computed } from 'vue'
import { LanguageItemProperties, LanguageProps } from './props'
import { useI18n } from 'vue-i18n'
import { $g } from '../../../utils/global'
import { $tools } from '../../../utils/tools'
import { $request } from '../../../utils/request'
import { type ResponseData } from '../../../utils/types'
import { useLayoutStore } from '../../../stores/layout'
import {
    ConfigProvider,
    message,
    Empty,
    Row,
    Input,
    Button,
    Popconfirm,
    Table,
    Select,
    SelectOption,
    Form,
    type FormInstance,
    FormItem,
    RadioGroup,
    Tooltip,
    Textarea,
    Tag
} from 'ant-design-vue'
import {
    PlusOutlined,
    FormOutlined,
    GlobalOutlined,
    CheckOutlined,
    SearchOutlined,
    ReloadOutlined,
    DeleteOutlined,
    EditOutlined,
    CloseCircleFilled,
    ExclamationCircleOutlined,
    StopOutlined,
    CheckCircleOutlined
} from '@ant-design/icons-vue'
import md5 from 'md5'
import MiModal from '../../modal/Modal'
import zhCN from 'ant-design-vue/es/locale/zh_CN'
import applyTheme from '../../_utils/theme'
import styled from './style/language.module.less'
/**
 * @events 回调事件
 * @event afterGetContent 获取单个语系的内容配置 - 成功后的回调
 * @event afterCreateContent 创建单个语系的内容配置 - 成功后的回调
 * @event afterUpdateContent 更新单个语系的内容配置 - 成功后的回调
 * @event afterBatchDeleteContent 批量删除语系内容 - 成功后的回调
 * @event afterGetCategory 获取语系分类 - 成功后的回调
 * @event afterCreateCategory 创建语系分类 - 成功后的回调
 * @event afterUpdateCategory 更新语系分类 - 成功后的回调
 * @event afterDeleteCategory 删除语系分类 - 成功后的回调
 * @event afterAutomaticTranslate 自动翻译 - 成功后的回调
 */
const MiAppsLanguage = defineComponent({
    name: 'MiAppsLanguage',
    inheritAttrs: false,
    props: LanguageProps(),
    emits: [
        'afterGetContent',
        'afterCreateContent',
        'afterUpdateContent',
        'afterBatchDeleteContent',
        'afterGetCategory',
        'afterCreateCategory',
        'afterUpdateCategory',
        'afterDeleteCategory',
        'afterAutomaticTranslate'
    ],
    setup(props, { emit }) {
        const setLocale = inject('setLocale') as any
        const { messages, locale, t } = useI18n()
        const languages = reactive({
            builtin: [] as LanguageItemProperties[],
            customize: [] as LanguageItemProperties[]
        })
        const categoryFormRef = ref<FormInstance>()
        const contentFormRef = ref<FormInstance>()
        const layoutStore = useLayoutStore()
        const collapsed = computed(() => layoutStore.collapsed)

        // 检验- 语系 key 值
        const checkCategoryKeyValidate = async (_rule: any, value: string) => {
            if (!value) return Promise.reject(t('language.error.key.empty'))
            if (!/^[a-zA-Z]{1}[a-zA-Z0-9\-\.\_]/gi.test(value)) {
                return Promise.reject(t('language.error.reg'))
            }
            if (props.checkCategoryExistAction) {
                const categoryParams = Object.assign(
                    {
                        id: params.form.category.id,
                        key: params.form.category.validate.key,
                        edit: params.form.category.edit ? 1 : 0
                    },
                    { ...props.checkCategoryExistParams }
                )
                if (typeof props.checkCategoryExistAction === 'string') {
                    return await $request[props.checkCategoryExistMethod](
                        $tools.replaceUrlParams(props.checkCategoryExistAction, {
                            id: params.form.category.id
                        }),
                        categoryParams
                    )
                        .then((res: ResponseData | any) => {
                            if (res?.ret?.code === 200) {
                                return Promise.resolve()
                            } else if (res?.ret?.message) {
                                return Promise.reject(res?.ret?.message)
                            }
                            return Promise.resolve()
                        })
                        .catch((err: any) => {
                            return Promise.reject(err?.message || err)
                        })
                } else if (typeof props.checkCategoryExistAction === 'function') {
                    const response = await props.checkCategoryExistAction(categoryParams)
                    if (typeof response === 'string') return Promise.reject(response)
                    return Promise.resolve()
                }
            } else return Promise.resolve()
        }

        // 校验 - 语言 key 值
        const checkContentKeyValidate = async (_rule: any, value: string) => {
            if (!value) return Promise.reject(t('language.placeholder.config.key'))
            if (!/^[a-zA-Z]{1}[a-zA-Z0-9\-\.\_]/gi.test(value)) {
                return Promise.reject(t('language.error.reg'))
            }
            if (props.checkContentExistAction) {
                const actionParams = Object.assign(
                    {
                        id: params.form.content.id,
                        cid: params.category.current,
                        key: params.form.content.validate.key,
                        edit: params.form.content.edit ? 1 : 0
                    },
                    { ...props.checkContentExistParams }
                )
                if (typeof props.checkContentExistAction === 'string') {
                    return await $request[props.checkContentExistMethod](
                        props.checkContentExistAction,
                        actionParams
                    )
                        .then((res: ResponseData | any) => {
                            if (res?.ret?.code === 200) {
                                return Promise.resolve()
                            } else if (res?.ret?.message) {
                                return Promise.reject(res?.ret?.message)
                            }
                            return Promise.resolve()
                        })
                        .catch((err: any) => {
                            return Promise.reject(err?.message || err)
                        })
                } else if (typeof props.checkContentExistAction === 'function') {
                    const response = await props.checkContentExistAction(actionParams)
                    if (typeof response === 'string') return Promise.reject(response)
                    return Promise.resolve()
                }
            } else return Promise.resolve()
        }

        const params = reactive({
            ids: [],
            loading: {
                default: false,
                languages: false,
                categories: false,
                createOrUpdate: false,
                delete: false
            },
            total: {
                builtin: 0,
                customize: 0
            },
            /**
             * @param data 语系列表
             * @param ids 语系 id 列表 [{ key: value }]
             * @param types 语系类型列表
             * @param current 当前选中的语系 ID
             * @param key 语系关键词 ( eg. zh-cn )
             * @param active 分类 Tab 选中类型
             */
            category: {
                data: [] as LanguageItemProperties[],
                ids: {} as any,
                types: {} as any,
                current: 0,
                key: $g.locale,
                active: 'customize'
            },
            table: {
                customize: {
                    columns: [
                        {
                            title: t('global.key'),
                            key: 'key',
                            dataIndex: 'key',
                            align: 'left',
                            width: 320
                        },
                        {
                            key: 'language',
                            dataIndex: 'language',
                            align: 'left'
                        },
                        {
                            title: t('language.content.status'),
                            key: 'status',
                            dataIndex: 'status',
                            align: 'center',
                            width: 120,
                            customRender: ({ record }) => {
                                return (
                                    <Tag
                                        color={
                                            record?.status === 1
                                                ? 'success'
                                                : record.status === 0
                                                  ? 'error'
                                                  : 'default'
                                        }>
                                        {record?.status === 1
                                            ? t('global.enable')
                                            : t('global.disable')}
                                    </Tag>
                                )
                            }
                        },
                        {
                            title: t('global.action'),
                            key: 'action',
                            align: 'center',
                            width: 270,
                            customRender: ({ record }) => {
                                return (
                                    <div class={styled.actionBtns}>
                                        <Button
                                            type="primary"
                                            icon={<FormOutlined />}
                                            onClick={() => handleUpdateContentModalState(record)}>
                                            {t('global.edit')}
                                        </Button>
                                        <Popconfirm
                                            title={t('global.delete.confirm')}
                                            overlayStyle={{
                                                zIndex: Date.now(),
                                                minWidth: $tools.convert2rem(210)
                                            }}
                                            okText={t('global.ok')}
                                            cancelText={t('global.cancel')}
                                            okButtonProps={{
                                                onClick: () => handleDeleteContent(record?.id)
                                            }}
                                            key={record?.key}>
                                            <Button
                                                type="primary"
                                                danger={true}
                                                icon={<DeleteOutlined />}>
                                                {t('global.delete.normal')}
                                            </Button>
                                        </Popconfirm>
                                        <Button
                                            class={styled.btnInfo}
                                            type="default"
                                            icon={
                                                record?.status === 1 ? (
                                                    <StopOutlined />
                                                ) : (
                                                    <CheckCircleOutlined />
                                                )
                                            }>
                                            {record?.status === 1
                                                ? t('global.disable')
                                                : t('global.enable')}
                                        </Button>
                                    </div>
                                )
                            }
                        }
                    ] as any[],
                    data: [] as LanguageItemProperties[],
                    pagination: {
                        page: 1,
                        size: 10
                    }
                },
                builtin: {
                    columns: [
                        {
                            title: t('global.key'),
                            key: 'key',
                            dataIndex: 'key',
                            align: 'left',
                            width: 320
                        },
                        {
                            key: 'language',
                            dataIndex: 'language',
                            align: 'left'
                        }
                    ] as any[],
                    pagination: {
                        page: 1,
                        size: 10
                    },
                    current: $g.locale,
                    options: [
                        { key: 'zh-cn', language: t('language.zh-cn') },
                        { key: 'en-us', language: t('language.en-us') }
                    ]
                }
            },
            search: { lang: 'zh-cn', key: '' },
            form: {
                category: {
                    id: 0,
                    edit: false,
                    /**
                     * @param key 语系关键词
                     * @param language 语系显示名称
                     * @param is_default 是否为默认语系
                     */
                    validate: {
                        key: '',
                        language: '',
                        is_default: 0
                    },
                    rules: {
                        key: [
                            {
                                required: true,
                                validator: checkCategoryKeyValidate,
                                trigger: 'blur'
                            }
                        ],
                        language: [{ required: true, message: t('language.error.language') }],
                        is_default: [{ required: true, message: t('language.error.default') }]
                    },
                    options: [
                        { label: t('global.yes'), value: 1 },
                        { label: t('global.no'), value: 0 }
                    ]
                },
                content: {
                    id: 0,
                    key: '',
                    edit: false,
                    /**
                     * @param key 单个语系内的内容配置关键词
                     * @param language 单个语系内的内容配置关键词对应的语言内容
                     * @param status 内容状态 ( 0: 下架; 1: 上架 )
                     * @param sync 是否同步 Key 值 ( 0: 不同步; 1: 全部; 2: 指定 )
                     * @param langs 同步 Key 值时，指定要同步的语系 key
                     */
                    validate: { key: '', language: '', sync: 0, status: 1, langs: [] },
                    rules: {
                        key: [
                            {
                                required: true,
                                validator: checkContentKeyValidate,
                                trigger: 'blur'
                            }
                        ],
                        language: [
                            { required: true, message: t('language.placeholder.config.value') }
                        ],
                        status: [
                            {
                                required: true,
                                message: `${t('global.select')}${t('language.content.status')}`
                            }
                        ]
                    },
                    options: {
                        sync: [
                            { label: t('language.content.sync.all'), value: 1 },
                            { label: t('language.content.sync.specify'), value: 2 },
                            { label: t('language.content.sync.none'), value: 0 }
                        ],
                        status: [
                            { label: t('global.enable'), value: 1 },
                            { label: t('global.disable'), value: 0 }
                        ]
                    }
                }
            },
            translate: {
                languages: props?.translate?.languages || {
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
                    target: props?.translate?.defaultLanguage || 'zh'
                }
            },
            modal: {
                category: {
                    management: false,
                    create: false,
                    createDirect: false
                },
                content: false
            }
        })
        applyTheme(styled)

        // 初始化
        const init = async () => {
            getBuiltinLanguages(messages.value?.[locale.value])
            await setCategory()
        }

        // Tab 切换
        const handleChangeTab = (tab: string) => {
            params.category.active = tab
            params.search.key = ''
            if (tab === 'customize') setCategory()
            else if (tab === 'built-in')
                getBuiltinLanguages(messages.value?.[params.table.builtin.current])
        }

        // 获取自定义语言内容列表
        const getLanguages = async (keyword?: string, lang?: string) => {
            if (params.loading.languages) return
            params.loading.languages = true
            const condition = Object.assign(
                { keyword },
                { ...params.table.customize.pagination },
                { lang: lang ?? 'zh-cn' },
                props.getContentParams
            )
            const afterSuccess = (res: ResponseData | any) => {
                languages.customize = res instanceof Array ? res : res?.data || []
                params.total.customize = res?.total || 0
                emit('afterGetContent', res)
            }
            await handleAction(
                props.getContentAction,
                props.getContentMethod,
                condition,
                'getContentAction',
                (res: ResponseData | any) => afterSuccess(res),
                () => (params.loading.languages = false)
            )
        }

        // 设置自定义语言内容
        const setLanguages = async (keyword?: string, lang?: string) => {
            languages.customize = []
            if (props.data && props.data.length > 0) {
                params.table.customize.data = props.data
            } else {
                await getLanguages(keyword, lang)
                params.table.customize.data = languages.customize
            }
        }

        // 获取系统内置语言内容
        const getBuiltinLanguages = (data: any, idx?: string) => {
            if (Object.keys(data).length > 0) {
                for (const i in data) {
                    const type = typeof data[i]
                    const key = (!$tools.isEmpty(idx) ? `${idx}.` : '') + i
                    if (['object', 'array'].includes(type)) {
                        getBuiltinLanguages(data[i], key)
                    } else {
                        const item = {
                            key,
                            language: data[i],
                            type: 'system'
                        } as LanguageItemProperties
                        if (data?.id) item.id = data.id
                        languages.builtin.push(item)
                    }
                }
            }
        }

        // 获取语系分类
        const getCategories = async (updateLanguage: boolean = false) => {
            if (params.loading.categories) return
            params.loading.categories = true
            const afterSuccess = async (res?: ResponseData | any) => {
                params.category.data = res instanceof Array ? res : res?.data || []
                params.category.current = 0
                for (let i = 0, l = res?.data?.length; i < l; i++) {
                    const category = res?.data[i]
                    params.category.types[category?.key] = category?.language
                    params.category.ids[category?.key] = category?.id
                    if (category?.is_default) {
                        params.category.current = category?.id
                        params.category.key = category?.key
                    }
                }
                // 无默认语系
                if (!params.category.current && params.category.data?.length > 0) {
                    const cur = params.category.data?.[0]
                    params.category.current = parseInt(cur?.id?.toString())
                    params.category.key = cur?.key
                }
                if (updateLanguage && params.category.data?.length > 0) {
                    setLanguages(params.search.key, params.category.key)
                }
                emit('afterGetCategory', res)
            }
            await handleAction(
                props.getCategoryAction,
                props.getCategoryMethod,
                props.getCategoryParams,
                'getCategoryAction',
                (res: ResponseData | any) => afterSuccess(res),
                () => (params.loading.categories = false)
            )
        }

        // 设置语系分类
        const setCategory = async (updateLanguage: boolean = true) => {
            if (props.category && props.category.length > 0) params.category.data = props.category
            else await getCategories(updateLanguage)
        }

        // 设置默认语系
        const setDefaultCategory = () => {
            if (params.category.data && params.category.data.length < 0) {
                message.destroy()
                message.error({ content: t('language.error.none'), duration: 5 })
                return
            }
            if (params.category.current === params.category.ids[params.category.key]) {
                message.destroy()
                message.success({ content: t('language.error.repeated'), duration: 5 })
                return
            }
            if (params.loading.default) return
            params.loading.default = true
            handleAction(
                props.setDefaultCategoryAction,
                props.setDefaultCategoryMethod,
                { id: params.category.ids[params.category.key], ...props.setDefaultCategoryParams },
                'setDefaultCategoryAction',
                () => {
                    message.destroy()
                    message.success(t('global.success'))
                    setCategory(false)
                },
                () => (params.loading.default = false)
            )
        }

        // Table 分页操作
        const handleCustomizePageChange = (page: number, size: number) => {
            params.table.customize.pagination = { page, size }
            params.ids = []
            setLanguages(params.search.key, params.category.key)
        }

        // 批量操作 IDs
        const handleBatchItemChange = (rows: any[]) => {
            const ids: any[] = []
            for (let i = 0, l = rows.length; i < l; i++) {
                const id = rows[i]?.id || rows[i]?.key
                if (id) ids.push(id)
            }
            params.ids = ids
        }

        // 新增语系配置 - Modal State
        const handleCreateCategoryModalState = () => {
            // 未打开语系列表, 直接弹出新增 Modal, 关闭时无需打开语系列表
            if (!params.modal.category.management) params.modal.category.createDirect = true
            params.form.category.id = 0
            params.form.category.edit = false
            params.modal.category.management = false
            params.modal.category.create = true
        }

        // 取消新增语系配置内容 ( 回到语系列表 Modal  ) - Modal State
        const handleCancelCategoryModalState = () => {
            params.modal.category.create = false
            if (params.modal.category.createDirect) params.modal.category.management = false
            else params.modal.category.management = true
            // 直接打开新增内容 Modal 状态, 重置回 false
            params.modal.category.createDirect = false
            params.form.category.id = 0
            params.form.category.edit = false
            params.form.category.validate = { key: '', language: '', is_default: 0 }
            if (categoryFormRef.value) categoryFormRef.value?.clearValidate()
        }

        // 编辑语系 - Modal State
        const handleUpdateCategoryModalState = (data?: any) => {
            params.modal.category.management = false
            params.modal.category.create = true
            params.form.category.edit = true
            if (data?.id) {
                params.form.category.id = data.id
                params.form.category.validate = {
                    key: data?.key,
                    language: data?.language,
                    is_default: data?.is_default
                }
            } else params.form.category.validate = { key: '', language: '', is_default: 0 }
        }

        // 新增/更新 - 语系
        const handleCreateOrUpdateCategory = () => {
            if (categoryFormRef.value) {
                if (params.loading.createOrUpdate) return
                params.loading.createOrUpdate = true
                const afterSuccess = (res?: ResponseData | any) => {
                    message.destroy()
                    message.success(t('global.success'))
                    if (params.form.category.edit) emit('afterUpdateCategory', res)
                    else {
                        if (params.translate.form.translate) handleAutomaticTranslate(res)
                        emit('afterCreateCategory', res)
                    }
                    params.form.category.edit = false
                    handleCancelCategoryModalState()
                    categoryFormRef.value?.resetFields()
                    getCategories()
                }
                categoryFormRef.value?.validate().then(async () => {
                    const actionParams = Object.assign(
                        { ...params.form.category.validate },
                        { ...params.translate.form }
                    )
                    if (params.form.category.edit) {
                        // 更新
                        handleAction(
                            props.updateCategoryAction,
                            props.updateCategoryMethod,
                            Object.assign({ id: params.form.category.id }, actionParams, {
                                ...props.updateCategoryParams
                            }),
                            'updateCategoryAction',
                            (res: ResponseData | any) => afterSuccess(res),
                            () => (params.loading.createOrUpdate = false)
                        )
                    } else {
                        // 新增
                        handleAction(
                            props.createCategoryAction,
                            props.createCategoryMethod,
                            Object.assign(actionParams, { ...props.createCategoryParams }),
                            'createCategoryAction',
                            (res: ResponseData | any) => afterSuccess(res),
                            () => (params.loading.createOrUpdate = false)
                        )
                    }
                })
            }
        }

        // 删除 - 语系
        const handleDeleteCategory = (data?: any) => {
            if (!data?.id) {
                message.destroy()
                message.error(t('global.error.id'))
                return
            }
            if (params.loading.delete) return
            params.loading.delete = true
            const actionParams = Object.assign({ id: data.id }, props.deleteCategoryParams)
            handleAction(
                props.deleteCategoryAction,
                props.deleteCategoryMethod,
                actionParams,
                'deleteCategoryAction',
                async (res?: ResponseData | any) => {
                    message.destroy()
                    message.success(t('global.success'))
                    await setCategory()
                    emit('afterDeleteCategory', res)
                },
                () => (params.loading.delete = false)
            )
        }

        // 语系变化事件
        const handleChangeCategory = async (lang: string) => {
            languages.customize = [] as LanguageItemProperties[]
            await setLanguages(params.search.key, lang)
        }

        // 语系变化事件 - 内置语系
        const handleChangeBuiltinCategory = (lang: string) => {
            languages.builtin = []
            params.table.builtin.current = lang
            if (params.search.key) handleSearchContent()
        }

        // 新增单个语系内的配置内容 - Modal State
        const handleCreateContentModalState = () => {
            params.form.content.edit = false
            params.form.content.id = 0
            params.form.content.validate = { key: '', language: '', sync: 0, status: 1, langs: [] }
            params.modal.content = true
        }

        // 更新单个语系内的配置内容 - Modal State
        const handleUpdateContentModalState = (data?: any) => {
            params.form.content.edit = true
            params.modal.content = true
            if (data?.id) {
                params.form.content.id = data.id
                if (typeof data?.is_del !== 'undefined') delete data.is_del
                if (typeof data?.created_at !== 'undefined') delete data.created_at
                if (typeof data?.updated_at !== 'undefined') delete data.updated_at
                params.form.content.validate = { ...data }
                params.form.content.validate.sync = 0
                params.form.content.key = data?.key
            } else {
                params.form.content.id = 0
                params.form.content.validate = {
                    key: '',
                    language: '',
                    sync: 0,
                    status: 1,
                    langs: []
                }
                params.form.content.key = ''
            }
        }

        // 单个语系内的配置内容 - 关闭 Modal
        const handleCancelCreateContentModalState = () => {
            handleCreateContentModalState()
            params.modal.content = false
            if (contentFormRef.value) contentFormRef.value?.clearValidate()
        }

        // 新增/更新 - 语言内容 - action
        const handleCreateOrUpdateContent = () => {
            if (contentFormRef.value) {
                if (params.loading.createOrUpdate) return
                params.loading.createOrUpdate = true
                contentFormRef.value?.validate().then(async () => {
                    const afterSuccess = (res?: ResponseData | any) => {
                        message.destroy()
                        message.success(t('global.success'))
                        const newContent = {}
                        newContent[params.form.content.validate.key] =
                            params.form.content.validate.language
                        handleUpdateLocaleData(newContent)
                        handleCancelCreateContentModalState()
                        contentFormRef.value?.resetFields()
                        setLanguages(params.search.key, params.category.key)
                        if (params.form.content.edit) {
                            params.form.content.edit = false
                            params.form.content.key = ''
                            params.form.content.id = 0
                            emit('afterUpdateContent', res)
                        } else emit('afterCreateContent', res)
                    }
                    const actionParams = Object.assign(
                        { lang: params.category.key },
                        { ...params.form.content.validate }
                    )
                    if (params.form.content.edit) {
                        // 更新
                        if (!params.form.content.id) {
                            message.destroy()
                            message.error(t('global.error.id'))
                            return
                        }
                        handleAction(
                            props.updateContentAction,
                            props.updateContentMethod,
                            Object.assign({ id: params.form.content.id }, actionParams, {
                                ...props.updateContentParams
                            }),
                            'updateContentAction',
                            (res: ResponseData | any) => afterSuccess(res),
                            () => (params.loading.createOrUpdate = false)
                        )
                    } else {
                        // 新增
                        handleAction(
                            props.createContentAction,
                            props.createContentMethod,
                            Object.assign(actionParams, { ...props.createContentParams }),
                            'createContentAction',
                            (res?: ResponseData | any) => afterSuccess(res),
                            () => (params.loading.createOrUpdate = false)
                        )
                    }
                })
            }
        }

        /**
         * 执行动作
         * @param action 待执行动作
         * @param method 请求方式 ( string 动作时有效 )
         * @param params 参数
         * @param name 执行方法名称
         * @param callback action 回调
         * @param defaultCallback 默认回调
         */
        const handleAction = async (
            action: string | Function | undefined,
            method: string,
            params: any = {},
            name: string,
            callback?: Function,
            commonCallback?: Function
        ) => {
            if (action) {
                if (typeof action === 'string') {
                    await $request[method](action, params)
                        .then(async (res: ResponseData | any) => {
                            if (res?.ret?.code !== 200 && res?.ret?.message) {
                                message.destroy()
                                message.error(res?.ret?.message)
                            } else await callback?.(res)
                        })
                        .catch((err: any) => message.error(err?.message || err))
                        .finally(() => commonCallback?.())
                } else if (typeof action === 'function') {
                    const response = await action(params)
                    if (typeof response === 'string') {
                        message.destroy()
                        message.error(response)
                    }
                    await callback?.(response)
                    commonCallback?.()
                }
            } else {
                message.destroy()
                message.warn({
                    content: t('language.error.config', { name }),
                    duration: 6
                })
                if (commonCallback) commonCallback()
            }
        }

        // 单个删除 - 单个语系内的配置内容
        const handleDeleteContent = async (id: number) => {
            params.ids = [id]
            handleBatchDeleteContent()
        }

        // 批量删除 - 单个语系内的配置内容
        const handleBatchDeleteContent = async () => {
            if (params.ids.length <= 0) {
                message.destroy()
                message.error(t('global.delete.select'))
                return
            }
            if (params.loading.delete) return
            params.loading.delete = true
            handleAction(
                props.deleteContentAction,
                props.deleteContentMethod,
                {
                    id: params.ids.join(','),
                    ...props.deleteContentParams
                },
                'deleteContentAction',
                (res?: ResponseData | any) => {
                    message.destroy()
                    message.success(t('global.success'))
                    setLanguages(params.search.key, params.category.key)
                    emit('afterBatchDeleteContent', res)
                },
                () => (params.loading.delete = false)
            )
        }

        // 更新 i18n 数据
        const handleUpdateLocaleData = (message?: {}) => {
            if (locale.value === params.category.key) {
                if (message && Object.keys(message).length > 0) {
                    setLocale(locale.value, message)
                }
            }
        }

        // 自动翻译
        const handleAutomaticTranslate = async (res?: ResponseData | any) => {
            // 翻译类型
            const type = props.translate?.type
            /**
             * TODO: 默认调用百度翻译.
             * TODO: 默认翻译同时限定接口响应数据结构, 否则默认自动翻译无法使用.
             * 自定义翻译功能的话, 请自行配置 props.translate.translate 方法.
             * 默认翻译将调用 batchCreateAction 方法, 将翻译后的数据批量插入数据库.
             * {
             *     ret: { code: string, message: string }
             *     data: {
             *         id: number,
             *         translate: array
             *     }
             * }
             */
            if (type === 'baidu') {
                const data = res?.data || {}
                // 语系 ID
                const id = data?.id
                // 待翻译列表
                const list = data?.translate || []
                // 翻译配置
                const config = props.translate?.[type] || {}
                if (config?.appid && config?.url && config?.key && id && list.length > 0) {
                    const queries = [] as string[]
                    for (let i = 0, l = list.length; i < l; i++) {
                        queries.push(list[i]?.language)
                    }
                    const salt = $tools.uid()
                    const query = queries.join('\n')
                    const sign = md5(config.appid + query + salt + config.key)
                    $request
                        .get(config.url, {
                            q: query,
                            from: 'auto',
                            to: params.translate.form.target,
                            appid: config.appid,
                            salt,
                            sign
                        })
                        .then(async (res: any) => {
                            if (res?.trans_result && res.trans_result.length > 0) {
                                const items = [] as Partial<LanguageItemProperties>[]
                                const first = res.trans_result?.[0]
                                // 翻译目标语系与默认语系一致
                                if ((first ? first?.dst.indexOf('\n') : -1) !== -1) {
                                    for (let x = 0, y = list.length; x < y; x++) {
                                        items.push({
                                            cid: id,
                                            key: list[x].key,
                                            language: list[x].language
                                        })
                                    }
                                } else {
                                    // 翻译结果
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
                                // 批量添加
                                handleAction(
                                    props.batchCreateContentAction,
                                    props.batchCreateContentMethod,
                                    {
                                        data: items,
                                        ...props.batchCreateContentParams
                                    },
                                    'batchCreateContentAction',
                                    () => emit('afterAutomaticTranslate', res)
                                )
                            } else message.error(res?.error_msg || t('global.error.unknown'))
                        })
                }
            } else {
                if (typeof props.translate?.translate === 'function') {
                    // 自定义翻译功能
                    props.translate?.translate(res)
                }
            }
        }

        // 搜索
        const handleSearchContent = () => {
            if (params.search.key) {
                if (params.category.active === 'customize') {
                    setLanguages(params.search.key, params.category.key)
                } else {
                    languages.builtin = []
                    getBuiltinLanguages(messages.value?.[params.table.builtin.current] || {})
                    const reg = new RegExp(params.search.key, 'ig')
                    const res: LanguageItemProperties[] = []
                    for (const i in languages.builtin) {
                        const cur = languages.builtin[i]
                        if (reg.test(cur.key) || reg.test(cur.language)) res.push(cur)
                    }
                    languages.builtin = res
                }
            }
        }

        // 清除内容至空后自动触发搜索
        const handleSearchInput = () => {
            if (!params.search.key) setLanguages(params.search.key, params.category.key)
        }

        // 重置搜索
        const handleResetContent = () => {
            if (params.search.key) {
                params.search.key = ''
                setLanguages(params.search.key, params.category.key)
            }
        }

        init()

        const renderEmpty = () => {
            return (
                <div class={styled.empty}>
                    <Empty description={t('global.no-data')} />
                </div>
            )
        }

        // 管理 tabs
        const renderTabs = () => {
            return (
                <Row class={styled.categories}>
                    <div
                        class={[
                            styled.categoriesItem,
                            styled.categoriesCustomize,
                            {
                                [styled.categoriesCustomizeActive]:
                                    params.category.active === 'customize'
                            }
                        ]}
                        onClick={() => handleChangeTab('customize')}>
                        <PlusOutlined />
                        {t('global.customize')}
                        {params.category.active === 'customize' ? (
                            <div
                                class={[
                                    styled.categoriesItemCheck,
                                    styled.categoriesCustomizeCheck
                                ]}>
                                <CheckOutlined />
                            </div>
                        ) : null}
                    </div>
                    <div
                        class={[
                            styled.categoriesItem,
                            styled.categoriesBuiltin,
                            {
                                [styled.categoriesBuiltinActive]:
                                    params.category.active === 'built-in'
                            }
                        ]}
                        onClick={() => handleChangeTab('built-in')}>
                        <FormOutlined />
                        {t('global.system') + t('global.builtin')}
                        {params.category.active === 'built-in' ? (
                            <div
                                class={[styled.categoriesItemCheck, styled.categoriesBuiltinCheck]}>
                                <CheckOutlined />
                            </div>
                        ) : null}
                    </div>
                    <div
                        class={[
                            styled.categoriesItem,
                            styled.categoriesManagement,
                            {
                                [styled.categoriesManagementActive]:
                                    params.category.active === 'management'
                            }
                        ]}
                        onClick={() =>
                            (params.modal.category.management = !params.modal.category.management)
                        }>
                        <GlobalOutlined />
                        {t('language.management')}
                        {params.category.active === 'management' ? (
                            <div
                                class={[
                                    styled.categoriesItemCheck,
                                    styled.categoriesManagementCheck
                                ]}>
                                <CheckOutlined />
                            </div>
                        ) : null}
                    </div>
                </Row>
            )
        }

        // 操作区域 ( 搜索等 )
        const renderAction = () => {
            const searchBtn = (
                <div class={styled.searchLeft}>
                    <div class={styled.searchItem}>
                        <div class={styled.searchItemInput}>
                            <span innerHTML={`${t('global.key')}${t('global.colon')}`}></span>
                            <Input
                                v-model:value={params.search.key}
                                placeholder={t('language.placeholder.search')}
                                onPressEnter={handleSearchContent}
                                onInput={handleSearchInput}
                            />
                        </div>
                        <div class={styled.searchItemBtns}>
                            <Button
                                type="primary"
                                v-slots={{
                                    icon: () => {
                                        return <SearchOutlined />
                                    }
                                }}
                                onClick={handleSearchContent}>
                                {t('global.seek')}
                            </Button>
                            <Button
                                type="primary"
                                v-slots={{
                                    icon: () => {
                                        return <ReloadOutlined />
                                    }
                                }}
                                onClick={handleResetContent}>
                                {t('global.reset')}
                            </Button>
                        </div>
                    </div>
                </div>
            )
            const actionBtn =
                params.category.active === 'customize' ? (
                    <div
                        class={[
                            styled.searchRight,
                            { [styled.searchRightCollapsed]: collapsed.value }
                        ]}>
                        <Popconfirm
                            overlayStyle={{ zIndex: Date.now() }}
                            okText={t('global.ok')}
                            cancelText={t('global.cancel')}
                            onConfirm={setDefaultCategory}
                            v-slots={{
                                title: () => {
                                    return (
                                        <div style={{ maxWidth: $tools.convert2rem(285) }}>
                                            <div innerHTML={t('language.default.tip')}></div>
                                            <div
                                                style={{
                                                    marginTop: $tools.convert2rem(8)
                                                }}>
                                                <span>
                                                    {t('language.current')}
                                                    {t('global.colon')}
                                                </span>
                                                {params.category.types?.[params.category.key] ? (
                                                    <a
                                                        innerHTML={
                                                            params.category.types?.[
                                                                params.category.key
                                                            ]
                                                        }></a>
                                                ) : (
                                                    <a innerHTML={t('language.default.none')}></a>
                                                )}
                                            </div>
                                        </div>
                                    )
                                }
                            }}>
                            <Button type="primary" icon={<CheckOutlined />}>
                                {t('language.default.set')}
                            </Button>
                        </Popconfirm>
                        <Popconfirm
                            overlayStyle={{ zIndex: Date.now() }}
                            okText={t('global.ok')}
                            cancelText={t('global.cancel')}
                            onConfirm={() => handleBatchDeleteContent()}
                            v-slots={{
                                title: () => {
                                    return (
                                        <div style={{ minWidth: $tools.convert2rem(180) }}>
                                            <div innerHTML={t('global.delete.confirm')}></div>
                                        </div>
                                    )
                                }
                            }}>
                            <Button type="primary" icon={<DeleteOutlined />} danger>
                                {t('global.delete.batch')}
                            </Button>
                        </Popconfirm>
                        <Button
                            type="default"
                            class={styled.btnInfo}
                            icon={<EditOutlined />}
                            onClick={handleCreateContentModalState}>
                            {t('language.add')}
                        </Button>
                    </div>
                ) : null
            return (
                <Row class={[styled.search, { [styled.searchCollapsed]: collapsed.value }]}>
                    {searchBtn}
                    {actionBtn}
                </Row>
            )
        }

        // Table - 语系下拉选择列表
        const renderCategorySelection = () => {
            return params.category.data.length > 0 ? (
                <Select
                    v-model:value={params.category.key}
                    onChange={handleChangeCategory}
                    placeholder={t('language.placeholder.select')}
                    style={{ minWidth: $tools.convert2rem(200) }}
                    dropdownStyle={{ zIndex: Date.now() }}>
                    {renderCategorySelectionOptions()}
                </Select>
            ) : (
                <div class={styled.selectAdd}>
                    <span innerHTML={t('language.default.none')}></span>
                    <Button type="primary" onClick={handleCreateCategoryModalState}>
                        {t('global.create')}
                    </Button>
                </div>
            )
        }

        // Table - 内置语系下拉选项
        const renderBuiltinCategorySelection = () => {
            const options = [] as any[]
            for (let i = 0, l = params.table.builtin.options.length; i < l; i++) {
                const cur = params.table.builtin.options[i] as LanguageItemProperties
                options.push(<SelectOption value={cur?.key}>{cur?.language}</SelectOption>)
            }
            return (
                <Select
                    v-model:value={params.table.builtin.current}
                    onChange={handleChangeBuiltinCategory}
                    style={{ minWidth: $tools.convert2rem(140) }}>
                    {options}
                </Select>
            )
        }

        const renderCategorySelectionOptions = () => {
            const options = [] as any[]
            for (let i = 0, l = params.category.data.length; i < l; i++) {
                const cur = params.category.data[i] as LanguageItemProperties
                const elem = cur.is_default ? (
                    <>
                        <span innerHTML={cur.language} />
                        <span> - </span>
                        <a>{t('language.default.name')}</a>
                    </>
                ) : (
                    cur.language
                )
                options.push(<SelectOption value={cur.key}>{elem}</SelectOption>)
            }
            return options
        }

        // 翻译目标语言
        const renderTargetLanguageOptions = () => {
            const options = [] as any[]
            for (const i in params.translate.languages) {
                const cur = params.translate.languages[i]
                options.push(<SelectOption value={i}>{cur}</SelectOption>)
            }
            return options
        }

        // 新增语言内容时, 可选的同步语系分类
        const renderContentSyncCategorySelectionOptions = () => {
            const options = [] as any[]
            for (let i = 0, l = params.category.data.length; i < l; i++) {
                const cur = params.category.data[i] as LanguageItemProperties
                if (cur?.key !== params.category.key) {
                    options.push(<SelectOption value={cur.key}>{cur?.language}</SelectOption>)
                }
            }
            return options
        }

        // 表格
        const renderTable = () => {
            return params.category.active === 'customize' ? (
                <Table
                    columns={params.table.customize.columns}
                    dataSource={params.table.customize.data}
                    rowKey={(record: any) => record?.id}
                    rowSelection={{
                        columnWidth: 60,
                        onChange: (_keys: any[], rows: any[]) => {
                            handleBatchItemChange(rows)
                        }
                    }}
                    pagination={{
                        showLessItems: true,
                        showQuickJumper: true,
                        onChange: handleCustomizePageChange,
                        responsive: true,
                        total: params.total.customize,
                        current: params.table.customize.pagination.page,
                        pageSize: params.table.customize.pagination.size
                    }}
                    bordered={true}
                    loading={params.loading.languages}
                    v-slots={{
                        headerCell: (record: any) => {
                            if (record?.column?.key === 'language') {
                                return renderCategorySelection()
                            }
                        }
                    }}
                    scroll={{ x: 992 }}></Table>
            ) : params.category.active === 'built-in' ? (
                <Table
                    columns={params.table.builtin.columns}
                    dataSource={languages.builtin}
                    bordered={true}
                    pagination={{
                        showLessItems: true,
                        showQuickJumper: true,
                        responsive: true
                    }}
                    v-slots={{
                        headerCell: (record: any) => {
                            if (record.column.key === 'language') {
                                return renderBuiltinCategorySelection()
                            }
                        }
                    }}
                    scroll={{ x: 992 }}></Table>
            ) : null
        }

        // 语系列表
        const renderCategories = () => {
            if (params.category.data.length <= 0) {
                return renderEmpty()
            } else {
                const langs = [] as any[]
                for (let i = 0, l = params.category.data.length; i < l; i++) {
                    const cur = params.category.data[i] as LanguageItemProperties
                    langs.push(
                        <div
                            class={[styled.listItem, { [styled.listItemActive]: cur?.is_default }]}>
                            <span class={styled.listItemName} innerHTML={cur?.language} />
                            <div
                                class={styled.listItemEdit}
                                onClick={() => handleUpdateCategoryModalState(cur)}>
                                <EditOutlined />
                            </div>
                            <Popconfirm
                                title={t('global.delete.confirm')}
                                overlayStyle={{ zIndex: Date.now() }}
                                okText={t('global.ok')}
                                onConfirm={() => handleDeleteCategory(cur)}
                                cancelText={t('global.cancel')}>
                                <span class={styled.listItemClose}>
                                    <CloseCircleFilled />
                                </span>
                            </Popconfirm>
                        </div>
                    )
                }
                return <div class={styled.list}>{langs}</div>
            }
        }

        // 语系列表 - Modal
        const renderCategoriesModal = () => {
            return (
                <MiModal
                    v-model:open={params.modal.category.management}
                    maskClosable={false}
                    width={640}
                    footer={false}
                    animation="flip"
                    title={renderCategoriesTitle()}
                    maskStyle={{ backdropFilter: `blur(0.5rem)` }}>
                    {renderCategories()}
                </MiModal>
            )
        }

        // 语系 Modal Title
        const renderCategoriesTitle = () => {
            return (
                <>
                    <span
                        innerHTML={t('language.management')}
                        style={{
                            marginRight: $tools.convert2rem(16),
                            marginTop: $tools.convert2rem(2)
                        }}
                    />
                    <Button type="primary" onClick={handleCreateCategoryModalState}>
                        {t('language.create')}
                    </Button>
                </>
            )
        }

        // 新增语系种类 - Form Modal
        const renderCreateOrUpdateCategoryFormModal = () => {
            return (
                <MiModal
                    v-model:open={params.modal.category.create}
                    title={params.form.category.edit ? t('language.update') : t('language.create')}
                    maskClosable={false}
                    animation="flip"
                    footerBtnPosition="center"
                    maskStyle={{ backdropFilter: `blur(0.5rem)` }}
                    onCancel={handleCancelCategoryModalState}
                    onOk={handleCreateOrUpdateCategory}
                    destroyOnClose={true}
                    loading={params.loading.createOrUpdate}>
                    <Form
                        ref={categoryFormRef}
                        labelCol={{ style: { width: $tools.convert2rem(146) } }}
                        model={params.form.category.validate}
                        rules={params.form.category.rules}>
                        <FormItem label={t('language.default.setting')} name="is_default">
                            <RadioGroup
                                options={params.form.category.options}
                                v-model:value={params.form.category.validate.is_default}
                                disabled={params.loading.createOrUpdate}
                            />
                        </FormItem>
                        <FormItem
                            name="key"
                            v-slots={{
                                label: () => {
                                    return (
                                        <>
                                            <span style={{ marginRight: $tools.convert2rem(4) }}>
                                                {t('language.key')}
                                            </span>
                                            <Tooltip
                                                overlayStyle={{ zIndex: Date.now() }}
                                                v-slots={{
                                                    title: () => {
                                                        return (
                                                            <div
                                                                innerHTML={t(
                                                                    'language.key-tip'
                                                                )}></div>
                                                        )
                                                    }
                                                }}>
                                                <span class={styled.formTip}>
                                                    <ExclamationCircleOutlined />
                                                </span>
                                            </Tooltip>
                                        </>
                                    )
                                }
                            }}>
                            <Input
                                name="key"
                                v-model:value={params.form.category.validate.key}
                                maxlength={64}
                                autocomplete="off"
                                placeholder={t('language.placeholder.language.key')}
                                onPressEnter={handleCreateOrUpdateCategory}
                                disabled={params.loading.createOrUpdate}
                            />
                        </FormItem>
                        <FormItem label={t('language.display')} name="language">
                            <Input
                                name="language"
                                v-model:value={params.form.category.validate.language}
                                maxlength={64}
                                autocomplete="off"
                                placeholder={t('language.placeholder.language.display')}
                                onPressEnter={handleCreateOrUpdateCategory}
                                disabled={params.loading.createOrUpdate}
                            />
                        </FormItem>
                        <FormItem
                            v-slots={{
                                label: () => {
                                    return (
                                        <>
                                            <span style={{ marginRight: $tools.convert2rem(4) }}>
                                                {t('language.translate.auto')}
                                            </span>
                                            <Tooltip
                                                overlayStyle={{ zIndex: Date.now() }}
                                                v-slots={{
                                                    title: () => {
                                                        return (
                                                            <div
                                                                innerHTML={t(
                                                                    'language.translate.tip'
                                                                )}></div>
                                                        )
                                                    }
                                                }}>
                                                <span class={styled.formTip}>
                                                    <ExclamationCircleOutlined />
                                                </span>
                                            </Tooltip>
                                        </>
                                    )
                                }
                            }}>
                            <RadioGroup
                                options={params.form.category.options}
                                v-model:value={params.translate.form.translate}
                                disabled={params.loading.createOrUpdate}
                            />
                        </FormItem>
                        <FormItem
                            v-slots={{
                                label: () => {
                                    return (
                                        <>
                                            <span style={{ marginRight: $tools.convert2rem(4) }}>
                                                {t('language.translate.target')}
                                            </span>
                                            <Tooltip
                                                overlayStyle={{ zIndex: Date.now() }}
                                                v-slots={{
                                                    title: () => {
                                                        return (
                                                            <div
                                                                innerHTML={t(
                                                                    'language.translate.explain'
                                                                )}></div>
                                                        )
                                                    }
                                                }}>
                                                <span class={styled.formTip}>
                                                    <ExclamationCircleOutlined />
                                                </span>
                                            </Tooltip>
                                        </>
                                    )
                                }
                            }}>
                            <Select
                                v-model:value={params.translate.form.target}
                                placeholder={t('language.placeholder.language.active')}
                                style={{ width: '100%' }}
                                dropdownStyle={{ zIndex: Date.now() }}
                                disabled={params.loading.createOrUpdate}>
                                {renderTargetLanguageOptions()}
                            </Select>
                        </FormItem>
                    </Form>
                </MiModal>
            )
        }

        // 新增单个语系的配置内容 - Form Modal
        const renderCreateOrUpdateContentFormModal = () => {
            return (
                <MiModal
                    v-model:open={params.modal.content}
                    title={
                        params.form.content.edit
                            ? t('language.content.update')
                            : t('language.content.create')
                    }
                    maskClosable={false}
                    footerBtnPosition="center"
                    maskStyle={{ backdropFilter: `blur(0.5rem)` }}
                    onCancel={handleCancelCreateContentModalState}
                    onOk={handleCreateOrUpdateContent}
                    destroyOnClose={true}>
                    <Form
                        ref={contentFormRef}
                        labelCol={{ style: { width: $tools.convert2rem(124) } }}
                        model={params.form.content.validate}
                        rules={params.form.content.rules}>
                        <FormItem label={t('language.current')}>
                            {params.category.types?.[params.category.key] ? (
                                <a innerHTML={params.category.types?.[params.category.key]}></a>
                            ) : (
                                <div class={styled.selectAdd}>
                                    <span innerHTML={t('language.default.none')}></span>
                                    <Button type="primary" onClick={handleCreateCategoryModalState}>
                                        {t('global.create')}
                                    </Button>
                                </div>
                            )}
                        </FormItem>
                        <FormItem
                            name="key"
                            v-slots={{
                                label: () => {
                                    return (
                                        <>
                                            <span style={{ marginRight: $tools.convert2rem(4) }}>
                                                {t('language.content.key')}
                                            </span>
                                            <Tooltip
                                                overlayStyle={{ zIndex: Date.now() }}
                                                v-slots={{
                                                    title: () => {
                                                        return (
                                                            <div
                                                                innerHTML={t(
                                                                    'language.key-tip'
                                                                )}></div>
                                                        )
                                                    }
                                                }}>
                                                <span class={styled.formTip}>
                                                    <ExclamationCircleOutlined />
                                                </span>
                                            </Tooltip>
                                        </>
                                    )
                                }
                            }}>
                            <Input
                                v-model:value={params.form.content.validate.key}
                                maxlength={64}
                                autocomplete="off"
                                placeholder={t('language.placeholder.config.key')}
                                disabled={!params.category.types?.[params.category.key]}
                            />
                        </FormItem>
                        <FormItem label={t('language.content.content')} name="language">
                            <Textarea
                                v-model:value={params.form.content.validate.language}
                                autoSize={{ minRows: 4, maxRows: 8 }}
                                placeholder={t('language.placeholder.config.value')}
                                disabled={!params.category.types?.[params.category.key]}
                            />
                        </FormItem>
                        <FormItem label={t('language.content.status')} name="status">
                            <RadioGroup
                                options={params.form.content.options.status}
                                v-model:value={params.form.content.validate.status}
                            />
                        </FormItem>
                        {params.form.content.edit ? null : (
                            <FormItem
                                name="sync"
                                v-slots={{
                                    label: () => {
                                        return (
                                            <>
                                                <span
                                                    style={{ marginRight: $tools.convert2rem(4) }}>
                                                    {t('language.content.sync.label')}
                                                </span>
                                                <Tooltip
                                                    overlayStyle={{ zIndex: Date.now() }}
                                                    v-slots={{
                                                        title: () => {
                                                            return (
                                                                <div
                                                                    innerHTML={t(
                                                                        'language.content.sync.tip'
                                                                    )}></div>
                                                            )
                                                        }
                                                    }}>
                                                    <span class={styled.formTip}>
                                                        <ExclamationCircleOutlined />
                                                    </span>
                                                </Tooltip>
                                            </>
                                        )
                                    }
                                }}>
                                <RadioGroup
                                    options={params.form.content.options.sync}
                                    v-model:value={params.form.content.validate.sync}
                                />
                            </FormItem>
                        )}
                        {params.form.content.validate.sync === 2 ? (
                            <FormItem label={t('language.content.sync.select')} name="langs">
                                {params.category.data.length > 0 ? (
                                    <Select
                                        v-model:value={params.form.content.validate.langs}
                                        mode="multiple"
                                        placeholder={t('language.placeholder.select')}
                                        style={{ minWidth: $tools.convert2rem(220) }}
                                        dropdownStyle={{ zIndex: Date.now() }}>
                                        {renderContentSyncCategorySelectionOptions()}
                                    </Select>
                                ) : (
                                    <div class={styled.selectAdd}>
                                        <span innerHTML={t('language.default.none')}></span>
                                        <Button
                                            type="primary"
                                            onClick={handleCreateCategoryModalState}>
                                            {t('global.create')}
                                        </Button>
                                    </div>
                                )}
                            </FormItem>
                        ) : null}
                    </Form>
                </MiModal>
            )
        }

        return () => (
            <div class={styled.container}>
                <ConfigProvider
                    locale={props.paginationLocale ?? zhCN}
                    renderEmpty={() => renderEmpty()}>
                    {renderTabs()}
                    {renderAction()}
                    {renderTable()}
                    {renderCategoriesModal()}
                    {renderCreateOrUpdateCategoryFormModal()}
                    {renderCreateOrUpdateContentFormModal()}
                </ConfigProvider>
            </div>
        )
    }
})

export default MiAppsLanguage
