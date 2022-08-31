import { defineComponent, reactive } from 'vue'
import { useI18n } from 'vue-i18n'
import { getPrefixCls } from '../../../components/_utils/props-tools'
import { Table, InputSearch } from 'ant-design-vue'
import { FormOutlined, DeleteOutlined } from '@ant-design/icons-vue'
import PropTypes from '../../../components/_utils/props-types'
import { $storage } from '../../../utils/storage'
import { $g } from '../../../utils/global'
import { $tools } from '../../../utils/tools'

export default defineComponent({
    name: 'MiLanguageManagement',
    inheritAttrs: false,
    props: {
        prefixCls: PropTypes.string
    },
    setup(props) {
        const { messages, locale, t } = useI18n()
        const languages = reactive([])
        const prefixCls = getPrefixCls('language', props.prefixCls)
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
                        align: 'left',
                        ellipsis: true
                    },
                    {
                        title: t('language.name'),
                        key: 'language',
                        dataIndex: 'language',
                        align: 'left',
                        ellipsis: true
                    },
                    {
                        title: t('opt'),
                        key: 'action',
                        align: 'center',
                        width: 180,
                        customRender: () => {
                            return (
                                <div class={`${prefixCls}-table-btns`}>
                                    <a class="edit">
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
            }
        })

        const parseLanguage = (data: any, idx = null) => {
            for (const i in data) {
                const type = typeof data[i]
                const key = (!$tools.isEmpty(idx) ? (idx + '.') : '') + i
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

        return () => (
            <div class={prefixCls}>
                <div class={`${prefixCls}-search`}>
                    <InputSearch size="large" placeholder={t('language.search.placeholder')} />
                </div>
                <div class={`${prefixCls}-btns`}></div>
                <div class={`${prefixCls}-table`}>
                    <Table columns={params.table.columns} dataSource={params.table.data} />
                </div>
            </div>
        )
    }
})
