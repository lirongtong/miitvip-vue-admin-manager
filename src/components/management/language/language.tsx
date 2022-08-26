import { defineComponent, reactive } from 'vue'
import { useI18n } from 'vue-i18n'
import { getPrefixCls } from '../../../components/_utils/props-tools'
import { Table, Select, SelectOption, Tooltip } from 'ant-design-vue'
import { FormOutlined, DeleteOutlined } from '@ant-design/icons-vue'
import PropTypes from '../../../components/_utils/props-types'

export default defineComponent({
    name: 'MiLanguageManagement',
    inheritAttrs: false,
    props: {
        prefixCls: PropTypes.string
    },
    setup(props) {
        const { t } = useI18n()
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
                        align: 'center',
                        ellipsis: true
                    },
                    {
                        title: '简体中文',
                        key: 'language',
                        dataIndex: 'language',
                        align: 'center',
                        ellipsis: true
                    },
                    {
                        title: '管理操作',
                        key: 'action',
                        align: 'center',
                        width: 180,
                        customRender: () => {
                            return (
                                <div class={`${prefixCls}-table-btns`}>
                                    <a class="edit">
                                        <FormOutlined />
                                        编辑
                                    </a>
                                    <span></span>
                                    <a class="delete">
                                        <DeleteOutlined />
                                        删除
                                    </a>
                                </div>
                            )
                        }
                    }
                ] as any,
                data: [
                    {
                        key: 'ok',
                        language: '确定'
                    },
                    {
                        key: 'cancel',
                        language: '取消'
                    }
                ]
            }
        })
        return () => (
            <div class={prefixCls}>
                <div class={`${prefixCls}-table`}>
                    <Table columns={params.table.columns} dataSource={params.table.data} />
                </div>
            </div>
        )
    }
})
