import { defineComponent, reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { $g } from '../../../utils/global'
import { $tools } from '../../../utils/tools'
import { $request } from '../../../utils/request'
import { AppsManagementProps } from './props'
import { getPrefixCls } from '../../_utils/props-tools'
import { type Key } from '../../_utils/props-types'
import {
    Table,
    ConfigProvider,
    message,
    Empty,
    Form,
    FormItem,
    Input,
    Textarea,
    Col,
    Row,
    RadioGroup,
    Button,
    Drawer,
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
        const params = reactive({
            loading: false,
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
                                    <a class="edit" onClick={() => handleAddOrUpdateDrawer(record)}>
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
                                    <a class="info" onClick={() => handleAppsInfo(record)}>
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
                id: null,
                being: false
            } as any,
            detail: {
                id: null,
                show: false
            },
            search: {
                name: null,
                code: null,
                state: null
            },
            form: {
                validate: {
                    code: null,
                    name: null,
                    desc: null,
                    state: 1,
                    logo: null,
                    auth: 1,
                    link: null,
                    contact_person: null,
                    contact_phone: null
                },
                rules: {
                    name: [{ required: true, message: t('apps.placeholder.name') }],
                    code: [{ required: true, message: t('apps.placeholder.code') }],
                    logo: [{ required: true, message: t('apps.placeholder.logo') }],
                    link: [{ required: true, message: t('apps.placeholder.link') }],
                    state: [{ required: true, message: t('apps.placeholder.state') }],
                    auth: [{ required: true, message: t('apps.placeholder.auth') }]
                }
            } as any,
            visible: false,
            states: [
                { label: t('apps.up'), value: 1 },
                { label: t('apps.down'), value: 0 }
            ],
            auths: [
                { label: t('yes'), value: 1 },
                { label: t('no'), value: 0 }
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

        // 新增/更新操作
        const handleAddOrUpdate = () => {
            if (addOrUpdateformRef.value) {
                addOrUpdateformRef.value.validate().then(() => {
                    if (params.loading) return
                    params.loading = true
                    if (params.edit.being) {
                        // update
                        if (!params.edit.id) {
                            message.error(t('no-id'))
                            return
                        }
                        if (props.updateApp.url) {
                            $request[(props.updateApp.method || 'PUT').toLowerCase()](
                                $tools.replaceUrlParams(props.updateApp.url, {
                                    id: params.edit.id
                                }),
                                Object.assign(
                                    {},
                                    { ...params.form.validate },
                                    { ...props.updateApp.params }
                                )
                            )
                                .then((res: any) => {
                                    params.loading = false
                                    if (res?.ret?.code === 200) {
                                        handleAddOrUpdateDrawer()
                                        handleAfterAction()
                                        getApps()
                                        message.success(t('success'))
                                        if (props.updateApp.callback) props.updateApp.callback()
                                    } else message.error(res?.ret?.message)
                                })
                                .catch((err: any) => {
                                    params.loading = false
                                    message.error(err?.message)
                                })
                        } else {
                            params.loading = false
                            message.warning(t('api.create', { name: t('app') }))
                        }
                    } else {
                        // create
                        if (props.createApp.url) {
                            $request[(props.createApp.method || 'POST').toLowerCase()](
                                props.createApp.url,
                                Object.assign(
                                    {},
                                    { ...params.form.validate },
                                    { ...props.createApp.params }
                                )
                            )
                                .then((res: any) => {
                                    params.loading = false
                                    if (res?.ret?.code === 200) {
                                        handleAddOrUpdateDrawer()
                                        handleAfterAction()
                                        getApps()
                                        message.success(t('success'))
                                        if (props.createApp.callback) props.createApp.callback()
                                    } else message.error(res?.ret?.message)
                                })
                                .catch((err: any) => {
                                    params.loading = false
                                    message.error(err?.message)
                                })
                        } else {
                            params.loading = false
                            message.warning(t('api.create', { name: t('app') }))
                        }
                    }
                })
            }
        }

        // 新增/更新 - 控制弹窗显隐
        const handleAddOrUpdateDrawer = (record?: any) => {
            params.visible = !params.visible
            if (params.visible && params.edit.being) {
                // edit
                console.log(record)
            }
        }

        // 重置
        const handleAfterAction = () => {
            addOrUpdateformRef.value.resetFields()
            params.form.validate.state = 1
            params.form.validate.auth = 1
            params.edit.id = null
            params.edit.being = false
            params.detail.show = false
        }

        // 查看详情状态进入编辑状态
        const setDetailEditable = () => {}

        // 查看详情
        const handleAppsInfo = (record: any) => {
            console.log(record)
        }

        // 删除应用
        const deleteApps = (record?: any) => {
            console.log(record)
        }

        // 搜索应用
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
                        onClick={() => handleAddOrUpdateDrawer()}>
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
                                placeholder={t('apps.placeholder.search.name')}
                                onInput={searchInput}
                                onPressEnter={search}
                                v-model:value={params.search.name}
                            />
                        </div>
                        <div class={`${searchCls}-item`}>
                            <label>{t('apps.code')}</label>
                            <Input
                                placeholder={t('apps.placeholder.search.code')}
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

        // 渲染新增/更新表单 - 抽屉弹窗
        const renderDrawer = () => {
            // 抽屉式表单的标题
            const title = params.edit.being
                ? t('apps.update')
                : params.detail.show
                ? t('detail')
                : t('apps.add')
            // 抽屉式表单的按钮
            const btn = params.detail.show ? (
                <>
                    <Button
                        style={{ marginRight: $tools.convert2Rem(8) }}
                        onClick={handleAddOrUpdateDrawer}>
                        {t('close')}
                    </Button>
                    <Button type="primary" onClick={setDetailEditable} loading={params.loading}>
                        {t('editable')}
                    </Button>
                </>
            ) : (
                <>
                    <Button
                        style={{ marginRight: $tools.convert2Rem(8) }}
                        onClick={handleAddOrUpdateDrawer}>
                        {t('cancel')}
                    </Button>
                    <Button type="primary" onClick={handleAddOrUpdate} loading={params.loading}>
                        {params.edit.being ? t('update') : t('save')}
                    </Button>
                </>
            )
            return (
                <Drawer
                    visible={params.visible}
                    zIndex={Date.now()}
                    onClose={handleAddOrUpdateDrawer}
                    title={title}
                    width={580}
                    v-slots={{
                        extra: () => btn
                    }}
                    class={`${$g.prefix}drawer`}>
                    <Form
                        class={`${formCls} ${formCls}-theme`}
                        model={params.form.validate}
                        rules={params.form.rules}
                        ref={addOrUpdateformRef}
                        labelCol={{ style: { width: $tools.convert2Rem(120) } }}>
                        <FormItem label={t('apps.code')} name="code">
                            <Input
                                v-model:value={params.form.validate.code}
                                autocomplete="off"
                                disabled={params.detail.show}
                                readonly={params.detail.show}
                                placeholder={t('apps.placeholder.code')}
                            />
                        </FormItem>
                        <FormItem label={t('apps.name')} name="name">
                            <Input
                                v-model:value={params.form.validate.name}
                                autocomplete="off"
                                disabled={params.detail.show}
                                readonly={params.detail.show}
                                placeholder={t('apps.placeholder.name')}
                            />
                        </FormItem>
                        <FormItem label={t('apps.logo')} name="logo">
                            <Input
                                v-model:value={params.form.validate.logo}
                                autocomplete="off"
                                disabled={params.detail.show}
                                readonly={params.detail.show}
                                placeholder={t('apps.placeholder.logo')}
                            />
                        </FormItem>
                        <FormItem label={t('apps.desc')} name="desc">
                            <Textarea
                                v-model:value={params.form.validate.desc}
                                autocomplete="off"
                                allowClear={true}
                                autoSize={{ minRows: 8, maxRows: 16 }}
                                disabled={params.detail.show}
                                readonly={params.detail.show}
                                placeholder={t('apps.placeholder.desc')}
                            />
                        </FormItem>
                        <FormItem label={t('apps.state')} name="state">
                            <RadioGroup
                                options={params.states}
                                disabled={params.detail.show}
                                v-model:value={params.form.validate.state}></RadioGroup>
                        </FormItem>
                        <FormItem label={t('apps.auth')} name="auth">
                            <RadioGroup
                                options={params.auths}
                                disabled={params.detail.show}
                                v-model:value={params.form.validate.auth}></RadioGroup>
                        </FormItem>
                        <FormItem label={t('apps.link')} name="link">
                            <Input
                                v-model:value={params.form.validate.link}
                                autocomplete="off"
                                disabled={params.detail.show}
                                readonly={params.detail.show}
                                placeholder={t('apps.placeholder.link')}
                            />
                        </FormItem>
                        <FormItem label={t('contact.person')} name="contact_person">
                            <Input
                                v-model:value={params.form.validate.contact_person}
                                autocomplete="off"
                                disabled={params.detail.show}
                                readonly={params.detail.show}
                                placeholder={t('apps.placeholder.contact.person')}
                            />
                        </FormItem>
                        <FormItem label={t('contact.phone')} name="contact_phone">
                            <Input
                                v-model:value={params.form.validate.contact_phone}
                                autocomplete="off"
                                disabled={params.detail.show}
                                readonly={params.detail.show}
                                placeholder={t('apps.placeholder.contact.phone')}
                            />
                        </FormItem>
                    </Form>
                </Drawer>
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
                    {renderDrawer()}
                </ConfigProvider>
            )
        }

        return () => <div class={prefixCls}>{renderTable()}</div>
    }
})
