import { computed, createVNode, defineComponent, reactive, ref } from 'vue'
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
    Tag,
    Tabs,
    TabPane,
    type FormInstance,
    Tooltip,
    RadioButton,
    Popover
} from 'ant-design-vue'
import { wireframe, solid } from './icons'
import { MenuTreeProps, type MenuTreeItem } from './props'
import { $g } from '../../../utils/global'
import { $request } from '../../../utils/request'
import { $tools } from '../../../utils/tools'
import { useWindowResize } from '../../../hooks/useWindowResize'
import type { ResponseData } from '../../../utils/types'
import { ColorPicker } from 'vue3-colorpicker'
import * as AntdvIcons from '@ant-design/icons-vue'
import MiModal from '../../modal/Modal'
import MiDropdown from '../../dropdown/Dropdown'
import zhCN from 'ant-design-vue/es/locale/zh_CN'
import applyTheme from '../../_utils/theme'
import styled from './style/menu.module.less'
import 'vue3-colorpicker/style.css'

const MiAppsMenu = defineComponent({
    name: 'MiAppsMenu',
    inheritAttrs: false,
    props: MenuTreeProps(),
    emits: ['afterGetMenus', 'afterCreateMenus', 'afterUpdateMenus', 'afterDeleteMenus'],
    setup(props, { emit }) {
        const { t } = useI18n()
        const { width } = useWindowResize()
        const theme = computed(() => $g.theme.type)
        const menuFormRef = ref<FormInstance>()
        const badgeFormRef = ref<FormInstance>()
        const checkNameValidate = async (_rule: any, value: string) => {
            if (!value) return Promise.reject(t('menu.placeholder.name'))
            if (props.checkNameExistAction) {
                const condition = Object.assign(
                    {
                        id: params.edit.id || 0,
                        edit: params.edit.status ? 1 : 0,
                        name: params.form.validate.name
                    },
                    { ...props.checkNameExistParams }
                )
                if (typeof props.checkNameExistAction === 'string') {
                    return await $request?.[props.checkNameExistMethod](
                        props.checkNameExistAction,
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
                } else if (typeof props.checkNameExistAction === 'function') {
                    const response = await props.checkNameExistAction(condition)
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
                        title: t('menu.title'),
                        key: 'title',
                        dataIndex: 'title',
                        width: 200
                    },
                    {
                        title: t('menu.name'),
                        key: 'name',
                        dataIndex: 'name',
                        width: 160
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
                                  ? t('menu.sub.name')
                                  : record?.record?.type === 3
                                    ? t('menu.btn.permission')
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
                        width: 80
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
                        width: 320,
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
                                    <MiDropdown
                                        title={createVNode(
                                            <Button
                                                class={styled.btnWarn}
                                                type="default"
                                                icon={<AntdvIcons.MoreOutlined />}>
                                                {t('global.more')}
                                            </Button>
                                        )}
                                        items={getDropdownItems(record)}
                                    />
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
                    sub_title: '',
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
                    auth_login: 0,
                    is_blank: false,
                    is_hide: false
                },
                rules: {
                    name: [{ required: true, validator: checkNameValidate, trigger: 'blur' }],
                    path: [{ required: true, message: t('menu.placeholder.path') }],
                    page: [{ required: true, message: t('menu.placeholder.page') }],
                    pid: [{ required: true, message: t('menu.placeholder.up') }]
                },
                badge: {
                    validate: {
                        content: '',
                        color: '',
                        bgColor: '',
                        radius: 4,
                        size: 12,
                        icon: null
                    },
                    modal: {
                        open: false,
                        color: false,
                        bgColor: false
                    }
                }
            },
            open: false,
            detail: {
                id: 0,
                show: false
            },
            types: [
                { label: t('menu.top'), value: 1 },
                { label: t('menu.sub.name'), value: 2 },
                { label: t('menu.btn.permission'), value: 3 }
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
                type: `wireframe`,
                active: `directional`,
                open: false,
                badge: {
                    open: false,
                    type: `wireframe`,
                    active: `directional`
                }
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
                    key: cur?.id,
                    title: cur?.title || cur?.name,
                    value: cur?.id
                } as MenuTreeItem
                if (cur?.children) temp.children = getMenusTreeData(cur.children)
                top.push(temp)
            }
            return top
        }

        // 下拉选单
        const getDropdownItems = (data?: any) => {
            const items = [
                {
                    name: 'detail',
                    title: t('menu.detail'),
                    icon: AntdvIcons.MessageOutlined,
                    callback: () => handleDetail(data)
                }
            ]
            if (data?.type !== 3) {
                items.push({
                    name: 'add-submenu',
                    title: t('menu.sub.add'),
                    icon: AntdvIcons.NodeExpandOutlined,
                    callback: () => handleAddSubMenu(data)
                })
            }
            return items
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
                params.form.validate.weight = parseInt(data?.weight || 0)
            } else handleResetFormData()
        }

        // 重置表单数据
        const handleResetFormData = () => {
            if (menuFormRef.value) menuFormRef.value?.resetFields()
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
                                    {
                                        id: params.edit.id,
                                        ...params.form.validate,
                                        badge: { ...params.form.badge.validate }
                                    },
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
                                    { badge: { ...params.form.badge.validate } },
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

        // 打开图标选择 - 徽章
        const handleOpenBadgeModal = () => {
            params.icons.badge.open = !params.icons.badge.open
            params.form.badge.modal.open = true
        }

        // 选择 ICON
        const handleSetMenuIcon = (name: string) => {
            params.form.validate.icon = name
            handleOpenIconsModal()
        }

        // 选择 ICON
        const handleSetBadgeIcon = (name: string) => {
            params.form.badge.validate.icon = name
            params.form.badge.modal.open = true
            handleOpenBadgeModal()
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

        // 徽章配置弹窗
        const renderBadgeConfig = () => {
            return (
                <div class={styled.badgeForm}>
                    <Form
                        ref={badgeFormRef}
                        labelCol={{ style: { width: $tools.convert2rem(90) } }}>
                        <FormItem label={t('menu.badge.content')}>
                            <Input
                                v-model:value={params.form.badge.validate.content}
                                autocomplete="off"
                                placeholder={t('menu.placeholder.content')}
                            />
                        </FormItem>
                        <FormItem label={t('menu.badge.bg')}>
                            <Popover
                                v-model:open={params.form.badge.modal.bgColor}
                                title={false}
                                trigger="click"
                                v-slots={{
                                    content: () => (
                                        <ColorPicker
                                            class={styled.customizeColor}
                                            isWidget={true}
                                            theme={theme.value === 'light' ? `white` : `black`}
                                            pureColor={params.form.badge.validate.bgColor}
                                            disableHistory={true}
                                            disableAlpha={true}
                                            pickerType="chrome"
                                            format="hex"
                                            zIndex={Date.now()}
                                            onPureColorChange={(hex: string) => {
                                                params.form.badge.modal.bgColor = false
                                                params.form.badge.validate.bgColor = hex
                                            }}
                                        />
                                    )
                                }}
                                zIndex={Date.now()}>
                                <Input
                                    v-model:value={params.form.badge.validate.bgColor}
                                    class={styled.inputReadonly}
                                    autocomplete="off"
                                    readOnly={true}
                                    placeholder={t('menu.placeholder.color')}
                                />
                            </Popover>
                        </FormItem>
                        <FormItem label={t('menu.badge.size')}>
                            <InputNumber
                                v-model:value={params.form.badge.validate.size}
                                autocomplete="off"
                                min={12}
                                max={18}
                            />
                        </FormItem>
                        <FormItem label={t('menu.badge.color')}>
                            <Popover
                                v-model:open={params.form.badge.modal.color}
                                title={false}
                                trigger="click"
                                v-slots={{
                                    content: () => (
                                        <ColorPicker
                                            class={styled.customizeColor}
                                            isWidget={true}
                                            theme={theme.value === 'light' ? `white` : `black`}
                                            pureColor={params.form.badge.validate.color}
                                            disableHistory={true}
                                            disableAlpha={true}
                                            pickerType="chrome"
                                            format="hex"
                                            zIndex={Date.now()}
                                            onPureColorChange={(hex: string) => {
                                                params.form.badge.modal.color = false
                                                params.form.badge.validate.color = hex
                                            }}
                                        />
                                    )
                                }}
                                zIndex={Date.now()}>
                                <Input
                                    v-model:value={params.form.badge.validate.color}
                                    class={styled.inputReadonly}
                                    autocomplete="off"
                                    readOnly={true}
                                    placeholder={t('menu.placeholder.color')}
                                />
                            </Popover>
                        </FormItem>
                        <FormItem label={t('menu.icon')}>
                            <Input
                                v-model:value={params.form.badge.validate.icon}
                                autocomplete="off"
                                class={styled.inputReadonly}
                                readonly={true}
                                placeholder={t('menu.placeholder.icon')}
                                v-slots={{ suffix: () => <AntdvIcons.AimOutlined /> }}
                                onClick={handleOpenBadgeModal}
                            />
                        </FormItem>
                        <FormItem label={t('menu.badge.radius')}>
                            <InputNumber
                                v-model:value={params.form.badge.validate.radius}
                                autocomplete="off"
                            />
                        </FormItem>
                        <FormItem label={t('menu.badge.preview')}>{renderBadgePreview()}</FormItem>
                    </Form>
                </div>
            )
        }

        // 徽章效果预览
        const renderBadgePreview = () => {
            const tag: any = ref(null)
            if (params.form.badge.validate.content) {
                tag.value = (
                    <Tag
                        class={[styled.tag]}
                        color={params.form.badge.validate?.bgColor}
                        innerHTML={params.form.badge.validate.content}
                        style={{
                            borderRadius: $tools.convert2rem(
                                $tools.distinguishSize(params.form.badge.validate?.radius)
                            ),
                            fontSize: $tools.convert2rem(
                                $tools.distinguishSize(params.form.badge.validate?.size)
                            ),
                            color: params.form.badge.validate?.color || null
                        }}
                    />
                )
            } else if (params.form.badge.validate.icon) {
                const MiMenuItemTitleTagIcon: any = AntdvIcons?.[params.form.badge.validate.icon]
                tag.value = (
                    <MiMenuItemTitleTagIcon
                        class={[styled.tag]}
                        style={{
                            color: params.form.badge.validate?.color,
                            fontSize: $tools.convert2rem(
                                $tools.distinguishSize(params.form.badge.validate?.size)
                            ),
                            borderRadius: $tools.convert2rem(
                                $tools.distinguishSize(params.form.badge.validate?.radius)
                            )
                        }}
                    />
                )
            } else {
                tag.value = <span class={styled.tagText} innerHTML={t('menu.badge.none')}></span>
            }
            return tag.value
        }

        // 图标弹窗
        const renderMenuIconsModal = () => {
            const wrapIcons = (data: string[]) => {
                const res: any[] = []
                data.forEach((icon: string) => {
                    const IconTag = AntdvIcons[icon]
                    res.push(
                        <div
                            class={`${styled.tabItem} ${
                                params.form.validate.icon === icon ? styled.tabItemActive : ''
                            }`}
                            onClick={() => handleSetMenuIcon(icon)}>
                            <IconTag />
                        </div>
                    )
                })
                return <div class={styled.tabIcons}>{...res}</div>
            }

            const wireframeIcons = {
                directional: wrapIcons(wireframe?.directional),
                tips: wrapIcons(wireframe?.tips),
                edit: wrapIcons(wireframe?.edit),
                data: wrapIcons(wireframe?.data),
                brands: wrapIcons(wireframe?.brands),
                generic: wrapIcons(wireframe?.generic)
            }

            const solidIcons = {
                brands: wrapIcons(solid?.brands),
                data: wrapIcons(solid?.data),
                directional: wrapIcons(solid?.directional),
                edit: wrapIcons(solid?.edit),
                generic: wrapIcons(solid?.generic),
                tips: wrapIcons(solid?.tips)
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
                    <RadioGroup v-model:value={params.icons.type} class={styled.tabRadio}>
                        <RadioButton value="wireframe">{t('menu.icons.wireframe')}</RadioButton>
                        <RadioButton value="solid">{t('menu.icons.solid')}</RadioButton>
                    </RadioGroup>
                    <Tabs
                        v-model:activeKey={params.icons.active}
                        class={styled.tab}
                        centered={width.value >= 768}>
                        <TabPane key="directional" tab={t('menu.icons.directional')}>
                            {params.icons.type === 'wireframe'
                                ? wireframeIcons.directional
                                : solidIcons.directional}
                        </TabPane>
                        <TabPane key="tips" tab={t('menu.icons.tips')}>
                            {params.icons.type === 'wireframe'
                                ? wireframeIcons.tips
                                : solidIcons.tips}
                        </TabPane>
                        <TabPane key="edit" tab={t('menu.icons.edit')}>
                            {params.icons.type === 'wireframe'
                                ? wireframeIcons.edit
                                : solidIcons.edit}
                        </TabPane>
                        <TabPane key="data" tab={t('menu.icons.data')}>
                            {params.icons.type === 'wireframe'
                                ? wireframeIcons.data
                                : solidIcons.data}
                        </TabPane>
                        <TabPane key="brands" tab={t('menu.icons.brands')}>
                            {params.icons.type === 'wireframe'
                                ? wireframeIcons.brands
                                : solidIcons.brands}
                        </TabPane>
                        <TabPane key="generic" tab={t('menu.icons.generic')}>
                            {params.icons.type === 'wireframe'
                                ? wireframeIcons.generic
                                : solidIcons.generic}
                        </TabPane>
                    </Tabs>
                </MiModal>
            )
        }

        // 图标弹窗
        const renderBadgeIconsModal = () => {
            const wrapIcons = (data: string[]) => {
                const res: any[] = []
                data.forEach((icon: string) => {
                    const IconTag = AntdvIcons[icon]
                    res.push(
                        <div
                            class={`${styled.tabItem} ${
                                params.form.validate.icon === icon ? styled.tabItemActive : ''
                            }`}
                            onClick={() => handleSetBadgeIcon(icon)}>
                            <IconTag />
                        </div>
                    )
                })
                return <div class={styled.tabIcons}>{...res}</div>
            }

            const wireframeIcons = {
                directional: wrapIcons(wireframe?.directional),
                tips: wrapIcons(wireframe?.tips),
                edit: wrapIcons(wireframe?.edit),
                data: wrapIcons(wireframe?.data),
                brands: wrapIcons(wireframe?.brands),
                generic: wrapIcons(wireframe?.generic)
            }

            const solidIcons = {
                brands: wrapIcons(solid?.brands),
                data: wrapIcons(solid?.data),
                directional: wrapIcons(solid?.directional),
                edit: wrapIcons(solid?.edit),
                generic: wrapIcons(solid?.generic),
                tips: wrapIcons(solid?.tips)
            }

            return (
                <MiModal
                    open={params.icons.badge.open}
                    title={false}
                    footer={false}
                    onCancel={handleOpenBadgeModal}
                    zIndex={Date.now()}
                    animation="slide"
                    maskStyle={{ backdropFilter: `blur(0.5rem)` }}
                    width={width.value < 768 ? '100%' : 748}>
                    <RadioGroup v-model:value={params.icons.badge.type} class={styled.tabRadio}>
                        <RadioButton value="wireframe">{t('menu.icons.wireframe')}</RadioButton>
                        <RadioButton value="solid">{t('menu.icons.solid')}</RadioButton>
                    </RadioGroup>
                    <Tabs
                        v-model:activeKey={params.icons.badge.active}
                        class={styled.tab}
                        centered={width.value >= 768}>
                        <TabPane key="directional" tab={t('menu.icons.directional')}>
                            {params.icons.badge.type === 'wireframe'
                                ? wireframeIcons.directional
                                : solidIcons.directional}
                        </TabPane>
                        <TabPane key="tips" tab={t('menu.icons.tips')}>
                            {params.icons.badge.type === 'wireframe'
                                ? wireframeIcons.tips
                                : solidIcons.tips}
                        </TabPane>
                        <TabPane key="edit" tab={t('menu.icons.edit')}>
                            {params.icons.badge.type === 'wireframe'
                                ? wireframeIcons.edit
                                : solidIcons.edit}
                        </TabPane>
                        <TabPane key="data" tab={t('menu.icons.data')}>
                            {params.icons.badge.type === 'wireframe'
                                ? wireframeIcons.data
                                : solidIcons.data}
                        </TabPane>
                        <TabPane key="brands" tab={t('menu.icons.brands')}>
                            {params.icons.badge.type === 'wireframe'
                                ? wireframeIcons.brands
                                : solidIcons.brands}
                        </TabPane>
                        <TabPane key="generic" tab={t('menu.icons.generic')}>
                            {params.icons.badge.type === 'wireframe'
                                ? wireframeIcons.generic
                                : solidIcons.generic}
                        </TabPane>
                    </Tabs>
                </MiModal>
            )
        }

        // 抽屉弹窗
        const renderDrawer = () => {
            const labels = {
                title: (
                    <div>
                        <span innerHTML={t('menu.title')}></span>
                        <Tooltip title={t('menu.tips.title')} trigger="hover" zIndex={Date.now()}>
                            <AntdvIcons.QuestionCircleOutlined
                                style={{
                                    marginRight: $tools.convert2rem(4),
                                    marginLeft: $tools.convert2rem(4)
                                }}
                            />
                        </Tooltip>
                    </div>
                ),
                weight: (
                    <div>
                        <span innerHTML={t('menu.weight')}></span>
                        <Tooltip title={t('menu.tips.weight')} trigger="hover" zIndex={Date.now()}>
                            <AntdvIcons.QuestionCircleOutlined
                                style={{
                                    marginRight: $tools.convert2rem(4),
                                    marginLeft: $tools.convert2rem(4)
                                }}
                            />
                        </Tooltip>
                    </div>
                ),
                badge: (
                    <div>
                        <span innerHTML={t('menu.badge.label')}></span>
                        <Tooltip title={t('menu.tips.badge')} trigger="hover" zIndex={Date.now()}>
                            <AntdvIcons.QuestionCircleOutlined
                                style={{
                                    marginRight: $tools.convert2rem(4),
                                    marginLeft: $tools.convert2rem(4)
                                }}
                            />
                        </Tooltip>
                    </div>
                )
            }
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
            const normalMenu =
                params.form.validate.type === 3 ? null : (
                    <>
                        <FormItem label={labels.title} name="title">
                            <Input
                                v-model:value={params.form.validate.title}
                                autocomplete="off"
                                maxlength={60}
                                disabled={params.detail.show}
                                readonly={params.detail.show}
                                placeholder={t('menu.placeholder.title')}
                                onPressEnter={handleCreateOrUpdate}
                            />
                        </FormItem>
                        <FormItem label={t('menu.subtitle')} name="sub_title">
                            <Input
                                v-model:value={params.form.validate.sub_title}
                                autocomplete="off"
                                maxlength={60}
                                disabled={params.detail.show}
                                readonly={params.detail.show}
                                placeholder={t('menu.placeholder.subtitle')}
                                onPressEnter={handleCreateOrUpdate}
                            />
                        </FormItem>
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
                                readonly={true}
                                class={styled.inputReadonly}
                                v-slots={{ suffix: () => <AntdvIcons.AimOutlined /> }}
                                placeholder={t('menu.placeholder.icon')}
                                onClick={handleOpenIconsModal}
                            />
                        </FormItem>
                        <FormItem label={labels.badge} name="icon">
                            {params.detail.show ? (
                                <Button type="primary" disabled={true}>
                                    {t('menu.badge.setting')}
                                </Button>
                            ) : (
                                <Popover
                                    v-model:open={params.form.badge.modal.open}
                                    title={false}
                                    trigger="click"
                                    v-slots={{ content: () => renderBadgeConfig() }}
                                    zIndex={Date.now()}>
                                    <Button type="primary">{t('menu.badge.setting')}</Button>
                                </Popover>
                            )}
                        </FormItem>
                        <FormItem label={t('menu.open')} name="is_blank">
                            <Switch
                                v-model:checked={params.form.validate.is_blank}
                                checked-children={t('global.external')}
                                disabled={params.detail.show}
                                un-checked-children={t('global.internal')}
                            />
                        </FormItem>
                        <FormItem label={labels.weight} name="weight">
                            <InputNumber
                                v-model:value={params.form.validate.weight}
                                min={1}
                                disabled={params.detail.show}
                                readonly={params.detail.show}
                            />
                        </FormItem>
                        <FormItem label={t('menu.router.hide')} name="is_hide">
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
                        {subMenu}
                        <FormItem
                            label={
                                params.form.validate.type === 3
                                    ? t('menu.btn.name')
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
                        {normalMenu}
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
                    {renderMenuIconsModal()}
                    {renderBadgeIconsModal()}
                </ConfigProvider>
            </div>
        )
    }
})

export default MiAppsMenu
