import { defineComponent, reactive } from 'vue'
import { menuManagementProps, MenusDataItem } from './props'
import { getPrefixCls } from '../../_utils/props-tools'
import { $request } from '../../../utils/request'
import { $tools } from '../../../utils/tools'
import { $g } from '../../../utils/global'
import { useI18n } from 'vue-i18n'
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons-vue'
import {
    Table,
    message,
    ConfigProvider,
    Popconfirm,
    Button,
    Input,
    Row,
    Col,
    Drawer,
    RadioGroup,
    Form,
    FormItem
} from 'ant-design-vue'

export default defineComponent({
    name: 'MiMenuManagement',
    inheritAttrs: false,
    props: menuManagementProps(),
    setup(props) {
        const prefixCls = getPrefixCls('menus', props.prefixCls)
        const btnCls = getPrefixCls('btn', props.prefixCls)
        const { t } = useI18n()
        const params = reactive({
            loading: false,
            table: {
                loading: false,
                columns: [
                    {
                        title: t('menus.name'),
                        key: 'name',
                        dataIndex: 'name',
                        minWidth: 120
                    },
                    {
                        title: t('menus.name'),
                        key: 'name',
                        dataIndex: 'name',
                        width: 120
                    },
                    {
                        title: t('menus.type'),
                        key: 'type',
                        dataIndex: 'type',
                        width: 120
                    },
                    {
                        title: t('menus.icon'),
                        key: 'icon',
                        dataIndex: 'icon',
                        width: 120
                    },
                    {
                        title: t('menus.page'),
                        key: 'page',
                        dataIndex: 'page',
                        minWidth: 120
                    },
                    {
                        title: t('menus.path'),
                        key: 'path',
                        dataIndex: 'path',
                        minWidth: 120
                    },
                    {
                        title: t('menus.sort'),
                        key: 'sort',
                        dataIndex: 'sort',
                        width: 80
                    },
                    {
                        title: t('opt'),
                        key: 'action',
                        dataIndex: 'action',
                        align: 'right',
                        minWidth: 150
                    }
                ] as any,
                dataSource: [] as MenusDataItem[],
                pagination: {
                    page: 1,
                    size: 10
                }
            },
            search: {
                key: ''
            },
            openDrawer: false,
            isEdit: false,
            types: [{label: t('menus.top'), value: 1}, {label: t('menus.sub'), value: 2}, {label: t('menus.btn'), value: 3}],
            form: {
                validate: {
                    name: '',
                    type: 1
                }
            }
        })

        const getMenus = () => {
            if (props.data.url) {
                if (params.table.loading) return
                params.table.loading = true
                const condition = Object.assign(
                    params.table.pagination,
                    props.data.params || {}
                )
                $request[(props.data.method || 'GET').toLowerCase()](
                    props.data.url,
                    condition
                )
                    .then((res: any) => {
                        params.table.loading = false
                        if (res) {
                            if (res?.ret?.code === 200) {
                                console.log(res.data)
                                if (props.data.callback) props.data.callback(res?.data)
                            } else message.error(res?.ret?.message)
                        }
                    })
                    .catch((err: any) => {
                        params.table.loading = false
                        message.error(err.message)
                    })
            }
        }

        const batchDelete = () => {}

        const searchInput = () => {}

        const searchReset = () => {}

        const search = () => {}

        const openAddOrUpdateDrawer = () => {
            params.openDrawer = !params.openDrawer
            if (params.openDrawer) {
                if (params.isEdit) {

                }
            }
        }

        getMenus()

        const renderActionBtns = () => {
            const btns = (
                <>
                    <Popconfirm
                        title={t('delete-confirm')}
                        style={{ zIndex: Date.now() }}
                        okText={t('ok')}
                        onConfirm={() => batchDelete()}
                        cancelText={t('cancel')}>
                        <Button
                            type="primary"
                            danger={true}
                            style={{ marginRight: $tools.convert2Rem(8) }}>
                            {t('batch-delete')}
                        </Button>
                    </Popconfirm>
                    <Button
                        class={`${btnCls}-success`}
                        onClick={openAddOrUpdateDrawer}>
                        {t('menus.add')}
                    </Button>
                </>
            )
            const searchBtn = props.data.url ? (
                <Col xs={24} md={12}>
                    <div class={`${prefixCls}-btns-l`}>
                        <Input
                            placeholder={t('menus.placeholder.search')}
                            onInput={searchInput}
                            onPressEnter={search}
                            v-model:value={params.search.key}
                        />
                        <Button
                            class={`${btnCls}-info`}
                            onClick={search}
                            style={{ marginRight: $tools.convert2Rem(8) }}
                            v-slots={{
                                icon: () => {
                                    return <SearchOutlined />
                                }
                            }}>
                            {t('seek')}
                        </Button>
                        <Button
                            class={`${btnCls}-info`}
                            onClick={searchReset}
                            v-slots={{
                                icon: () => {
                                    return <ReloadOutlined />
                                }
                            }}>
                            {t('reset')}
                        </Button>
                    </div>
                </Col>
            ) : null
            return (
                <Row class={`${prefixCls}-btns${props.data.url ? '' : ' no-search'}`}>
                    {searchBtn}
                    <Col xs={24} md={12}>
                        <div class={`${prefixCls}-btns-r`}>{btns}</div>
                    </Col>
                </Row>
            )
        }

        const renderDrawer = () => {
            return (
                <Drawer visible={params.openDrawer} zIndex={Date.now()} onClose={openAddOrUpdateDrawer} title={t('menus.add')} width={520} class={`${$g.prefix}drawer`}>
                    <Form>
                        <FormItem label={t('menus.type')}>
                            <RadioGroup options={params.types} v-model:value={params.form.validate.type}></RadioGroup>
                        </FormItem>
                        <FormItem label={t('menus.name')}>
                            <Input v-model:value={params.form.validate.name} />
                        </FormItem>
                    </Form>
                </Drawer>
            )
        }

        const renderTable = () => {
            return (
                <ConfigProvider locale={props.paginationLocale}>
                    {renderActionBtns()}
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
                    {renderDrawer()}
                </ConfigProvider>
            )
        }

        return () => <div class={prefixCls}>{renderTable()}</div>
    }
})
