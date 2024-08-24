import { defineComponent, reactive, ref } from 'vue'
import { LanguageItemProperties, LanguageProps } from './props'
import { useI18n } from 'vue-i18n'
import { $g } from '../../../utils/global'
import { $tools } from '../../../utils/tools'
import { $request } from '../../../utils/request'
import { type ResponseData } from '../../../utils/types'
import {
    ConfigProvider,
    message,
    Empty,
    Row,
    Col,
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
    Tooltip
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
    WarningOutlined
} from '@ant-design/icons-vue'
import MiModal from '../../modal/Modal'
import zhCN from 'ant-design-vue/es/locale/zh_CN'
import applyTheme from '../../_utils/theme'
import styled from './style/language.module.less'

const MiAppsLanguage = defineComponent({
    name: 'MiAppsLanguage',
    inheritAttrs: false,
    props: LanguageProps(),
    emits: ['afterGetLanguage', 'afterGetCategory', 'afterCreateCategory', 'afterUpdateCategory'],
    setup(props, { emit }) {
        const { messages, locale, t } = useI18n()
        const languages = reactive({
            builtin: [] as LanguageItemProperties[],
            customize: [] as LanguageItemProperties[]
        })
        const languageFormRef = ref<FormInstance>()

        // 检验- 语系 key 值
        const checkCategoryKeyValidate = async (_rule: any, value: string) => {
            if (!value) return Promise.reject(t('language.error.key.empty'))
            if (props.checkCategoryExistAction) {
                const categoryParams = Object.assign(
                    {},
                    {
                        id: params.form.category.id,
                        key: params.form.category.validate.key,
                        edit: params.form.category.edit ? 1 : 0
                    },
                    { ...props.checkCategoryExistParams }
                )
                if (typeof props.checkCategoryExistAction === 'string') {
                    return await $request[props.checkCategoryExistMethod](
                        props.checkCategoryExistAction,
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
                    const response = await props.checkCategoryExistAction()
                    if (typeof response === 'string') return Promise.reject(response)
                    return Promise.resolve()
                }
            } else return Promise.resolve()
        }

        const checkLanguageKeyValidate = async (_rule: any, value: string) => {
            if (!value) return Promise.reject(t('language.placeholder.config.key'))
        }

        const params = reactive({
            loading: {
                languages: false,
                categories: false,
                createOrUpdate: false
            },
            total: {
                builtin: 0,
                customize: 0
            },
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
                            title: t('global.action'),
                            key: 'action',
                            align: 'center',
                            width: 180,
                            customRender: (record: any) => {
                                return (
                                    <div class={styled.actionBtns}>
                                        <Button type="primary" icon={<FormOutlined />} class="edit">
                                            {t('edit')}
                                        </Button>
                                        <Popconfirm
                                            title={t('delete-confirm')}
                                            style={{ zIndex: Date.now() }}
                                            okText={t('ok')}
                                            cancelText={t('cancel')}
                                            okButtonProps={{
                                                onClick: () => {}
                                            }}
                                            key={record.record.key}>
                                            <Button
                                                type="primary"
                                                danger={true}
                                                icon={<DeleteOutlined />}>
                                                {t('delete')}
                                            </Button>
                                        </Popconfirm>
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
                    columns: [] as any[],
                    pagination: {
                        page: 1,
                        size: 10
                    }
                }
            },
            search: { lang: 'zh-cn', key: '' },
            form: {
                config: {
                    id: 0,
                    edit: {
                        temp: '',
                        state: false
                    },
                    validate: { key: '', language: '' },
                    rules: {
                        key: [
                            {
                                required: true,
                                validator: checkLanguageKeyValidate,
                                trigger: 'blur'
                            }
                        ],
                        language: [
                            { required: true, message: t('language.placeholder.config.value') }
                        ]
                    }
                },
                category: {
                    id: 0,
                    edit: false,
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
                    update: false
                }
            }
        })
        applyTheme(styled)

        // 初始化
        const initLanguages = () => {
            getBuiltinLanguages(messages.value?.[locale.value])
            setLanguages()
            setCategory()
        }

        // 获取语言内容
        const getLanguages = async (keyword?: string, lang?: string) => {
            if (typeof props.getLanguageAction) {
                if (params.loading.languages) return
                params.loading.languages = true
                const condition = Object.assign(
                    { keyword },
                    { ...params.table.customize.pagination },
                    { lang },
                    props.getLanguageParams
                )
                if (typeof props.getLanguageAction === 'string') {
                    $request[props.getLanguageMethod](props.getLanguageAction, condition)
                        .then((res: ResponseData | any) => {
                            if (res?.ret?.code === 200) {
                                languages.customize = res?.data || []
                                params.total.customize = res?.total || 0
                            } else if (res?.ret?.message) message.error(res?.ret?.message)
                            emit('afterGetLanguage', res)
                        })
                        .catch((err: any) => message.error(err?.message || err))
                        .finally(() => (params.loading.languages = false))
                } else if (typeof props.getLanguageAction === 'function') {
                    const response = await props.getLanguageAction(condition)
                    if (typeof response === 'string') message.error(response)
                    params.loading.languages = false
                } else params.loading.languages = false
            }
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
        const getCategory = async () => {
            if (typeof props.getCategoryAction) {
                if (params.loading.categories) return
                params.loading.categories = true
                if (typeof props.getCategoryAction === 'string') {
                    $request[props.getCategoryMethod](
                        props.getCategoryAction,
                        props.getCategoryParams
                    )
                        .then((res: ResponseData | any) => {
                            if (res?.ret?.code === 200) {
                                params.category.data = res?.data
                                for (let i = 0, l = res?.data?.length; i < l; i++) {
                                    const category = res?.data[i]
                                    params.category.types[category?.key] = category?.id
                                    params.category.ids[category?.key] = category?.id
                                    if (category?.is_default) params.category.current = category?.id
                                }
                            } else if (res?.ret?.message) message.error(res?.ret?.message)
                            emit('afterGetCategory', res)
                        })
                        .catch((err: any) => message.error(err?.message || err))
                        .finally(() => (params.loading.categories = false))
                } else if (typeof props.getCategoryAction === 'function') {
                    const response = await props.getCategoryAction()
                    params.loading.categories = false
                    if (typeof response === 'string') message.error(response)
                } else params.loading.categories = false
            }
        }

        // 设置语系分类
        const setCategory = () => {
            if (props.category && props.category.length > 0) params.category.data = props.category
            else getCategory()
        }

        const handleCustomizePageChange = () => {}

        // 新增语系配置内容 - Modal State
        const handleCreateLanguageModalState = () => {
            params.form.category.id = 0
            params.form.category.edit = false
            params.modal.category.management = false
            params.modal.category.create = true
        }

        // 取消新增语系配置内容 ( 回到语系列表 Modal  ) - Modal State
        const handleCancelCategoryModalState = () => {
            params.modal.category.management = true
            params.modal.category.create = false
            params.form.category.id = 0
            params.form.category.edit = false
            params.form.category.validate = { key: '', language: '', is_default: 0 }
            if (languageFormRef.value) languageFormRef.value?.clearValidate()
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

        // 新增 / 更新语系
        const handleCreateOrUpdateCategory = () => {
            if (languageFormRef.value) {
                if (params.loading.createOrUpdate) return
                params.loading.createOrUpdate = true
                // 默认成功处理
                const handleDefaultAfterSucess = () => {
                    message.success(t('global.success'))
                    handleCancelCategoryModalState()
                    getCategory()
                    languageFormRef.value?.resetFields()
                }
                // 自定义请求方式的处理
                const handleCustomAfterSuccess = (response: any) => {
                    if (typeof response === 'boolean' && response) {
                        params.form.category.edit = false
                        handleCancelCategoryModalState()
                        languageFormRef.value?.resetFields()
                    } else if (typeof response === 'string') message.error(response)
                    params.loading.createOrUpdate = false
                }
                languageFormRef.value.validate().then(async () => {
                    if (params.form.category.edit) {
                        // 编辑
                        if (props.updateCategoryAction) {
                            const updateParams = Object.assign(
                                { ...params.form.category.validate },
                                { ...props.updateCategoryParams }
                            )
                            if (typeof props.updateCategoryAction === 'string') {
                                $request[props.updateCategoryMethod](
                                    $tools.replaceUrlParams(props.updateCategoryAction, {
                                        id: params.form.category.id
                                    }),
                                    updateParams
                                )
                                    .then((res: ResponseData | any) => {
                                        params.form.category.edit = false
                                        if (res?.ret?.code === 200) {
                                            handleDefaultAfterSucess()
                                        } else if (res?.ret?.message) {
                                            params.form.category.edit = true
                                            message.error(res?.ret?.message)
                                        }
                                        emit('afterUpdateCategory', res)
                                    })
                                    .catch((err: any) => message.error(err?.message || err))
                                    .finally(() => (params.loading.createOrUpdate = false))
                            } else if (typeof props.updateCategoryAction === 'function') {
                                const response = await props.updateCategoryAction(
                                    Object.assign(updateParams, { ...params.translate.form })
                                )
                                handleCustomAfterSuccess(response)
                            }
                        }
                    } else {
                        // 新增
                        if (props.createCategoryAction) {
                            const createParams = Object.assign(
                                { ...params.form.category.validate },
                                { ...props.createCategoryParams }
                            )
                            if (typeof props.createCategoryAction === 'string') {
                                $request[props.createCategoryMethod](
                                    props.createCategoryAction,
                                    createParams
                                )
                                    .then((res: ResponseData | any) => {
                                        if (res?.ret?.code === 200) {
                                            handleDefaultAfterSucess()
                                            if (params.translate.form.translate)
                                                handleAutomaticTranslate(res)
                                        } else if (res?.ret?.message)
                                            message.error(res?.ret?.message)
                                        emit('afterCreateCategory', res)
                                    })
                                    .catch((err: any) => message.error(err?.message || err))
                                    .finally(() => (params.loading.createOrUpdate = false))
                            } else if (typeof props.createCategoryAction === 'function') {
                                const response = await props.createCategoryAction(
                                    Object.assign(createParams, { ...params.translate.form })
                                )
                                handleCustomAfterSuccess(response)
                            }
                        }
                    }
                })
            }
        }

        const handleCreateLanguageCustomizeModalState = () => {}

        // 自动翻译
        const handleAutomaticTranslate = async (res?: ResponseData | any) => {
            console.log(res)
        }

        initLanguages()

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
                        onClick={() => (params.category.active = 'customize')}>
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
                        onClick={() => (params.category.active = 'built-in')}>
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
                <Col xs={24} md={params.category.active === 'customize' ? 14 : 24}>
                    <div class={styled.searchLeft}>
                        <div class={styled.searchItem}>
                            <div class={styled.searchItemInput}>
                                <span innerHTML={`${t('global.key')}${t('global.colon')}`}></span>
                                <Input placeholder={t('language.placeholder.search')} />
                            </div>
                            <div class={styled.searchItemBtns}>
                                <Button
                                    type="primary"
                                    v-slots={{
                                        icon: () => {
                                            return <SearchOutlined />
                                        }
                                    }}>
                                    {t('global.seek')}
                                </Button>
                                <Button
                                    type="primary"
                                    v-slots={{
                                        icon: () => {
                                            return <ReloadOutlined />
                                        }
                                    }}>
                                    {t('global.reset')}
                                </Button>
                            </div>
                        </div>
                    </div>
                </Col>
            )
            const actionBtn =
                params.category.active === 'customize' ? (
                    <Col xs={24} md={10}>
                        <div class={styled.searchRight}>
                            <ConfigProvider theme={{ token: { colorPrimary: '#d89614' } }}>
                                <Popconfirm
                                    overlayStyle={{ zIndex: Date.now() }}
                                    v-slots={{
                                        title: () => {
                                            return (
                                                <div style={{ maxWidth: $tools.convert2rem(285) }}>
                                                    <div
                                                        innerHTML={t('language.default.tip')}></div>
                                                    <div
                                                        style={{
                                                            marginTop: $tools.convert2rem(8)
                                                        }}>
                                                        <span>
                                                            {t('language.current')}
                                                            {t('global.colon')}
                                                        </span>
                                                        {params.category.types[
                                                            params.category.current
                                                        ] ? (
                                                            <Button type="primary">
                                                                {
                                                                    params.category.types[
                                                                        params.category.current
                                                                    ]
                                                                }
                                                            </Button>
                                                        ) : (
                                                            <a
                                                                innerHTML={t(
                                                                    'language.default.none'
                                                                )}></a>
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
                            </ConfigProvider>
                            <ConfigProvider theme={{ token: { colorPrimary: '#dc4446' } }}>
                                <Popconfirm
                                    overlayStyle={{ zIndex: Date.now() }}
                                    v-slots={{
                                        title: () => {
                                            return (
                                                <div style={{ minWidth: $tools.convert2rem(180) }}>
                                                    <div
                                                        innerHTML={t(
                                                            'global.delete.confirm'
                                                        )}></div>
                                                </div>
                                            )
                                        }
                                    }}>
                                    <Button type="primary" icon={<DeleteOutlined />} danger>
                                        {t('global.delete.batch')}
                                    </Button>
                                </Popconfirm>
                            </ConfigProvider>
                            <ConfigProvider theme={{ token: { colorPrimary: '#07928f' } }}>
                                <Button
                                    type="primary"
                                    icon={<EditOutlined />}
                                    onClick={handleCreateLanguageCustomizeModalState}>
                                    {t('language.add')}
                                </Button>
                            </ConfigProvider>
                        </div>
                    </Col>
                ) : null
            return (
                <Row class={styled.search}>
                    {searchBtn}
                    {actionBtn}
                </Row>
            )
        }

        // Table - 语系下拉选择列表
        const renderLanguageSelection = () => {
            return params.category.data.length > 0 ? (
                <Select
                    v-model:value={params.category.key}
                    placeholder={t('language.placeholder.select')}
                    style={{ minWidth: $tools.convert2rem(220) }}>
                    {renderLanguageSelectionOptions()}
                </Select>
            ) : (
                <div class="">
                    <span innerHTML={t('language.default.none')}></span>
                    <Button type="primary">{t('global.create')}</Button>
                </div>
            )
        }

        const renderLanguageSelectionOptions = () => {
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

        // 表格
        const renderTable = () => {
            return params.category.active === 'customize' ? (
                <Table
                    columns={params.table.customize.columns}
                    dataSource={params.table.customize.data}
                    rowKey={(record: any) => record?.id}
                    rowSelection={{
                        columnWidth: 60,
                        onChange: (keys: any[], rows: any[]) => {
                            console.log(keys, rows)
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
                                return renderLanguageSelection()
                            }
                        }
                    }}
                    scroll={{ x: 768 }}></Table>
            ) : params.category.active === 'built-in' ? (
                <Table></Table>
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
                                onConfirm={() => {}}
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
                    <Button type="primary" onClick={handleCreateLanguageModalState}>
                        {t('language.add-language')}
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
                    destroyOnClose={true}>
                    <Form
                        ref={languageFormRef}
                        labelCol={{ style: { width: $tools.convert2rem(146) } }}
                        model={params.form.category.validate}
                        rules={params.form.category.rules}>
                        <FormItem label={t('language.default.setting')} name="is_default">
                            <RadioGroup
                                options={params.form.category.options}
                                v-model:value={params.form.category.validate.is_default}
                            />
                        </FormItem>
                        <FormItem label={t('language.key')} name="key">
                            <Input
                                name="key"
                                v-model:value={params.form.category.validate.key}
                                maxlength={64}
                                autocomplete="off"
                                placeholder={t('language.placeholder.language.key')}
                            />
                        </FormItem>
                        <FormItem label={t('language.display')} name="language">
                            <Input
                                name="language"
                                v-model:value={params.form.category.validate.language}
                                maxlength={64}
                                autocomplete="off"
                                placeholder={t('language.placeholder.language.display')}
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
                                                    <WarningOutlined />
                                                </span>
                                            </Tooltip>
                                        </>
                                    )
                                }
                            }}>
                            <RadioGroup
                                options={params.form.category.options}
                                v-model:value={params.translate.form.translate}
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
                                                    <WarningOutlined />
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
                                dropdownStyle={{ zIndex: Date.now() }}>
                                {renderTargetLanguageOptions()}
                            </Select>
                        </FormItem>
                    </Form>
                </MiModal>
            )
        }

        // 新增单个语系的配置内容 - Form Modal
        const renderCreateOrUpdateLanguageFormModal = () => {}

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
                    {renderCreateOrUpdateLanguageFormModal()}
                </ConfigProvider>
            </div>
        )
    }
})

export default MiAppsLanguage
