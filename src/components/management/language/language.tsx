import { defineComponent, reactive } from 'vue'
import { useI18n } from 'vue-i18n'
import { getPrefixCls } from '../../../components/_utils/props-tools'
import { Table, InputSearch, Input, Form, FormItem, Textarea, ConfigProvider } from 'ant-design-vue'
import { FormOutlined, DeleteOutlined } from '@ant-design/icons-vue'
import PropTypes from '../../../components/_utils/props-types'
import { $storage } from '../../../utils/storage'
import { $g } from '../../../utils/global'
import { $tools } from '../../../utils/tools'
import MiModal from '../../modal'

export default defineComponent({
    name: 'MiLanguageManagement',
    inheritAttrs: false,
    props: {
        prefixCls: PropTypes.string,
        paginationLocale: PropTypes.any
    },
    setup(props) {
        const { messages, locale, t } = useI18n()
        const languages = reactive([])
        const prefixCls = getPrefixCls('language', props.prefixCls)
        const formCls = getPrefixCls('form', props.prefixCls)
        const params = reactive({
            pagination: {
                page: 1,
                size: 10
            },
            table: {
                columns: [
                    {
                        title: 'Key',
                        key: 'key',
                        dataIndex: 'key',
                        align: 'left'
                    },
                    {
                        title: t('language.name'),
                        key: 'language',
                        dataIndex: 'language',
                        align: 'left'
                    },
                    {
                        title: t('opt'),
                        key: 'action',
                        align: 'center',
                        width: locale.value === 'en-us' ? 240 : 180,
                        customRender: (record: any) => {
                            return (
                                <div class={`${prefixCls}-table-btns`}>
                                    <a class="edit" onClick={() => editVisible(record)}>
                                        <FormOutlined />
                                        {t('edit')}
                                    </a>
                                    <span></span>
                                    <a class="delete">
                                        <DeleteOutlined />
                                        {t('delete')}
                                    </a>
                                </div>
                            )
                        }
                    }
                ] as any,
                data: []
            },
            languages: {
                default: messages.value[locale.value],
                custom: $storage.get($g.caches.storages.languages)
            },
            visible: false,
            data: {} as any
        })

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
        parseLanguage(Object.assign({}, params.languages.default, params.languages.custom))
        params.table.data = languages

        const editVisible = (data?: any) => {
            params.visible = !params.visible
            if (data?.record) params.data = JSON.parse(JSON.stringify(data.record))
            else params.data = {}
        }

        return () => (
            <div class={prefixCls}>
                <div class={`${prefixCls}-search`}>
                    <InputSearch size="large" placeholder={t('language.search.placeholder')} />
                </div>
                <div class={`${prefixCls}-btns`}></div>
                <div class={`${prefixCls}-table`}>
                    <ConfigProvider locale={props.paginationLocale}>
                        <Table
                            columns={params.table.columns}
                            dataSource={params.table.data}
                            pagination={{ showQuickJumper: true }}
                            scroll={{ x: '100%' }}
                        />
                    </ConfigProvider>
                </div>
                <MiModal
                    v-model:visible={params.visible}
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
            </div>
        )
    }
})
