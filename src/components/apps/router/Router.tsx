import { defineComponent, reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import {
    ConfigProvider,
    Empty,
    Popconfirm,
    Button,
    message,
    Row,
    Col,
    Input,
    Table,
    Form,
    FormItem,
    TreeSelect,
    Drawer,
    RadioGroup,
    InputNumber,
    Switch,
    type FormInstance,
    Tooltip
} from 'ant-design-vue'
import {
    FormOutlined,
    MessageOutlined,
    NodeExpandOutlined,
    DeleteOutlined,
    EditOutlined
} from '@ant-design/icons-vue'
import { RouterTreeProps, type RouterTreeItem } from './props'
import { $request } from '../../../utils/request'
import { $tools } from '../../../utils/tools'
import type { ResponseData } from '../../../utils/types'

import zhCN from 'ant-design-vue/es/locale/zh_CN'
import applyTheme from '../../_utils/theme'
import styled from './style/router.module.less'

const MiAppsRouter = defineComponent({
    name: 'MiAppsRouter',
    inheritAttrs: false,
    props: RouterTreeProps(),
    emits: ['afterGetRouter', 'afterCreateRouter', 'afterUpdateRouter', 'afterDeleteRouter'],
    setup(props, { emit }) {
        const { t } = useI18n()
        const routerFormRef = ref<FormInstance>()

        // 路由名称校验
        const checkNameValidate = async (_rule: any, value: string) => {
            if (!value) return Promise.reject(t('router.placeholder.name'))
            if (props.checkRouterNameExistAction) {
                const condition = Object.assign(
                    {
                        id: params.edit.id || 0,
                        edit: params.edit.status ? 1 : 0,
                        name: params.form.validate.name
                    },
                    { ...props.checkRouterNameExistParams }
                )
                if (typeof props.checkRouterNameExistAction === 'string') {
                    return await $request?.[props.checkRouterNameExistMethod](
                        props.checkRouterNameExistAction,
                        condition
                    )
                        .then((res: ResponseData | any) => {
                            if (res?.ret?.code === 200) {
                                return Promise.resolve()
                            } else if (res?.ret?.message) {
                                return Promise.reject(res?.ret?.message)
                            }
                            return Promise.resolve()
                        })
                        .catch((err: any) => {
                            return Promise.reject(err?.message || err)
                        })
                } else if (typeof props.checkRouterNameExistAction === 'function') {
                    const response = await props.checkRouterNameExistAction(condition)
                    if (typeof response === 'string') return Promise.reject(response)
                    return Promise.resolve()
                }
            } else return Promise.resolve()
        }

        const params = reactive({
            ids: [],
            loading: {
                list: false,
                action: false,
                delete: false
            },
            total: 0,
            table: {
                columns: [
                    {
                        title: t('router.title'),
                        key: 'title',
                        dataIndex: 'title',
                        width: 160,
                        ellipsis: true
                    },
                    {
                        title: t('router.name'),
                        key: 'name',
                        dataIndex: 'name',
                        width: 180,
                        ellipsis: true
                    },
                    {
                        title: t('router.type'),
                        key: 'type',
                        dataIndex: 'type',
                        align: 'center',
                        customRender: (record: any) => {
                            return record?.record?.type === 1
                                ? t('router.top')
                                : record?.record?.type === 2
                                  ? t('router.sub')
                                  : t('router.unknown')
                        },
                        width: 120
                    },
                    {
                        title: t('router.page'),
                        key: 'page',
                        ellipsis: true,
                        customRender: ({ record }) => {
                            return (
                                <Tooltip trigger="click" placement="topLeft" title={record?.page}>
                                    <span innerHTML={record?.page}></span>
                                </Tooltip>
                            )
                        }
                    },
                    {
                        title: t('router.path'),
                        key: 'path',
                        ellipsis: true,
                        customRender: ({ record }) => {
                            return (
                                <Tooltip trigger="click" placement="topLeft" title={record?.path}>
                                    <span innerHTML={record?.path}></span>
                                </Tooltip>
                            )
                        }
                    },
                    {
                        title: t('router.weight'),
                        key: 'weight',
                        dataIndex: 'weight',
                        align: 'center',
                        width: 90
                    },
                    {
                        title: t('global.action'),
                        key: 'action',
                        align: 'center',
                        width: 440,
                        customRender: ({ record }) => {
                            return (
                                <div class={styled.actionItems}>
                                    <Button
                                        type="primary"
                                        class={styled.btnPrimary}
                                        icon={<FormOutlined />}
                                        onClick={() => handleOpenDrawer(record)}>
                                        {t('global.edit')}
                                    </Button>
                                    <Button
                                        type="default"
                                        class={styled.btnInfo}
                                        onClick={() => handleDetail(record)}
                                        icon={<MessageOutlined />}>
                                        {t('router.detail')}
                                    </Button>
                                    {record?.type === 3 ? null : (
                                        <Button
                                            class={styled.btnWarn}
                                            type="default"
                                            onClick={() => handleAddSubRouter(record)}
                                            icon={<NodeExpandOutlined />}>
                                            {t('router.add-sub')}
                                        </Button>
                                    )}
                                    <Popconfirm
                                        title={t('global.delete.confirm')}
                                        overlayStyle={{
                                            zIndex: Date.now(),
                                            minWidth: $tools.convert2rem(210)
                                        }}
                                        okText={t('global.ok')}
                                        cancelText={t('global.cancel')}
                                        okButtonProps={{
                                            onClick: () => handleDeleteRouter(record?.id)
                                        }}
                                        key={record?.key}>
                                        <Button
                                            type="primary"
                                            danger={true}
                                            icon={<DeleteOutlined />}>
                                            {t('global.delete.normal')}
                                        </Button>
                                    </Popconfirm>
                                </div>
                            )
                        }
                    }
                ],
                data: [],
                pagination: {
                    page: 1,
                    size: 10
                }
            },
            form: {
                validate: {
                    name: '',
                    title: '',
                    pid: null,
                    type: 1,
                    path: '',
                    page: '',
                    redirect: '',
                    weight: 1,
                    auth: 0,
                    is_blank: false
                },
                rules: {
                    type: [{ required: true, message: t('router.placeholder.type') }],
                    name: [{ required: true, validator: checkNameValidate, trigger: 'blur' }],
                    path: [{ required: true, message: t('router.placeholder.path') }],
                    page: [{ required: true, message: t('router.placeholder.page') }],
                    pid: [{ required: true, message: t('router.placeholder.up') }]
                }
            },
            open: false,
            detail: {
                id: 0,
                show: false
            },
            types: [
                { label: t('router.top'), value: 1 },
                { label: t('router.sub'), value: 2 }
            ],
            yesOrNo: [
                { label: t('global.no'), value: 0 },
                { label: t('global.yes'), value: 1 }
            ],
            edit: {
                status: false,
                id: 0,
                pid: null
            },
            icons: {
                active: `directional`,
                open: false
            },
            routes: [] as RouterTreeItem[]
        })
        applyTheme(styled)

        // 获取路由
        const getRouter = async () => {
            if (props.data && props.data?.length > 0) {
                params.routes = getRouterTreeData(props.data)
                params.table.data = params.routes
                params.total = props.data?.length
            } else {
                if (params.loading.list) return
                params.loading.list = true
                const condition = Object.assign(
                    { ...params.table.pagination },
                    { ...props.getRouterParams }
                )
                await handleAction(
                    props.getRouterAction,
                    props.getRouterMethod,
                    { ...condition },
                    'getRouterAction',
                    (res: ResponseData | any) => {
                        params.routes = getRouterTreeData(res?.data)
                        params.table.data = params.routes
                        emit('afterGetRouter', res)
                    },
                    () => (params.loading.list = false)
                )
            }
        }

        // 封装树形结构数据
        const getRouterTreeData = (data: any): RouterTreeItem[] => {
            const top = [] as RouterTreeItem[]
            for (let i = 0, l = data.length; i < l; i++) {
                const cur = data[i]
                const temp = {
                    ...cur,
                    key: cur?.id,
                    title: cur?.title || cur?.name,
                    value: cur?.id
                } as RouterTreeItem
                if (cur.children) temp.children = getRouterTreeData(cur.children)
                top.push(temp)
            }
            return top
        }

        // 单条删除
        const handleDeleteRouter = async (id: number) => {
            params.ids = [id]
            handleBatchDeleteRouter()
        }

        // 批量删除
        const handleBatchDeleteRouter = () => {
            if (params.ids.length <= 0) {
                message.destroy()
                message.error(t('global.delete.select'))
                return
            }
            if (params.loading.delete) return
            params.loading.delete = true
            handleAction(
                props.deleteRouterAction,
                props.deleteRouterMethod,
                {
                    id: params.ids.join(','),
                    ...props.deleteRouterParams
                },
                'deleteRouterAction',
                async (res?: ResponseData | any) => {
                    message.destroy()
                    message.success(t('global.success'))
                    params.ids = []
                    getRouter()
                    emit('afterDeleteRouter', res)
                },
                () => (params.loading.delete = false)
            )
        }

        // 批量操作 IDs
        const handleBatchItemChange = (rows: any[]) => {
            const ids: any[] = []
            for (let i = 0, l = rows.length; i < l; i++) {
                const id = rows[i]?.id || rows[i]?.key
                if (id) ids.push(id)
            }
            params.ids = ids
        }

        // 设置表单默认值
        const handleSetFormData = (data?: any) => {
            if (data && Object.keys(data)?.length > 0 && data?.id) {
                params.edit.status = true
                params.detail.id = 0
                params.detail.show = false
                params.edit.id = data?.id
                params.edit.pid = data?.pid
                params.form.validate = JSON.parse(JSON.stringify(data || {}))
                params.form.validate.weight = parseInt(data?.weight || 0)
            } else handleResetFormData()
        }

        // 重置表单数据
        const handleResetFormData = () => {
            if (routerFormRef.value) routerFormRef.value?.resetFields()
            params.edit.status = false
            params.edit.id = 0
            params.edit.pid = null
            params.detail.id = 0
            params.detail.show = false
            params.form.validate.type = 1
            params.form.validate.pid = 0
        }

        // 打开/关闭抽屉式表单
        const handleOpenDrawer = (data?: any) => {
            params.open = !params.open
            if (params.open) handleSetFormData(data)
            else handleResetFormData()
        }

        // 查看详情
        const handleDetail = (data?: any) => {
            params.detail.show = !params.detail.show
            if (data?.id && params.detail.show) {
                params.detail.id = data.id
                params.open = !params.open
                params.edit.pid = data?.pid
                params.form.validate = JSON.parse(JSON.stringify(data))
                params.form.validate.weight = parseInt(data?.weight || 0)
            } else params.detail.id = null
        }

        // 进入编辑
        const handleEditable = () => {
            params.edit.status = true
            params.edit.id = params.detail.id
            params.detail.show = false
        }

        // 添加子路由
        const handleAddSubRouter = (data?: any) => {
            handleOpenDrawer()
            params.form.validate.pid = data?.id
            params.form.validate.type = 2
        }

        // 路由类型切换
        const handleChangeType = () => {
            if (params.form.validate.type === 1) params.form.validate.pid = null
            else
                params.form.validate.pid =
                    params.edit.pid && params.edit.pid !== 0 ? params.edit.pid : null
        }

        // Table 分页变化
        const handlePageChange = (page: number, size: number) => {
            params.table.pagination.page = page
            params.table.pagination.size = size
            if (!(props.data && props.data?.length > 0)) getRouter()
        }

        // 新增 / 更新操作
        const handleCreateOrUpdate = () => {
            if (routerFormRef?.value) {
                if (params.loading.action) return
                params.loading.action = true
                const afterSuccess = () => {
                    handleOpenDrawer()
                    getRouter()
                    message.destroy()
                    message.success(t('global.success'))
                }
                routerFormRef.value
                    ?.validate()
                    .then(() => {
                        if (params.edit.status) {
                            if (!params.edit.id) {
                                message.destroy()
                                message.error(t('global.error.id'))
                                return
                            }
                            handleAction(
                                props.updateRouterAction,
                                props.updateRouterMethod,
                                Object.assign(
                                    { id: params.edit.id, ...params.form.validate },
                                    { ...props.updateRouterParams }
                                ),
                                'updateRouterAction',
                                () => {
                                    afterSuccess()
                                    emit('afterUpdateRouter')
                                },
                                () => (params.loading.action = false)
                            )
                        } else {
                            handleAction(
                                props.createRouterAction,
                                props.createRouterMethod,
                                Object.assign(
                                    { ...params.form.validate },
                                    { ...props.createRouterParams }
                                ),
                                'createRouterAction',
                                () => {
                                    afterSuccess()
                                    emit('afterCreateRouter')
                                },
                                () => (params.loading.action = false)
                            )
                        }
                    })
                    .catch(() => (params.loading.action = false))
            } else {
                message.destroy()
                message.error(t('global.error.form'))
            }
        }

        // 统一操作方式
        const handleAction = async (
            action: string | Function | undefined,
            method: string,
            params: any = {},
            name: string,
            callback?: Function,
            commonCallback?: Function
        ) => {
            if (action) {
                if (typeof action === 'string') {
                    if (params?.module) delete params.module
                    await $request?.[method](action, params)
                        .then(async (res: ResponseData | any) => {
                            if (res?.ret?.code !== 200 && res?.ret?.message) {
                                message.destroy()
                                message.error(res?.ret?.message)
                            } else await callback?.(res)
                        })
                        .catch((err: any) => {
                            message.destroy()
                            message.error({
                                content:
                                    err?.message || err?.statusText || t('global.error.unknown'),
                                duration: 10
                            })
                        })
                        .finally(() => commonCallback?.())
                } else if (typeof action === 'function') {
                    const response = await action(params)
                    if (typeof response === 'string') {
                        message.destroy()
                        message.error(response)
                    }
                    await callback?.(response)
                    commonCallback?.()
                }
            } else {
                message.destroy()
                message.warn({
                    content: t('language.error.config', { name }),
                    duration: 6
                })
                if (commonCallback) commonCallback()
            }
        }

        getRouter()

        // 空状态
        const renderEmpty = () => {
            return (
                <div class={styled.empty}>
                    <Empty description={t('global.no-data')} />
                </div>
            )
        }

        // 操作按钮
        const renderAction = () => {
            return (
                <Row class={styled.action}>
                    <Col span={24} class={styled.actionBtns}>
                        <Popconfirm
                            title={t('global.delete.confirm')}
                            overlayStyle={{ zIndex: Date.now() }}
                            okText={t('global.ok')}
                            cancelText={t('global.cancel')}
                            onConfirm={() => handleBatchDeleteRouter()}>
                            <Button
                                type="primary"
                                size="large"
                                danger={true}
                                icon={<DeleteOutlined />}>
                                {t('global.delete.batch')}
                            </Button>
                        </Popconfirm>
                        <Button
                            type="primary"
                            size="large"
                            class={styled.btnPrimary}
                            icon={<EditOutlined />}
                            onClick={handleOpenDrawer}>
                            {t('router.add')}
                        </Button>
                    </Col>
                </Row>
            )
        }

        // 表格
        const renderTable = () => {
            return (
                <Table
                    columns={params.table.columns}
                    dataSource={params.table.data}
                    rowKey={(record: any) => record?.id}
                    rowSelection={{
                        columnWidth: 60,
                        selectedRowKeys: params.ids,
                        onChange: (_keys: any[], rows: any[]) => {
                            handleBatchItemChange(rows)
                        }
                    }}
                    pagination={{
                        showLessItems: true,
                        showQuickJumper: true,
                        onChange: handlePageChange,
                        responsive: true,
                        total: params.total,
                        current: params.table.pagination.page,
                        pageSize: params.table.pagination.size
                    }}
                    bordered={true}
                    loading={params.loading.list}
                    scroll={{ x: 1200 }}
                    defaultExpandAllRows={true}
                />
            )
        }

        // 抽屉弹窗
        const renderDrawer = () => {
            const subRoute = [2, 3].includes(params.form.validate.type) ? (
                <FormItem label={t('router.up')} name="pid">
                    <TreeSelect
                        v-model:value={params.form.validate.pid}
                        placeholder={t('router.placeholder.up')}
                        allowClear={true}
                        disabled={params.detail.show}
                        treeData={params.routes}
                        popupClassName={styled.drawerSelect}
                        treeDefaultExpandAll={true}></TreeSelect>
                </FormItem>
            ) : null
            const topRoute =
                params.form.validate.type === 3 ? null : (
                    <>
                        <FormItem label={t('router.path')} name="path">
                            <Input
                                v-model:value={params.form.validate.path}
                                autocomplete="off"
                                disabled={params.detail.show}
                                readonly={params.detail.show}
                                placeholder={t('router.placeholder.path')}
                                onPressEnter={handleCreateOrUpdate}
                            />
                        </FormItem>
                        <FormItem label={t('router.page')} name="page">
                            <Input
                                v-model:value={params.form.validate.page}
                                autocomplete="off"
                                disabled={params.detail.show}
                                readonly={params.detail.show}
                                placeholder={t('router.placeholder.page')}
                                onPressEnter={handleCreateOrUpdate}
                            />
                        </FormItem>
                        <FormItem label={t('router.open')} name="is_blank">
                            <Switch
                                v-model:checked={params.form.validate.is_blank}
                                checked-children={t('global.external')}
                                disabled={params.detail.show}
                                un-checked-children={t('global.internal')}
                            />
                        </FormItem>
                        <FormItem label={t('router.weight')} name="weight">
                            <InputNumber
                                v-model:value={params.form.validate.weight}
                                min={1}
                                disabled={params.detail.show}
                                readonly={params.detail.show}
                            />
                        </FormItem>
                        <FormItem label={t('router.redirect')} name="redirect">
                            <Input
                                v-model:value={params.form.validate.redirect}
                                autocomplete="off"
                                disabled={params.detail.show}
                                readonly={params.detail.show}
                                placeholder={t('router.placeholder.redirect')}
                                onPressEnter={handleCreateOrUpdate}
                            />
                        </FormItem>
                    </>
                )
            const actionBtn = params.detail.show ? (
                <>
                    <Button
                        onClick={handleOpenDrawer}
                        loading={params.loading.action}
                        style={{ marginRight: $tools.convert2rem(8) }}>
                        {t('global.close')}
                    </Button>
                    <Button type="primary" loading={params.loading.action} onClick={handleEditable}>
                        {t('global.editable')}
                    </Button>
                </>
            ) : (
                <>
                    <Button
                        onClick={handleOpenDrawer}
                        loading={params.loading.action}
                        style={{ marginRight: $tools.convert2rem(8) }}>
                        {t('global.cancel')}
                    </Button>
                    <Button
                        type="primary"
                        loading={params.loading.action}
                        onClick={handleCreateOrUpdate}>
                        {params.edit.status ? t('global.update') : t('global.save')}
                    </Button>
                </>
            )
            const title = params.edit.status
                ? t('router.update')
                : params.detail.show
                  ? t('global.details')
                  : t('router.add')
            return (
                <Drawer
                    open={params.open}
                    rootClassName={styled.drawer}
                    width={580}
                    title={title}
                    v-slots={{ extra: () => actionBtn }}
                    onClose={handleOpenDrawer}>
                    <Form
                        ref={routerFormRef}
                        model={params.form.validate}
                        rules={params.form.rules}
                        labelCol={{ style: { width: $tools.convert2rem(120) } }}>
                        <FormItem label={t('router.type')} name="type">
                            <RadioGroup
                                options={params.types}
                                onChange={() => handleChangeType()}
                                disabled={params.detail.show}
                                v-model:value={params.form.validate.type}></RadioGroup>
                        </FormItem>
                        <FormItem label={t('router.name')} name="name">
                            <Input
                                v-model:value={params.form.validate.name}
                                autocomplete="off"
                                maxlength={60}
                                disabled={params.detail.show}
                                readonly={params.detail.show}
                                placeholder={t('router.placeholder.name')}
                                onPressEnter={handleCreateOrUpdate}
                            />
                        </FormItem>
                        <FormItem label={t('router.title')} name="title">
                            <Input
                                v-model:value={params.form.validate.title}
                                autocomplete="off"
                                maxlength={60}
                                disabled={params.detail.show}
                                readonly={params.detail.show}
                                placeholder={t('router.placeholder.title')}
                                onPressEnter={handleCreateOrUpdate}
                            />
                        </FormItem>
                        {subRoute}
                        {topRoute}
                        <FormItem label={t('router.login')} name="auth">
                            <RadioGroup
                                options={params.yesOrNo}
                                disabled={params.detail.show}
                                v-model:value={params.form.validate.auth}></RadioGroup>
                        </FormItem>
                    </Form>
                </Drawer>
            )
        }

        return () => (
            <div class={styled.container}>
                <ConfigProvider
                    locale={props.paginationLocale ?? zhCN}
                    renderEmpty={() => renderEmpty()}>
                    {renderAction()}
                    {renderTable()}
                    {renderDrawer()}
                </ConfigProvider>
            </div>
        )
    }
})

export default MiAppsRouter
