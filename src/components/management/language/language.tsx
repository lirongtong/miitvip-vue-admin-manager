import { defineComponent, reactive, ref, inject } from 'vue'
import { useI18n } from 'vue-i18n'
import { getPrefixCls } from '../../../components/_utils/props-tools'
import { languageProps, LanguageFormState } from './props'
import {
    Table,
    InputSearch,
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
    FormInstance
} from 'ant-design-vue'
import {
    FormOutlined,
    DeleteOutlined,
    EditOutlined,
    CloseCircleFilled
} from '@ant-design/icons-vue'
import { $storage } from '../../../utils/storage'
import { $g } from '../../../utils/global'
import { $tools } from '../../../utils/tools'
import MiModal from '../../modal'
import { $request } from '../../../utils/request'
import { Rule } from 'ant-design-vue/es/form'

export default defineComponent({
    name: 'MiLanguageManagement',
    inheritAttrs: false,
    props: languageProps(),
    setup(props) {
        const { locale, t } = useI18n()
        const i18n = inject('$i18n') as any
        let languages = reactive<LanguageFormState[]>([])
        const prefixCls = getPrefixCls('language', props.prefixCls)
        const btnCls = getPrefixCls('btn', props.prefixCls)
        const formCls = getPrefixCls('form', props.prefixCls)
        const formRef = ref<FormInstance>()
        const addOrUpdateFormRef = ref<FormInstance>()

        const checkLanguageCateogryKeyValidate = (_rule: Rule, value: string) => {
            if (!value) return Promise.reject(t('language.error.key.empty'))
            const categories = $storage.get($g.caches.storages.languages.categories) || []
            if (categories[value]) return Promise.reject(t('language.error.key.exist'))
            else return Promise.resolve()
        }

        const checkLanguageConfigurationKeyValidate = async (_rule: Rule, value: string) => {
            if (!value) return Promise.reject(t('language.placeholder.config.key'))
            if (props.checkLanguageKeyExist.url) {
                return await $request[
                    (props.checkLanguageKeyExist.method || 'GET').toLocaleLowerCase()
                ](
                    props.checkLanguageKeyExist.url,
                    Object.assign(
                        {},
                        { ...params.addOrUpdateForm.validate, edit: params.isEdit },
                        props.checkLanguageKeyExist.params
                    )
                )
                    .then((res: any) => {
                        if (res.ret.code === 200) return Promise.resolve()
                        else return Promise.reject(res.ret.message)
                    })
                    .catch((err: any) => {
                        return Promise.reject(err.message)
                    })
            } else return Promise.resolve()
        }

        const params = reactive({
            loading: false,
            pagination: {
                page: 1,
                size: 10
            },
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
                        align: 'left'
                    },
                    {
                        title: t('opt'),
                        key: 'action',
                        align: 'right',
                        minWidth: 150,
                        customRender: (record: any) => {
                            return (
                                <div class={`${prefixCls}-table-btns`}>
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
                data: [] as LanguageFormState[]
            },
            visible: {
                update: false,
                management: false,
                create: false
            },
            current: $g.locale,
            storageKey: `${$g.caches.storages.languages.custom}-${$g.locale}`,
            defaultCategories: [
                { key: 'zh-cn', language: t('language.zh-cn') },
                { key: 'en-us', language: t('language.en-us') }
            ] as LanguageFormState[],
            categories: [] as LanguageFormState[],
            id: 0,
            isEdit: false,
            form: {
                validate: {
                    key: null,
                    language: null
                },
                rules: {
                    key: [{ required: true, validator: checkLanguageCateogryKeyValidate }],
                    language: [{ required: true, message: t('language.error.language') }]
                },
                editTempKey: ''
            },
            addOrUpdateForm: {
                editTempKey: '',
                validate: {
                    key: '',
                    language: ''
                },
                rules: {
                    key: [{ required: true, validator: checkLanguageConfigurationKeyValidate }],
                    language: [{ required: true, message: t('language.placeholder.config.value') }]
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
                params.table.loading = true
                const condition = Object.assign(
                    {},
                    keyword,
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
                        if (res.ret.code === 200) {
                            languages = res.data
                            if (props.data.callback) props.data.callback(res.data)
                        } else message.error(res.ret.message)
                    })
                    .catch((err: any) => {
                        params.table.loading = false
                        message.error(err.message)
                    })
            }
        }

        // category is changed.
        const changLanguageCategory = (lang: any) => {
            languages = [] as LanguageFormState[]
            params.current = lang
            params.storageKey = `${$g.caches.storages.languages.custom}-${lang}`
            setLanguageConfigurationList('', lang)
            params.table.data = languages
        }

        // modal - create category
        const createLanguageCategoryVisible = () => {
            params.isEdit = false
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
                    language: data?.language
                }
            } else params.form.validate = { key: '', language: '' }
        }

        // cancel modal - category
        const cancelLanguageCategoryVisible = () => {
            params.visible.management = true
            params.visible.create = false
            params.isEdit = false
            params.form.validate = { key: '', language: '' }
        }

        // category
        const getLanguageCategory = () => {
            if (props.category.url) {
                params.loading = true
                $request[(props.category.method || 'GET').toLowerCase()](
                    props.category.url,
                    props.category.params || {}
                )
                    .then((res: any) => {
                        params.loading = false
                        if (res.ret.code === 200) {
                            params.categories = res.data
                            if (props.category.callback) props.category.callback(res.data)
                        } else message.error(res.ret.message)
                    })
                    .catch((err: any) => {
                        params.loading = false
                        message.error(err.message)
                    })
            }
        }

        // action - create or update category.
        const createOrUpdateLanguageCategory = () => {
            if (formRef.value && formRef.value) {
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
                                        props.updateCategory.params
                                    )
                                )
                                    .then((res: any) => {
                                        params.loading = false
                                        if (res.ret.code === 200) {
                                            params.isEdit = false
                                            cancelLanguageCategoryVisible()
                                            getLanguageCategory()
                                            if (props.updateCategory.callback)
                                                props.updateCategory.callback()
                                            message.success(t('success'))
                                        } else message.error(res.ret.message)
                                    })
                                    .catch((err: any) => {
                                        params.loading = false
                                        message.error(err.message)
                                    })
                            }
                        } else {
                            // create
                            if (props.createCategory.url) {
                                const query = Object.assign(
                                    {},
                                    params.pagination,
                                    props.createCategory.params || {},
                                    { ...params.form.validate }
                                )
                                $request[(props.createCategory.method || 'POST').toLowerCase()](
                                    props.createCategory.url,
                                    query
                                )
                                    .then((res: any) => {
                                        params.loading = false
                                        if (res.ret.code === 200) {
                                            message.success(t('success'))
                                            cancelLanguageCategoryVisible()
                                            getLanguageCategory()
                                            if (formRef.value && formRef.value)
                                                formRef.value.resetFields()
                                            if (props.createCategory.callback)
                                                props.createCategory.callback()
                                        } else message.error(res.ret.message)
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
                        if (res.ret.code === 200) {
                            message.success(t('success'))
                            getLanguageCategory()
                        } else message.error(res.ret.message)
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

        const createOrUpdateLanguageConfiguration = () => {
            if (addOrUpdateFormRef.value && addOrUpdateFormRef.value) {
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
                            if (props.updateLanguage.url) {
                                $request[(props.updateLanguage.method || 'PUT').toLowerCase()](
                                    $tools.replaceUrlParams(props.updateLanguage.url, {
                                        id: params.id
                                    }),
                                    Object.assign(
                                        {},
                                        { ...params.addOrUpdateForm.validate },
                                        props.updateLanguage.params
                                    )
                                )
                                    .then((res: any) => {
                                        params.loading = false
                                        if (res.ret.code === 200) {
                                            params.isEdit = false
                                            params.id = 0
                                            params.visible.update = !params.visible.update
                                            afterAction()
                                            if (props.updateLanguage.callback)
                                                props.updateLanguage.callback()
                                        } else message.error(res.ret.message)
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
                                        props.createLanguage.params
                                    )
                                )
                                    .then((res: any) => {
                                        params.loading = false
                                        if (res.ret.code === 200) {
                                            createLanguageConfigurationVisible()
                                            afterAction()
                                            if (props.createLanguage.callback)
                                                props.createLanguage.callback()
                                        } else message.error(res.ret.message)
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
                        if (res.ret.code === 200) {
                            message.success(t('success'))
                            setLanguageConfigurationList('', params.current)
                        } else message.error(res.ret.message)
                    })
                    .catch((err: any) => {
                        params.loading = false
                        message.error(err.message)
                    })
            }
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
            params.pagination.page = page
            params.pagination.size = size
            if (props.data.url) setLanguageConfigurationList()
        }

        initLanguageConfiguration()

        // render
        const renderLanguageSelection = () => {
            const options = [] as any[]
            for (let i = 0, l = params.categories.length; i < l; i++) {
                const cur = params.categories[i] as LanguageFormState
                options.push(<SelectOption value={cur.key}>{cur.language}</SelectOption>)
            }
            return (
                <Select
                    v-model:value={params.current}
                    onChange={changLanguageCategory}
                    style={{ minWidth: $tools.convert2Rem(120) }}>
                    {options}
                </Select>
            )
        }

        const renderLanguageTags = () => {
            const langs = [] as any[]
            for (let i = 0, l = params.categories.length; i < l; i++) {
                const cur = params.categories[i] as LanguageFormState
                const close =
                    i > 1 ? (
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
                    ) : null
                const edit =
                    i > 1 ? (
                        <div
                            class={`${prefixCls}-cate-edit`}
                            onClick={() => updateLanguageCategoryVisible(cur)}>
                            <EditOutlined />
                        </div>
                    ) : null
                langs.push(
                    <div class={`${prefixCls}-cate`}>
                        <span class={`${prefixCls}-cate-name`} innerHTML={cur.language} />
                        {edit}
                        {close}
                    </div>
                )
            }
            return <div class={`${prefixCls}-cates`}>{langs}</div>
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
                    onCancel={cancelLanguageCategoryVisible}
                    onOk={createOrUpdateLanguageCategory}
                    footerBtnPosition="center">
                    <Form
                        class={`${formCls} ${formCls}-theme`}
                        labelCol={{ style: { width: $tools.convert2Rem(96) } }}
                        model={params.form.validate}
                        rules={params.form.rules}
                        ref={formRef}>
                        <FormItem label={t('key')} name="key">
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
                    onOk={createOrUpdateLanguageConfiguration}
                    footerBtnPosition="center">
                    <Form
                        class={`${formCls} ${formCls}-theme`}
                        model={params.addOrUpdateForm.validate}
                        rules={params.addOrUpdateForm.rules}
                        ref={addOrUpdateFormRef}>
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
            return (
                <div class={`${prefixCls}-btns`}>
                    <div class={`${prefixCls}-btns-l`}>
                        <Button
                            type="primary"
                            danger={true}
                            style={{ marginRight: $tools.convert2Rem(8) }}>
                            {t('delete')}
                        </Button>
                        <Button
                            type="primary"
                            class={`${btnCls}-info`}
                            onClick={createLanguageConfigurationVisible}>
                            {t('language.add')}
                        </Button>
                    </div>
                    <div class={`${prefixCls}-btns-r`}>
                        <Button
                            type="primary"
                            onClick={() =>
                                (params.visible.management = !params.visible.management)
                            }>
                            {t('language.management')}
                        </Button>
                    </div>
                </div>
            )
        }

        const renderTable = () => {
            return (
                <div class={`${prefixCls}-table`}>
                    <ConfigProvider locale={props.paginationLocale}>
                        <Table
                            columns={params.table.columns}
                            dataSource={params.table.data}
                            pagination={{ showQuickJumper: true, onChange: changePagination }}
                            rowSelection={{}}
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
                    </ConfigProvider>
                </div>
            )
        }

        return () => (
            <div class={prefixCls}>
                <div class={`${prefixCls}-search`}>
                    <InputSearch size="large" placeholder={t('language.placeholder.search')} />
                </div>
                {renderActionBtns()}
                {renderTable()}
                {renderCreateOrUpdateLanguageConfiguration()}
                {renderLanguagesModal()}
                {renderAddOrUpdateLanguageModal()}
            </div>
        )
    }
})
