import { defineComponent, reactive, PropType } from 'vue'
import { useI18n } from 'vue-i18n'
import { getPrefixCls } from '../../../components/_utils/props-tools'
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
    message
} from 'ant-design-vue'
import { FormOutlined, DeleteOutlined } from '@ant-design/icons-vue'
import PropTypes from '../../../components/_utils/props-types'
import { $storage } from '../../../utils/storage'
import { $g } from '../../../utils/global'
import { $tools } from '../../../utils/tools'
import MiModal from '../../modal'
import { $request } from '../../../utils/request'

export interface CommonApiProps {
    url?: string
    method?: string
    params?: object
}

export default defineComponent({
    name: 'MiLanguageManagement',
    inheritAttrs: false,
    props: {
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
        paginationLocale: PropTypes.any
    },
    setup(props) {
        const { messages, locale, t } = useI18n()
        let languages = reactive([])
        const prefixCls = getPrefixCls('language', props.prefixCls)
        const formCls = getPrefixCls('form', props.prefixCls)
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
                management: false
            },
            data: {} as any,
            current: $g.locale
        })

        const initLanguage = async () => {
            let combine: {} = {}
            if (props.listConfig.url) {
                params.loading = true
                const query = Object.assign({}, params.pagination, props.listConfig.params)
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
            const custom = $storage.get($g.caches.storages.languages) || {}
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
        initLanguage()

        return () => (
            <div class={prefixCls}>
                <div class={`${prefixCls}-search`}>
                    <InputSearch size="large" placeholder={t('language.search.placeholder')} />
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
                                        return (
                                            <Select
                                                v-model:value={params.current}
                                                onChange={changLanguage}
                                                style={{ minWidth: $tools.convert2Rem(120) }}>
                                                <SelectOption value="zh-cn">
                                                    {t('language.zh-cn')}
                                                </SelectOption>
                                                <SelectOption value="en-us">
                                                    {t('language.en-us')}
                                                </SelectOption>
                                            </Select>
                                        )
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
                    footer={false}></MiModal>
            </div>
        )
    }
})
