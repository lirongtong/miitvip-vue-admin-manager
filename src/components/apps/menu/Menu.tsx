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
    Tabs,
    TabPane,
    type FormInstance,
    Tooltip
} from 'ant-design-vue'
import { directional, tips, edit, data, brands, generic } from './icons'
import { MenuTreeProps, type MenuTreeItem } from './props'
import { $request } from '../../../utils/request'
import { $tools } from '../../../utils/tools'
import { useWindowResize } from '../../../hooks/useWindowResize'
import type { ResponseData } from '../../../utils/types'
import * as AntdvIcons from '@ant-design/icons-vue'
import MiModal from '../../modal/Modal'
import zhCN from 'ant-design-vue/es/locale/zh_CN'
import applyTheme from '../../_utils/theme'
import styled from './style/menu.module.less'

const MiAppsMenu = defineComponent({
    name: 'MiAppsMenu',
    inheritAttrs: false,
    props: MenuTreeProps(),
    emits: ['afterGetMenus', 'afterCreateMenus', 'afterUpdateMenus', 'afterDeleteMenus'],
    setup(props, { emit }) {
        const { t } = useI18n()
        const { width } = useWindowResize()
        const menuFormRef = ref<FormInstance>()

        // 多语言 key 值格式校验
        const checkLangKeyValidate = (_rule: any, value: string) => {
            if (!value) return Promise.resolve()
            if (!/^[a-zA-Z]{1}[a-zA-Z0-9\-\.\_]/gi.test(value)) {
                return Promise.reject(t('menu.error.lang'))
            }
            return Promise.resolve()
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
                        title: t('menu.name'),
                        key: 'name',
                        dataIndex: 'name',
                        width: 200
                    },
                    {
                        title: t('menu.type'),
                        key: 'type',
                        dataIndex: 'type',
                        align: 'center',
                        customRender: (record: any) => {
                            return record?.record?.type === 1
                                ? t('menu.top')
                                : record?.record?.type === 2
                                  ? t('menu.sub')
                                  : record?.record?.type === 3
                                    ? t('menu.btn')
                                    : t('menu.unknow')
                        },
                        width: 120
                    },
                    {
                        title: t('menu.icon'),
                        key: 'icon',
                        dataIndex: 'icon',
                        align: 'center',
                        customRender: (record: any) => {
                            const IconTag = AntdvIcons?.[record.record.icon]
                            return <IconTag style={`font-size: 1.25rem`} />
                        },
                        width: 100
                    },
                    {
                        title: t('menu.page'),
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
                        title: t('menu.path'),
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
                        title: t('menu.weight'),
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
                                        icon={<AntdvIcons.FormOutlined />}
                                        onClick={() => handleOpenDrawer(record)}>
                                        {t('global.edit')}
                                    </Button>
                                    <Button
                                        type="default"
                                        class={styled.btnInfo}
                                        onClick={() => handleDetail(record)}
                                        icon={<AntdvIcons.MessageOutlined />}>
                                        {t('menu.detail')}
                                    </Button>
                                    {record?.type === 3 ? null : (
                                        <Button
                                            class={styled.btnWarn}
                                            type="default"
                                            onClick={() => handleAddSubMenu(record)}
                                            icon={<AntdvIcons.NodeExpandOutlined />}>
                                            {t('menu.add-sub')}
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
                                            onClick: () => handleDeleteMenus(record?.id)
                                        }}
                                        key={record?.key}>
                                        <Button
                                            type="primary"
                                            danger={true}
                                            icon={<AntdvIcons.DeleteOutlined />}>
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
                    sub_name: '',
                    pid: null,
                    type: 1,
                    path: '',
                    page: '',
                    redirect: '',
                    icon: '',
                    weight: 1,
                    lang: '',
                    auth_mark: '',
                    auth_policy: 2,
                    auth_state: 1,
                    auth_login: 1,
                    is_router: true,
                    is_blank: false,
                    is_hide: false
                },
                rules: {
                    name: [{ required: true, message: t('menu.placeholder.name') }],
                    path: [{ required: true, message: t('menu.placeholder.path') }],
                    page: [{ required: true, message: t('menu.placeholder.page') }],
                    pid: [{ required: true, message: t('menu.placeholder.up') }],
                    lang: [{ required: false, validator: checkLangKeyValidate }]
                }
            },
            open: false,
            detail: {
                id: 0,
                show: false
            },
            types: [
                { label: t('menu.top'), value: 1 },
                { label: t('menu.sub'), value: 2 },
                { label: t('menu.btn'), value: 3 }
            ],
            policies: [
                { label: t('menu.policies.invisible'), value: 0 },
                { label: t('menu.policies.visible'), value: 1 },
                { label: t('menu.policies.accessible'), value: 2 }
            ],
            states: [
                { label: t('global.invalid'), value: 0 },
                { label: t('global.valid'), value: 1 }
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
            menus: [] as MenuTreeItem[]
        })
        applyTheme(styled)

        // 获取菜单数据
        const getMenus = async () => {
            if (props.data && props.data?.length > 0) {
                params.menus = getMenusTreeData(props.data)
                params.table.data = params.menus
                params.total = props.data?.length
            } else {
                if (params.loading.list) return
                params.loading.list = true
                const condition = Object.assign(
                    { ...params.table.pagination },
                    { ...props.getMenusParams }
                )
                await handleAction(
                    props.getMenusAction,
                    props.getMenusMethod,
                    { ...condition },
                    'getMenusAction',
                    (res: ResponseData | any) => {
                        params.menus = getMenusTreeData(res?.data)
                        params.table.data = params.menus
                        emit('afterGetMenus', res)
                    },
                    () => (params.loading.list = false)
                )
            }
        }

        // 封装树形菜单
        const getMenusTreeData = (data: any): MenuTreeItem[] => {
            const top = [] as MenuTreeItem[]
            for (let i = 0, l = data.length; i < l; i++) {
                const cur = data[i]
                const temp = {
                    ...cur,
                    key: cur.id,
                    title: cur.name,
                    value: cur.id
                } as MenuTreeItem
                if (cur.children) temp.children = getMenusTreeData(cur.children)
                top.push(temp)
            }
            return top
        }

        // 单条删除
        const handleDeleteMenus = async (id: number) => {
            params.ids = [id]
            handleBatchDeleteMenus()
        }

        // 批量删除
        const handleBatchDeleteMenus = () => {
            if (params.ids.length <= 0) {
                message.destroy()
                message.error(t('global.delete.select'))
                return
            }
            if (params.loading.delete) return
            params.loading.delete = true
            handleAction(
                props.deleteMenusAction,
                props.deleteMenusMethod,
                {
                    id: params.ids.join(','),
                    ...props.deleteMenusParams
                },
                'deleteMenusAction',
                async (res?: ResponseData | any) => {
                    message.destroy()
                    message.success(t('global.success'))
                    params.ids = []
                    getMenus()
                    emit('afterDeleteMenus', res)
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
                params.form.validate.is_router = data?.is_router > 0
                params.form.validate.weight = parseInt(data?.weight || 0)
            } else handleResetFormData()
        }

        // 重置表单数据
        const handleResetFormData = () => {
            params.edit.status = false
            params.edit.id = 0
            params.edit.pid = null
            params.detail.id = 0
            params.detail.show = false
            params.form.validate.type = 1
            params.form.validate.pid = 0
            params.form.validate.auth_mark = ''
            params.form.validate.auth_policy = 2
            params.form.validate.auth_state = 1
            if (menuFormRef.value) menuFormRef.value.resetFields()
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
                params.form.validate.is_router = data?.is_router > 0
                params.form.validate.weight = parseInt(data?.weight || 0)
            } else params.detail.id = null
        }

        // 进入编辑
        const handleEditable = () => {
            params.edit.status = true
            params.edit.id = params.detail.id
            params.detail.show = false
        }

        // 添加子菜单
        const handleAddSubMenu = (data?: any) => {
            handleOpenDrawer()
            params.form.validate.pid = data?.id
            params.form.validate.type = 2
        }

        // 菜单类型切换
        const handleChangeType = () => {
            if (params.form.validate.type === 1) params.form.validate.pid = null
            else
                params.form.validate.pid =
                    params.edit.pid && params.edit.pid !== 0 ? params.edit.pid : null
        }

        // Table 分页变化
        const handlePageChange = (page: number, size: number) => {
            console.log(page, size)
        }

        // 新增 / 更新操作
        const handleCreateOrUpdate = () => {
            if (menuFormRef?.value) {
                if (params.loading.action) return
                params.loading.action = true
                const afterSuccess = () => {
                    handleOpenDrawer()
                    menuFormRef.value?.resetFields()
                    params.form.validate.pid = null
                    params.form.validate.type = 1
                    params.form.validate.auth_policy = 2
                    getMenus()
                    message.destroy()
                    message.success(t('global.success'))
                }
                menuFormRef.value
                    ?.validate()
                    .then(() => {
                        if (params.edit.status) {
                            // 更新
                            if (!params.edit.id) {
                                message.destroy()
                                message.error(t('global.error.id'))
                                return
                            }
                            handleAction(
                                props.updateMenusAction,
                                props.updateMenusMethod,
                                Object.assign(
                                    { id: params.edit.id, ...params.form.validate },
                                    { ...props.updateMenusParams }
                                ),
                                'updateMenusAction',
                                () => {
                                    afterSuccess()
                                    emit('afterUpdateMenus')
                                },
                                () => (params.loading.action = false)
                            )
                        } else {
                            // 新增
                            handleAction(
                                props.createMenusAction,
                                props.createMenusMethod,
                                Object.assign(
                                    { ...params.form.validate },
                                    { ...props.createMenusParams }
                                ),
                                'createMenusAction',
                                () => {
                                    afterSuccess()
                                    emit('afterCreateMenus')
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

        // 打开图标选择弹窗
        const handleOpenIconsModal = () => {
            if (!params.detail.show) params.icons.open = !params.icons.open
        }

        // 选择 ICON
        const handleSetIcon = (name: string) => {
            params.form.validate.icon = name
            handleOpenIconsModal()
        }

        getMenus()

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
                            onConfirm={() => handleBatchDeleteMenus()}>
                            <Button
                                type="primary"
                                size="large"
                                danger={true}
                                icon={<AntdvIcons.DeleteOutlined />}>
                                {t('global.delete.batch')}
                            </Button>
                        </Popconfirm>
                        <Button
                            type="primary"
                            size="large"
                            class={styled.btnPrimary}
                            icon={<AntdvIcons.EditOutlined />}
                            onClick={handleOpenDrawer}>
                            {t('menu.add')}
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
                    scroll={{ x: 1200 }}></Table>
            )
        }

        // 图标选择触发点
        const renderIconsTrigger = () => {
            return (
                <a onClick={handleOpenIconsModal}>
                    <AntdvIcons.AimOutlined />
                </a>
            )
        }

        // 图标弹窗
        const renderIconsModal = () => {
            const wrapIcons = (data: string[]) => {
                const res: any[] = []
                data.forEach((icon: string) => {
                    const IconTag = AntdvIcons[icon]
                    res.push(
                        <div
                            class={`${styled.tabItem} ${
                                params.form.validate.icon === icon ? styled.tabItemActive : ''
                            }`}
                            onClick={() => handleSetIcon(icon)}>
                            <IconTag />
                        </div>
                    )
                })
                return res
            }

            const icons = {
                directional: wrapIcons(directional),
                tips: wrapIcons(tips),
                edit: wrapIcons(edit),
                data: wrapIcons(data),
                brands: wrapIcons(brands),
                generic: wrapIcons(generic)
            }

            return (
                <MiModal
                    open={params.icons.open}
                    title={false}
                    footer={false}
                    onCancel={handleOpenIconsModal}
                    zIndex={Date.now()}
                    animation="slide"
                    maskStyle={{ backdropFilter: `blur(0.5rem)` }}
                    width={width.value < 768 ? '100%' : 748}>
                    <Tabs
                        v-model:activeKey={params.icons.active}
                        class={styled.tab}
                        centered={width.value >= 768}>
                        <TabPane key="directional" tab={t('menu.icons.directional')}>
                            {...icons.directional}
                        </TabPane>
                        <TabPane key="tips" tab={t('menu.icons.tips')}>
                            {...icons.tips}
                        </TabPane>
                        <TabPane key="edit" tab={t('menu.icons.edit')}>
                            {...icons.edit}
                        </TabPane>
                        <TabPane key="data" tab={t('menu.icons.data')}>
                            {...icons.data}
                        </TabPane>
                        <TabPane key="brands" tab={t('menu.icons.brands')}>
                            {...icons.brands}
                        </TabPane>
                        <TabPane key="generic" tab={t('menu.icons.generic')}>
                            {...icons.generic}
                        </TabPane>
                    </Tabs>
                </MiModal>
            )
        }

        // 抽屉弹窗
        const renderDrawer = () => {
            // 按钮 / 权限
            const btnMenu =
                params.form.validate.type === 3 ? (
                    <>
                        <FormItem label={t('menu.auth')} name="auth_mark">
                            <Input
                                v-model:value={params.form.validate.auth_mark}
                                autocomplete="off"
                                disabled={params.detail.show}
                                readonly={params.detail.show}
                                placeholder={t('menu.placeholder.auth')}
                            />
                        </FormItem>
                        <FormItem label={t('menu.policy')} name="auth_policy">
                            <RadioGroup
                                options={params.policies}
                                disabled={params.detail.show}
                                v-model:value={params.form.validate.auth_policy}></RadioGroup>
                        </FormItem>
                        <FormItem label={t('global.state')} name="auth_state">
                            <RadioGroup
                                options={params.states}
                                disabled={params.detail.show}
                                v-model:value={params.form.validate.auth_state}></RadioGroup>
                        </FormItem>
                    </>
                ) : null
            // 子菜单
            const subMenu = [2, 3].includes(params.form.validate.type) ? (
                <FormItem label={t('menu.up')} name="pid">
                    <TreeSelect
                        v-model:value={params.form.validate.pid}
                        placeholder={t('menu.placeholder.up')}
                        allowClear={true}
                        disabled={params.detail.show}
                        treeData={params.menus}
                        popupClassName={styled.drawerSelect}
                        treeDefaultExpandAll={true}></TreeSelect>
                </FormItem>
            ) : null
            // 一级菜单
            const firstMenu =
                params.form.validate.type === 3 ? null : (
                    <>
                        <FormItem label={t('menu.subname')} name="sub_name">
                            <Input
                                v-model:value={params.form.validate.sub_name}
                                autocomplete="off"
                                maxlength={60}
                                disabled={params.detail.show}
                                readonly={params.detail.show}
                                placeholder={t('menu.placeholder.subname')}
                                onPressEnter={handleCreateOrUpdate}
                            />
                        </FormItem>
                        <FormItem label={t('menu.path')} name="path">
                            <Input
                                v-model:value={params.form.validate.path}
                                autocomplete="off"
                                disabled={params.detail.show}
                                readonly={params.detail.show}
                                placeholder={t('menu.placeholder.path')}
                                onPressEnter={handleCreateOrUpdate}
                            />
                        </FormItem>
                        <FormItem label={t('menu.page')} name="page">
                            <Input
                                v-model:value={params.form.validate.page}
                                autocomplete="off"
                                disabled={params.detail.show}
                                readonly={params.detail.show}
                                placeholder={t('menu.placeholder.page')}
                                onPressEnter={handleCreateOrUpdate}
                            />
                        </FormItem>
                        <FormItem label={t('menu.icon')} name="icon">
                            <Input
                                v-model:value={params.form.validate.icon}
                                autocomplete="off"
                                disabled={true}
                                readonly={true}
                                v-slots={{ suffix: () => renderIconsTrigger() }}
                                placeholder={t('menu.placeholder.icon')}
                            />
                        </FormItem>
                        <FormItem label={t('menu.router')} name="is_router">
                            <Switch
                                v-model:checked={params.form.validate.is_router}
                                checked-children={t('global.yes')}
                                disabled={params.detail.show}
                                un-checked-children={t('global.no')}
                            />
                        </FormItem>
                        <FormItem label={t('menu.open')} name="is_blank">
                            <Switch
                                v-model:checked={params.form.validate.is_blank}
                                checked-children={t('global.external')}
                                disabled={params.detail.show}
                                un-checked-children={t('global.internal')}
                            />
                        </FormItem>
                        <FormItem label={t('menu.weight')} name="weight">
                            <InputNumber
                                v-model:value={params.form.validate.weight}
                                min={1}
                                disabled={params.detail.show}
                                readonly={params.detail.show}
                            />
                        </FormItem>
                        <FormItem label={t('menu.hide-router')} name="is_hide">
                            <Switch
                                v-model:checked={params.form.validate.is_hide}
                                checked-children={t('global.yes')}
                                disabled={params.detail.show}
                                un-checked-children={t('global.no')}
                            />
                        </FormItem>
                        <FormItem label={t('menu.redirect')} name="redirect">
                            <Input
                                v-model:value={params.form.validate.redirect}
                                autocomplete="off"
                                disabled={params.detail.show}
                                readonly={params.detail.show}
                                placeholder={t('menu.placeholder.redirect')}
                                onPressEnter={handleCreateOrUpdate}
                            />
                        </FormItem>
                    </>
                )
            // 操作按钮
            const actionBtn = params.detail.show ? (
                <>
                    <Button
                        onClick={handleOpenDrawer}
                        style={{ marginRight: $tools.convert2rem(8) }}>
                        {t('global.close')}
                    </Button>
                    <Button type="primary" onClick={handleEditable}>
                        {t('global.editable')}
                    </Button>
                </>
            ) : (
                <>
                    <Button
                        onClick={handleOpenDrawer}
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
            // 标题
            const title = params.edit.status
                ? t('menu.update')
                : params.detail.show
                  ? t('global.details')
                  : t('menu.add')

            return (
                <Drawer
                    open={params.open}
                    rootClassName={styled.drawer}
                    width={580}
                    title={title}
                    v-slots={{ extra: () => actionBtn }}
                    onClose={handleOpenDrawer}>
                    <Form
                        ref={menuFormRef}
                        model={params.form.validate}
                        rules={params.form.rules}
                        labelCol={{ style: { width: $tools.convert2rem(120) } }}>
                        <FormItem label={t('menu.type')} name="type">
                            <RadioGroup
                                options={params.types}
                                onChange={() => handleChangeType()}
                                disabled={params.detail.show}
                                v-model:value={params.form.validate.type}></RadioGroup>
                        </FormItem>
                        <FormItem
                            label={
                                params.form.validate.type === 3
                                    ? t('menu.btn-name')
                                    : t('menu.name')
                            }
                            name="name">
                            <Input
                                v-model:value={params.form.validate.name}
                                autocomplete="off"
                                maxlength={60}
                                disabled={params.detail.show}
                                readonly={params.detail.show}
                                placeholder={t('menu.placeholder.name')}
                                onPressEnter={handleCreateOrUpdate}
                            />
                        </FormItem>
                        {subMenu}
                        {firstMenu}
                        <FormItem label={t('menu.lang')} name="lang">
                            <Input
                                v-model:value={params.form.validate.lang}
                                autocomplete="off"
                                disabled={params.detail.show}
                                readonly={params.detail.show}
                                placeholder={t('menu.placeholder.lang')}
                                onPressEnter={handleCreateOrUpdate}
                            />
                        </FormItem>
                        <FormItem label={t('menu.login')} name="auth_login">
                            <RadioGroup
                                options={params.yesOrNo}
                                disabled={params.detail.show}
                                v-model:value={params.form.validate.auth_login}></RadioGroup>
                        </FormItem>
                        {btnMenu}
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
                    {renderIconsModal()}
                </ConfigProvider>
            </div>
        )
    }
})

export default MiAppsMenu
