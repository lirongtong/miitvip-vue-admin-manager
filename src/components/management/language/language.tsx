import { defineComponent, reactive } from 'vue'
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
    Button
} from 'ant-design-vue'
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
            visible: false,
            data: {} as any,
            current: $g.locale
        })

        const initLanguage = () => {
            const custom = $storage.get($g.caches.storages.languages) || {}
            const builtIn = messages.value[locale.value]
            const languages = Object.assign({}, builtIn, custom)
            $storage.set($g.caches.storages.languages, languages)
        }
        initLanguage()

        const getLanguage = () => {
            return $storage.get($g.caches.storages.languages)
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
        parseLanguage(getLanguage())
        params.table.data = languages

        const changLanguage = (lang: any) => {
            $g.locale = lang
            console.log(locale)
            console.log(lang)
        }

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
                <div class={`${prefixCls}-btns`}>
                    <div class={`${prefixCls}-btns-l`}>
                        <Button type="primary" danger={true}>
                            {t('batch-delete')}
                        </Button>
                    </div>
                    <div class={`${prefixCls}-btns-r`}>
                        <Button type="primary">{t('language.management')}</Button>
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
