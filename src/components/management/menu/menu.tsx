import { defineComponent, reactive } from 'vue'
import { menuManagementProps } from './props'
import { getPrefixCls } from '../../_utils/props-tools'
import { useI18n } from 'vue-i18n'
import { Table } from 'ant-design-vue'

export default defineComponent({
    name: 'MiMenuManagement',
    inheritAttrs: false,
    props: menuManagementProps(),
    setup(props) {
        const prefixCls = getPrefixCls('menus', props.prefixCls)
        const { t } = useI18n()
        const params = reactive({
            loading: false,
            table: {
                columns: [
                    {
                        title: t('menus.name'),
                        key: 'name',
                        dataIndex: 'name'
                    },
                    {
                        title: t('menus.name'),
                        key: 'name',
                        dataIndex: 'name'
                    },
                    {
                        title: t('menus.type'),
                        key: 'type',
                        dataIndex: 'type'
                    },
                    {
                        title: t('menus.icon'),
                        key: 'icon',
                        dataIndex: 'icon'
                    },
                    {
                        title: t('menus.page'),
                        key: 'page',
                        dataIndex: 'page'
                    },
                    {
                        title: t('menus.path'),
                        key: 'path',
                        dataIndex: 'path'
                    },
                    {
                        title: t('menus.sort'),
                        key: 'sort',
                        dataIndex: 'sort'
                    },
                    {
                        title: t('opt'),
                        key: 'action',
                        dataIndex: 'action'
                    }
                ]
            }
        })

        const renderTable = () => {
            return (
                <Table
                    columns={params.table.columns}
                    rowSelection={{}}
                    pagination={{
                        showLessItems: true,
                        showQuickJumper: true,
                        responsive: true
                    }}
                    scroll={{ x: '100%' }}
                />
            )
        }

        return () => <div class={prefixCls}>{renderTable()}</div>
    }
})
