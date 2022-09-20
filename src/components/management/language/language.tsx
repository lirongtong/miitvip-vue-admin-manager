import { defineComponent, reactive, ref } from 'vue'
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
    key: string
    language: string
}

export default defineComponent({
    name: 'MiLanguageManagement',
    inheritAttrs: false,
    props: languageProps(),
    setup(props) {
        const { messages, locale, t } = useI18n()
        let languages = reactive([])
        const prefixCls = getPrefixCls('language', props.prefixCls)
        const formCls = getPrefixCls('form', props.prefixCls)
        const formRef = ref<FormInstance>()

        const checkValidateKey = (_rule: Rule, value: string) => {
            if (!value) return Promise.reject(t('language.error.key.empty'))
            const categories = $storage.get($g.caches.storages.languages.categories) || []
            if (categories[value]) return Promise.reject(t('language.error.key.exist'))
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
                        customRender: (record: any) => {
                            return (
                                <div class={`${prefixCls}-table-btns`}>
                                    <a class="edit" onClick={() => editVisible(record)}>
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
            data: {} as any,
            current: $g.locale,
            defaultCategories: [
                { key: 'zh-cn', language: t('language.zh-cn') },
                { key: 'en-us', language: t('language.en-us') }
            ],
            categories: [],
            form: {
                validate: {
                    key: null,
                    language: null
                } as LanguageFormState,
                rules: {
                    key: [{ required: true, validator: checkValidateKey }],
                    language: [{ required: true, message: t('language.error.language') }]
                }
            }
        })

        const initLanguage = async () => {
            let combine: {} = {}
            if (props.listConfig.url) {
                params.loading = true
                const query = Object.assign({}, params.pagination, props.listConfig.params || {})
                await $request[(props.listConfig.method || 'GET').toLowerCase()](
                    props.listConfig.url,
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
            } else combine = mergeLanguage()
            parseLanguage(combine)
            params.table.data = languages
            if (props.categoryconfig.url) {
                params.loading = true
                await $request[(props.categoryconfig.method || 'GET').toLowerCase()](
                    props.categoryconfig.url,
                    Object.assign({}, props.categoryconfig.params || {})
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

        const parseLanguage = (data: any, idx = null) => {
            for (const i in data) {
                const type = typeof data[i]
                const key = (!$tools.isEmpty(idx) ? idx + '.' : '') + i
                if (['object', 'array'].includes(type)) parseLanguage(data[i], key)
                else {
                    languages.push({
                        key,
                        language: data[i]
                    })
                }
            }
        }

        const mergeLanguage = (lang?: string) => {
            const custom = $storage.get($g.caches.storages.languages.custom) || {}
            const builtIn = messages.value[lang ?? locale.value]
            return Object.assign({}, builtIn, custom)
        }

        const changLanguage = (lang: any) => {
            languages = []
            parseLanguage(mergeLanguage(lang))
            params.table.data = languages
        }

        const editVisible = (data?: any) => {
            params.visible.edit = !params.visible.edit
            if (data?.record) params.data = JSON.parse(JSON.stringify(data.record))
            else params.data = {}
        }

        const addLanguageVisible = () => {
            params.visible.management = !params.visible.management
            params.visible.add = !params.visible.add
        }
        const cancelLanguageVisible = () => {
            params.visible.management = true
            params.visible.add = false
        }
        const addLanguage = () => {
            params.loading = true
            formRef.value
                .validate()
                .then(() => {
                    if (props.addConfig.url) {
                        const query = Object.assign(
                            {},
                            params.pagination,
                            props.addConfig.params || {}
                        )
                        $request[(props.addConfig.method || 'POST').toLowerCase()](
                            props.addConfig.url,
                            query
                        )
                            .then((res: any) => {
                                params.loading = false
                                if (res.ret.code === 200) {
                                    message.success(t('success'))
                                    cancelLanguageVisible()
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
                        cancelLanguageVisible()
                    }
                })
                .catch(() => (params.loading = false))
        }
        initLanguage()

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
                            cancelText={t('cancel')}>
                            <span class={`${prefixCls}-cate-close`}>
                                <CloseOutlined />
                            </span>
                        </Popconfirm>
                    ) : null
                langs.push(
                    <div class={`${prefixCls}-cate`}>
                        <span class={`${prefixCls}-cate-name`} innerHTML={cur.language}></span>
                        {close}
                    </div>
                )
            }
            return <div class={`${prefixCls}-cates`}>{langs}</div>
        }

        return () => (
            <div class={prefixCls}>
                <div class={`${prefixCls}-search`}>
                    <InputSearch size="large" placeholder={t('language.placeholder.search')} />
                </div>
                <div class={`${prefixCls}-btns`}>
                    <div class={`${prefixCls}-btns-l`}>
                        <Button type="primary" danger={true}>
                            {t('batch-delete')}
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
                <div class={`${prefixCls}-table`}>
                    <ConfigProvider locale={props.paginationLocale}>
                        <Table
                            columns={params.table.columns}
                            dataSource={params.table.data}
                            pagination={{ showQuickJumper: true }}
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
                <MiModal
                    v-model:visible={params.visible.edit}
                    title={t('language.update-title')}
                    width={360}
                    footerBtnPosition="center">
                    <Form class={formCls}>
                        <FormItem>
                            <Input
                                v-model:value={params.data.key}
                                maxlength={64}
                                autocomplete="off"
                            />
                        </FormItem>
                        <FormItem>
                            <Textarea
                                v-model:value={params.data.language}
                                autoSize={{ minRows: 4, maxRows: 8 }}
                            />
                        </FormItem>
                    </Form>
                </MiModal>
                <MiModal
                    v-model:visible={params.visible.management}
                    title={t('language.management')}
                    footer={false}>
                    <Button type="primary" onClick={addLanguageVisible}>
                        {t('language.add-language')}
                    </Button>
                    {renderLanguageTags()}
                </MiModal>
                <MiModal
                    v-model:visible={params.visible.add}
                    title={t('language.add-language')}
                    onCancel={cancelLanguageVisible}
                    onOk={addLanguage}
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
            </div>
        )
    }
})
