import { defineComponent, reactive, ref, inject } from 'vue'
import { useI18n } from 'vue-i18n'
import { getPrefixCls } from '../../../components/_utils/props-tools'
import { languageProps } from './props'
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
import { CloseOutlined, FormOutlined, DeleteOutlined } from '@ant-design/icons-vue'
import { $storage } from '../../../utils/storage'
import { $g } from '../../../utils/global'
import { $tools } from '../../../utils/tools'
import MiModal from '../../modal'
import { $request } from '../../../utils/request'
import { Rule } from 'ant-design-vue/es/form'

export interface CommonApiProps {
    url?: string
    method?: string
    params?: object
}

interface LanguageFormState {
    id?: [string | number]
    key: string
    language: string
}

export default defineComponent({
    name: 'MiLanguageManagement',
    inheritAttrs: false,
    props: languageProps(),
    setup(props) {
        const { messages, locale, t } = useI18n()
        const i18n = inject('$i18n') as any
        let languages = reactive([])
        const prefixCls = getPrefixCls('language', props.prefixCls)
        const btnCls = getPrefixCls('btn', props.prefixCls)
        const formCls = getPrefixCls('form', props.prefixCls)
        const formRef = ref<FormInstance>()
        const addFormRef = ref<FormInstance>()

        const checkKeyValidate = (_rule: Rule, value: string) => {
            if (!value) return Promise.reject(t('language.error.key.empty'))
            const categories = $storage.get($g.caches.storages.languages.categories) || []
            if (categories[value]) return Promise.reject(t('language.error.key.exist'))
            else return Promise.resolve()
        }

        const checkLanguageKeyValidate = (_rule: Rule, value: string) => {
            if (!value) return Promise.reject(t('language.placeholder.config.key'))
            let exist = false
            for (let i = 0, l = languages.length; i < l; i++) {
                const lang = languages[i]
                if (lang.key === value) {
                    exist = true
                    break
                }
            }
            if (exist) return Promise.reject(t('language.error.key.exist'))
            else return Promise.resolve()
        }

        const params = reactive({
            loading: false,
            pagination: {
                page: 1,
                size: 10
            },
            table: {
                columns: [
                    {
                        title: t('key'),
                        key: 'key',
                        dataIndex: 'key',
                        align: 'left'
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
                        minWidth: 128,
                        customRender: (record: any) => {
                            return (
                                <div class={`${prefixCls}-table-btns`}>
                                    <a
                                        class="edit"
                                        onClick={() => editLanguageConfigurationVisible(record)}>
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
                data: []
            },
            visible: {
                edit: false,
                management: false,
                add: false
            },
            current: $g.locale,
            storageKey: `${$g.caches.storages.languages.custom}-${$g.locale}`,
            defaultCategories: [
                { key: 'zh-cn', language: t('language.zh-cn') },
                { key: 'en-us', language: t('language.en-us') }
            ],
            categories: [],
            isEdit: null,
            form: {
                validate: {
                    key: null,
                    language: null
                } as LanguageFormState,
                rules: {
                    key: [{ required: true, validator: checkKeyValidate }],
                    language: [{ required: true, message: t('language.error.language') }]
                }
            },
            addForm: {
                validate: {
                    key: null,
                    language: null
                } as LanguageFormState,
                rules: {
                    key: [{ required: true, validator: checkLanguageKeyValidate }],
                    language: [{ required: true, message: t('language.placeholder.config.value') }]
                }
            }
        })

        const setTableData = async (keyword?: string) => {
            if (props.dataSource) params.table.data = props.dataSource
            else {
                const combine = await getLanguageConfiguration(keyword)
                parseLanguageConfiguration(combine)
                params.table.data = languages
            }
        }

        const initLanguageConfiguration = async () => {
            setTableData()
            if (props.categorySource) params.categories = props.categorySource
            else getLanguageCategory()
        }

        const getLanguageConfiguration = async (keyword?: string) => {
            let combine: {} = {}
            if (props.dataConfig.url) {
                params.loading = true
                const query = Object.assign(
                    {},
                    keyword,
                    params.pagination,
                    props.dataConfig.params || {}
                )
                await $request[(props.dataConfig.method || 'GET').toLowerCase()](
                    props.dataConfig.url,
                    query
                )
                    .then((res: any) => {
                        params.loading = false
                        if (res.ret.code === 200) {
                            combine = res.data
                        } else message.error(res.ret.message)
                    })
                    .catch((err: any) => {
                        params.loading = false
                        message.error(err.message)
                    })
            } else combine = mergeLanguageConfiguration()
            return combine
        }

        const parseLanguageConfiguration = (data: any, idx = null) => {
            for (const i in data) {
                const type = typeof data[i]
                const key = (!$tools.isEmpty(idx) ? idx + '.' : '') + i
                if (['object', 'array'].includes(type)) parseLanguageConfiguration(data[i], key)
                else {
                    const item = {
                        key,
                        language: data[i]
                    } as LanguageFormState
                    if (data.id) item.id = data.id
                    languages.push(item)
                }
            }
        }

        const mergeLanguageConfiguration = (lang?: string) => {
            const custom = $storage.get(params.storageKey) || {}
            const builtIn = messages.value[lang ?? locale.value]
            return Object.assign({}, builtIn, custom)
        }

        const changLanguage = (lang: any) => {
            languages = []
            params.current = lang
            params.storageKey = `${$g.caches.storages.languages.custom}-${lang}`
            parseLanguageConfiguration(mergeLanguageConfiguration(lang))
            params.table.data = languages
        }

        const addLanguageCategoryVisible = () => {
            params.visible.management = !params.visible.management
            params.visible.add = !params.visible.add
        }

        const cancelLanguageCategoryVisible = () => {
            params.visible.management = true
            params.visible.add = false
        }

        // language
        const getLanguageCategory = () => {
            if (props.categoryConfig.url) {
                params.loading = true
                $request[(props.categoryConfig.method || 'GET').toLowerCase()](
                    props.categoryConfig.url,
                    props.categoryConfig.params || {}
                )
                    .then((res: any) => {
                        params.loading = false
                        if (res.ret.code === 200) {
                            params.categories = res.data
                        } else message.error(res.ret.message)
                    })
                    .catch((err: any) => {
                        params.loading = false
                        message.error(err.message)
                    })
            } else {
                params.categories = params.defaultCategories.concat(
                    $storage.get($g.caches.storages.languages.categories) || []
                )
            }
        }

        // add language
        const addLanguageCategory = () => {
            params.loading = true
            formRef.value
                .validate()
                .then(() => {
                    if (props.addCategoryConfig.url) {
                        const query = Object.assign(
                            {},
                            params.pagination,
                            props.addCategoryConfig.params || {},
                            { ...params.form.validate }
                        )
                        $request[(props.addCategoryConfig.method || 'POST').toLowerCase()](
                            props.addCategoryConfig.url,
                            query
                        )
                            .then((res: any) => {
                                params.loading = false
                                if (res.ret.code === 200) {
                                    message.success(t('success'))
                                    cancelLanguageCategoryVisible()
                                    formRef.value.resetFields()
                                } else message.error(res.ret.message)
                            })
                            .catch((err: any) => {
                                params.loading = false
                                message.error(err.message)
                            })
                    } else {
                        const categories = (
                            $storage.get($g.caches.storages.languages.categories) || []
                        ).concat([
                            {
                                key: params.form.validate.key,
                                language: params.form.validate.language
                            }
                        ])
                        $storage.set($g.caches.storages.languages.categories, categories)
                        params.categories = params.defaultCategories.concat(categories)
                        message.success(t('success'))
                        cancelLanguageCategoryVisible()
                        formRef.value.resetFields()
                    }
                })
                .catch(() => (params.loading = false))
        }

        // delete language.
        const deleteLanguageCategory = (key: string | number) => {
            params.loading = true
            if (props.deleteCategoryConfig.url) {
                $request[(props.deleteCategoryConfig.method || 'DELETE').toLowerCase()](
                    props.deleteCategoryConfig.url,
                    props.deleteCategoryConfig.params || {}
                )
                    .then((res: any) => {
                        params.loading = false
                        if (res.ret.code === 200) {
                            message.success(t('success'))
                        } else message.error(res.ret.message)
                    })
                    .catch((err: any) => {
                        params.loading = false
                        message.error(err.message)
                    })
            } else {
                const categories = $storage.get($g.caches.storages.languages.categories) || []
                const cates = []
                for (let i = 0, l = categories.length; i < l; i++) {
                    if (categories[i].key === key) continue
                    else cates.push(categories[i])
                }
                params.categories = params.defaultCategories.concat(cates)
                message.success(t('success'))
                $storage.set($g.caches.storages.languages.categories, cates)
            }
        }

        // modal - add language configuration.
        const addLanguageConfigurationVisible = () => {
            params.isEdit = false
            params.addForm.validate = {
                key: null,
                language: null
            }
            params.visible.edit = !params.visible.edit
        }

        // modal - edit language configuration.
        const editLanguageConfigurationVisible = (data?: any) => {
            params.isEdit = true
            params.visible.edit = !params.visible.edit
            if (data?.record) params.addForm.validate = JSON.parse(JSON.stringify(data.record))
            else params.addForm.validate = { key: null, language: null }
        }

        // add or update language configuration.
        const addOrUpdateLanguageConfiguration = () => {
            params.loading = true
            addFormRef.value
                .validate()
                .then(() => {
                    if (params.isEdit) {
                        // update
                    } else {
                        // add
                        const newOne = {}
                        newOne[params.addForm.validate.key.toLocaleLowerCase()] =
                            params.addForm.validate.language
                        const afterAdd = () => {
                            message.success(t('success'))
                            addLanguageConfigurationVisible()
                            setTableData()
                            updateSystemLocaleInfo(newOne)
                            if (props.addLanguageConfig.callback) props.addLanguageConfig.callback()
                        }
                        if (props.addLanguageConfig.url) {
                            // remote
                            $request[props.addLanguageConfig.method.toLocaleLowerCase() || 'POST'](
                                props.addLanguageConfig.url,
                                Object.assign(
                                    {},
                                    { ...params.addForm.validate },
                                    props.addLanguageConfig.params
                                )
                            )
                                .then((res: any) => {
                                    params.loading = false
                                    if (res.ret.code === 200) afterAdd()
                                    else message.error(res.ret.message)
                                })
                                .catch((err: any) => {
                                    params.loading = false
                                    message.error(err.message)
                                })
                        } else {
                            const custom = $storage.get(params.storageKey) || {}
                            $storage.set(params.storageKey, Object.assign({}, custom, newOne))
                            params.loading = false
                            afterAdd()
                        }
                    }
                })
                .catch(() => (params.loading = false))
        }

        // update i18n locale ( messages ).
        const updateSystemLocaleInfo = (message?: {}) => {
            if (locale.value === params.current) {
                if (!message) {
                    const custom = $storage.get(params.storageKey) || {}
                    for (const i in custom) {
                        const keys = i.split('.')
                        const temp = []
                        const end = []
                        for (let n = 0, l = keys.length; n < l; n++) {
                            if (n < l - 1) {
                                temp.push(`{"${keys[n]}":`)
                                end.push('}')
                            } else temp.push(`{"${keys[n]}":"${custom[i]}"}`)
                        }
                        temp.push(...end)
                        const str = temp.join('')
                        message = Object.assign({}, message, JSON.parse(str))
                    }
                }
                i18n.setLocale(locale.value, message)
            }
        }

        // table pagination change.
        const changePagination = (page: number, size: number) => {
            params.pagination.page = page
            params.pagination.size = size
            if (props.dataConfig.url) setTableData()
        }

        initLanguageConfiguration()

        const renderLanguageSelection = () => {
            const options = []
            for (let i = 0, l = params.categories.length; i < l; i++) {
                const cur = params.categories[i]
                options.push(<SelectOption value={cur.key}>{cur.language}</SelectOption>)
            }
            return (
                <Select
                    v-model:value={params.current}
                    onChange={changLanguage}
                    style={{ minWidth: $tools.convert2Rem(120) }}>
                    {options}
                </Select>
            )
        }

        const renderLanguageTags = () => {
            const langs = []
            for (let i = 0, l = params.categories.length; i < l; i++) {
                const cur = params.categories[i]
                const close =
                    i > 1 ? (
                        <Popconfirm
                            title={t('delete-confirm')}
                            style={{ zIndex: Date.now() }}
                            okText={t('ok')}
                            onConfirm={() => deleteLanguageCategory(cur.id || cur.key)}
                            cancelText={t('cancel')}>
                            <span class={`${prefixCls}-cate-close`}>
                                <CloseOutlined />
                            </span>
                        </Popconfirm>
                    ) : null
                langs.push(
                    <div class={`${prefixCls}-cate`}>
                        <span class={`${prefixCls}-cate-name`} innerHTML={cur.language} />
                        {close}
                    </div>
                )
            }
            return <div class={`${prefixCls}-cates`}>{langs}</div>
        }

        const renderLanguagesModal = () => {
            return (
                <MiModal
                    v-model:visible={params.visible.management}
                    title={t('language.management')}
                    footer={false}>
                    <Button type="primary" onClick={addLanguageCategoryVisible}>
                        {t('language.add-language')}
                    </Button>
                    {renderLanguageTags()}
                </MiModal>
            )
        }

        const renderAddOrUpdateLanguageModal = () => {
            return (
                <MiModal
                    v-model:visible={params.visible.add}
                    title={t('language.add-language')}
                    onCancel={cancelLanguageCategoryVisible}
                    onOk={addLanguageCategory}
                    footerBtnPosition="center">
                    <Form
                        class={formCls}
                        labelCol={{ style: { width: $tools.convert2Rem(96) } }}
                        model={params.form.validate}
                        rules={params.form.rules}
                        autocomplete="off"
                        ref={formRef}>
                        <FormItem label={t('key')} name="key">
                            <Input
                                prop="key"
                                v-model:value={params.form.validate.key}
                                maxlength={64}
                                autocomplete="off"
                                placeholder={t('language.placeholder.key')}
                            />
                        </FormItem>
                        <FormItem label={t('language.display-language')} name="language">
                            <Input
                                prop="language"
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

        const renderAddOrUpdateLanguageConfiguration = () => {
            const title = params.isEdit ? t('language.update-title') : t('language.add-title')
            return (
                <MiModal
                    v-model:visible={params.visible.edit}
                    title={title}
                    width={360}
                    onOk={addOrUpdateLanguageConfiguration}
                    footerBtnPosition="center">
                    <Form
                        class={formCls}
                        model={params.addForm.validate}
                        rules={params.addForm.rules}
                        ref={addFormRef}>
                        <FormItem name="key">
                            <Input
                                v-model:value={params.addForm.validate.key}
                                maxlength={64}
                                autocomplete="off"
                                placeholder={t('language.placeholder.config.key')}
                            />
                        </FormItem>
                        <FormItem name="language">
                            <Textarea
                                v-model:value={params.addForm.validate.language}
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
                            onClick={addLanguageConfigurationVisible}>
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
                {renderAddOrUpdateLanguageConfiguration()}
                {renderLanguagesModal()}
                {renderAddOrUpdateLanguageModal()}
            </div>
        )
    }
})
