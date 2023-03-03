import { defineComponent, reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { $g } from '../../../utils/global'
import { $tools } from '../../../utils/tools'
import { $request } from '../../../utils/request'
import { AppsManagementProps } from './props'
import { getPrefixCls } from '../../_utils/props-tools'
import { type Key } from '../../_utils/props-types'
import { useWindowResize } from '../../../hooks/useWindowResize'
import MiModal from '../../../components/modal/modal'
import {
    Table,
    ConfigProvider,
    message,
    Empty,
    Form,
    Input,
    Col,
    Row,
    RadioGroup,
    Button,
    Popconfirm,
    FormInstance
} from 'ant-design-vue'
import {
    SearchOutlined,
    ReloadOutlined,
    DeleteOutlined,
    EditOutlined,
    FormOutlined,
    InfoCircleOutlined
} from '@ant-design/icons-vue'

export default defineComponent({
    name: 'MiAppsManagement',
    inheritAttrs: false,
    props: AppsManagementProps(),
    setup(props) {
        const { t } = useI18n()
        const formCls = `${$g.prefix}form`
        const searchCls = `${$g.prefix}list-search`
        const btnCls = `${$g.prefix}btn`
        const prefixCls = getPrefixCls('apps', props.prefixCls)
        const addOrUpdateformRef = ref<FormInstance>()
        const { width } = useWindowResize()
        const params = reactive({
            table: {
                loading: false,
                columns: [
                    {
                        title: t('apps.name'),
                        key: 'name',
                        dataIndex: 'name',
                        width: 200
                    },
                    {
                        title: t('apps.code'),
                        key: 'code',
                        dataIndex: 'code',
                        width: 200
                    },
                    {
                        title: t('apps.logo'),
                        key: 'logo',
                        dataIndex: 'logo',
                        width: 120
                    },
                    {
                        title: t('apps.state'),
                        key: 'state',
                        dataIndex: 'state',
                        align: 'center',
                        customRender: (record: any) => {
                            return record?.record?.type === 1 ? t('apps.up') : t('apps.down')
                        },
                        width: 100
                    },
                    {
                        title: t('apps.auth'),
                        key: 'auth',
                        dataIndex: 'auth',
                        align: 'center',
                        customRender: (record: any) => {
                            return record?.record?.auth === 1 ? t('yes') : t('no')
                        },
                        width: 100
                    },
                    {
                        title: t('apps.link'),
                        key: 'link',
                        dataIndex: 'link',
                        customRender: (record: any) => {
                            return (
                                <a href={record?.record?.link} target="_blank">
                                    {record?.record?.link}
                                </a>
                            )
                        },
                        width: 240
                    },
                    {
                        title: t('apps.desc'),
                        key: 'desc',
                        dataIndex: 'desc',
                        width: 240
                    },
                    {
                        title: t('opt'),
                        key: 'action',
                        dataIndex: 'action',
                        align: 'right',
                        width: 250,
                        fixed: 'right',
                        customRender: (record: any) => {
                            return (
                                <div class={`${$g.prefix}table-btns`}>
                                    <a
                                        class="edit"
                                        onClick={() => handleAddOrUpdateAppsModal(record)}>
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
                                                onClick: () => deleteApps(record)
                                            }}
                                            key={record.record.key}>
                                            <DeleteOutlined />
                                            {t('delete')}
                                        </Popconfirm>
                                    </a>
                                    <span></span>
                                    <a
                                        class="info"
                                        onClick={() => handleAddOrUpdateAppsModal(record)}>
                                        <InfoCircleOutlined />
                                        {t('detail')}
                                    </a>
                                </div>
                            )
                        }
                    }
                ] as any,
                dataSource: [] as any,
                pagination: {
                    page: 1,
                    size: 10
                },
                total: 0
            },
            deleteIds: [] as any[],
            edit: {
                being: false
            } as any,
            search: {
                name: null,
                code: null,
                state: null
            },
            form: {
                validate: {},
                rules: {}
            } as any,
            visible: false,
            states: [
                { label: t('apps.up'), value: 1 },
                { label: t('apps.down'), value: 0 }
            ]
        })

        // 获取应用
        const getApps = async () => {
            if (props.data.url) {
                if (params.table.loading) return
                params.table.loading = true
                const condition = Object.assign(
                    { ...params.search },
                    params.table.pagination,
                    props.data.params || {}
                )
                await $request[(props.data.method || 'GET').toLowerCase()](
                    props.data.url,
                    condition
                )
                    .then((res: any) => {
                        params.table.loading = false
                        if (res) {
                            if (res?.ret?.code === 200) {
                                params.table.total = res?.total
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

        // 新增/更新 - 控制弹窗显隐
        const handleAddOrUpdateAppsModal = (record?: any) => {
            params.visible = !params.visible
            if (params.visible && params.edit.being) {
                // edit
                console.log(record)
            }
        }

        // 查看详情
        const handleAppsInfo = (record: any) => {}

        // 创建/更新应用
        const addOrUpdateApps = () => {}

        // 删除应用
        const deleteApps = (record?: any) => {
            console.log(record)
        }

        // 搜索英语
        const search = () => {}

        // 输入清空事件监听 ( 重新获取应用 )
        const searchInput = () => {}

        // 重置搜索条件
        const searchReset = () => {}
        getApps()

        // 渲染搜索区域
        const renderSearchArea = () => {
            const btns = (
                <>
                    <Popconfirm
                        title={t('delete-confirm')}
                        style={{ zIndex: Date.now() }}
                        okText={t('ok')}
                        onConfirm={() => deleteApps()}
                        cancelText={t('cancel')}>
                        <Button type="primary" danger={true} icon={<DeleteOutlined />}>
                            {t('batch-delete')}
                        </Button>
                    </Popconfirm>
                    <Button
                        class={`${btnCls}-success`}
                        icon={<EditOutlined />}
                        onClick={() => handleAddOrUpdateAppsModal()}>
                        {t('apps.add')}
                    </Button>
                </>
            )
            const searchBtn = props.data.url ? (
                <Col xs={24} md={16}>
                    <div class={`${searchCls}-btns-l multiple`}>
                        <div class={`${searchCls}-item`}>
                            <label>{t('apps.name')}</label>
                            <Input
                                placeholder={t('apps.placeholder.search')}
                                onInput={searchInput}
                                onPressEnter={search}
                                v-model:value={params.search.name}
                            />
                        </div>
                        <div class={`${searchCls}-item`}>
                            <label>{t('apps.code')}</label>
                            <Input
                                placeholder={t('apps.placeholder.code')}
                                onInput={searchInput}
                                onPressEnter={search}
                                v-model:value={params.search.code}
                            />
                        </div>
                        <div class={`${searchCls}-item`}>
                            <label>{t('apps.state')}</label>
                            <RadioGroup
                                options={params.states}
                                v-model:value={params.search.state}></RadioGroup>
                        </div>
                        <div class={`${searchCls}-btns-l-b`}>
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
                    </div>
                </Col>
            ) : null
            return (
                <Row class={`${searchCls}-btns${props.data.url ? '' : ' no-search'}`}>
                    {searchBtn}
                    <Col xs={24} md={8}>
                        <div class={`${searchCls}-btns-r multiple`}>{btns}</div>
                    </Col>
                </Row>
            )
        }

        // 新增/更新 - 弹窗
        const renderAddOrUpdateAppsModel = () => {
            return (
                <MiModal
                    visible={params.visible}
                    title={params.edit.being ? t('apps.update') : t('apps.add')}
                    zIndex={Date.now()}
                    width={width.value < 768 ? '100%' : 720}
                    onCancel={handleAddOrUpdateAppsModal}>
                    <Form
                        class={`${formCls} ${formCls}-theme`}
                        model={params.form.validate}
                        rules={params.form.rules}
                        ref={addOrUpdateformRef}
                        labelCol={{ style: { width: $tools.convert2Rem(120) } }}></Form>
                </MiModal>
            )
        }

        // 渲染 Table
        const renderTable = () => {
            return (
                <ConfigProvider
                    locale={props.paginationLocale}
                    renderEmpty={() => <Empty description={t('no-data')} />}>
                    {renderSearchArea()}
                    <Table
                        columns={params.table.columns}
                        rowSelection={{
                            columnWidth: 60,
                            onChange: (_keys: Key[], rows: any[]) => {
                                params.deleteIds = $tools.getFields(rows, 'id')
                            }
                        }}
                        dataSource={params.table.dataSource}
                        pagination={{
                            showLessItems: true,
                            showQuickJumper: true,
                            responsive: true
                        }}
                        scroll={{ x: '100%' }}
                    />
                    {renderAddOrUpdateAppsModel()}
                </ConfigProvider>
            )
        }

        return () => <div class={prefixCls}>{renderTable()}</div>
    }
})
