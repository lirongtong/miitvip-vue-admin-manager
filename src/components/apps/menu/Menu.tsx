import { defineComponent, reactive } from 'vue'
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
    Switch
} from 'ant-design-vue'
import { MenuTreeProps } from './props'
import { $request } from '../../../utils/request'
import { $tools } from '../../../utils/tools'
import { type ResponseData } from '../../../utils/types'
import * as AntdvIcons from '@ant-design/icons-vue'
import zhCN from 'ant-design-vue/es/locale/zh_CN'
import applyTheme from '../../_utils/theme'
import styled from './style/menu.module.less'

const MiAppsMenu = defineComponent({
    name: 'MiAppsMenu',
    inheritAttrs: false,
    props: MenuTreeProps(),
    emits: ['afterGetMenus'],
    setup(props, { emit }) {
        const { t } = useI18n()
        const params = reactive({
            ids: [],
            loading: false,
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
                        dataIndex: 'page',
                        width: 200,
                        ellipsis: true
                    },
                    {
                        title: t('menu.path'),
                        key: 'path',
                        dataIndex: 'path',
                        width: 200,
                        ellipsis: true
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
                        align: 'center'
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
                    is_router: true,
                    is_blank: false,
                    is_hide: false
                },
                rules: {
                    name: [{ required: true, message: t('menu.placeholder.name') }],
                    page: [{ required: true, message: t('menu.placeholder.page') }],
                    pid: [{ required: true, message: t('menu.placeholder.up') }]
                }
            },
            open: false,
            detail: 0,
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
            edit: {
                status: false,
                id: 0,
                pid: null
            }
        })
        applyTheme(styled)

        const getMenus = async () => {
            if (props.data && props.data?.length > 0) {
                params.table.data = props.data
                params.total = props.data?.length
            } else {
                if (params.loading) return
                params.loading = true
                await handleAction(
                    props.getMenusAction,
                    props.getMenusMethod,
                    props.getMenusParams,
                    'getMenusAction',
                    (res: ResponseData | any) => emit('afterGetMenus', res),
                    () => (params.loading = false)
                )
            }
        }

        const handleDeleteMenus = () => {}

        const handleSetFormData = (data?: any) => {
            if (data?.record && Object.keys(data?.record)?.length > 0) {
                params.edit.status = true
                params.detail = 0
                params.edit.id = data?.record?.id
                params.edit.pid = data?.record?.pid
                params.form.validate = JSON.parse(JSON.stringify(data?.record || {}))
                params.form.validate.is_router = data?.record?.is_router > 0
                params.form.validate.weight = parseInt(data?.record?.weight || 0)
            } else handleResetFormData()
        }
        const handleResetFormData = () => {
            params.edit.status = false
            params.edit.id = 0
            params.edit.pid = null
            params.detail = 0
            params.form.validate.type = 1
        }

        const handleOpenDrawer = (data?: any) => {
            params.open = !params.open
            if (params.open) handleSetFormData(data)
            else handleResetFormData()
        }

        const handleChangeType = () => {
            if (params.form.validate.type === 1) params.form.validate.pid = null
            else
                params.form.validate.pid =
                    params.edit.pid && params.edit.pid !== 0 ? params.edit.pid : null
        }

        const handlePageChange = (page: number, size: number) => {
            console.log(page, size)
        }

        const handleCreateOrUpdate = () => {}

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
                            style={{ zIndex: Date.now() }}
                            okText={t('global.ok')}
                            cancelText={t('global.cancel')}
                            onConfirm={() => handleDeleteMenus()}>
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
                            icon={<AntdvIcons.EditOutlined />}
                            onClick={handleOpenDrawer}>
                            {t('menu.add')}
                        </Button>
                    </Col>
                </Row>
            )
        }

        // Table
        const renderTable = () => {
            return (
                <Table
                    columns={params.table.columns}
                    dataSource={params.table.data}
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
                    loading={params.loading}
                    scroll={{ x: 1200 }}></Table>
            )
        }

        const renderIconsTrigger = () => {}

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
                                disabled={params.detail}
                                readonly={params.detail}
                                placeholder={t('menu.placeholder.auth')}
                            />
                        </FormItem>
                        <FormItem label={t('menu.policy')} name="auth_policy">
                            <RadioGroup
                                options={params.policies}
                                disabled={params.detail}
                                v-model:value={params.form.validate.auth_policy}></RadioGroup>
                        </FormItem>
                        <FormItem label={t('global.state')} name="auth_state">
                            <RadioGroup
                                options={params.states}
                                disabled={params.detail}
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
                                disabled={params.detail}
                                readonly={params.detail}
                                placeholder={t('menu.placeholder.subname')}
                            />
                        </FormItem>
                        <FormItem label={t('menu.path')} name="path">
                            <Input
                                v-model:value={params.form.validate.path}
                                autocomplete="off"
                                disabled={params.detail}
                                readonly={params.detail}
                                placeholder={t('menu.placeholder.path')}
                            />
                        </FormItem>
                        <FormItem label={t('menu.page')} name="page">
                            <Input
                                v-model:value={params.form.validate.page}
                                autocomplete="off"
                                disabled={params.detail}
                                readonly={params.detail}
                                placeholder={t('menu.placeholder.page')}
                            />
                        </FormItem>
                        <FormItem label={t('menu.icon')} name="icon">
                            <Input
                                v-model:value={params.form.validate.icon}
                                autocomplete="off"
                                disabled={params.detail}
                                readonly={params.detail}
                                v-slots={{ suffix: () => renderIconsTrigger() }}
                                placeholder={t('menu.placeholder.icon')}
                            />
                        </FormItem>
                        <FormItem label={t('menu.router')} name="is_router">
                            <Switch
                                v-model:checked={params.form.validate.is_router}
                                checked-children={t('global.yes')}
                                disabled={params.detail}
                                un-checked-children={t('global.no')}
                            />
                        </FormItem>
                        <FormItem label={t('menu.open')} name="is_blank">
                            <Switch
                                v-model:checked={params.form.validate.is_blank}
                                checked-children={t('global.external')}
                                disabled={params.detail}
                                un-checked-children={t('global.internal')}
                            />
                        </FormItem>
                        <FormItem label={t('menu.weight')} name="weight">
                            <InputNumber
                                v-model:value={params.form.validate.weight}
                                min={1}
                                disabled={params.detail}
                                readonly={params.detail}
                            />
                        </FormItem>
                        <FormItem label={t('menu.hide-router')} name="is_hide">
                            <Switch
                                v-model:checked={params.form.validate.is_hide}
                                checked-children={t('global.yes')}
                                disabled={params.detail}
                                un-checked-children={t('global.no')}
                            />
                        </FormItem>
                        <FormItem label={t('menu.redirect')} name="redirect">
                            <Input
                                v-model:value={params.form.validate.redirect}
                                autocomplete="off"
                                disabled={params.detail}
                                readonly={params.detail}
                                placeholder={t('menu.placeholder.redirect')}
                            />
                        </FormItem>
                    </>
                )
            const actionBtn = params.detail ? (
                <>
                    <Button
                        onClick={handleOpenDrawer}
                        style={{ marginRight: $tools.convert2rem(8) }}>
                        {t('global.close')}
                    </Button>
                    <Button type="primary">{t('global.editable')}</Button>
                </>
            ) : (
                <>
                    <Button
                        onClick={handleOpenDrawer}
                        style={{ marginRight: $tools.convert2rem(8) }}>
                        {t('global.cancel')}
                    </Button>
                    <Button type="primary" loading={params.loading} onClick={handleCreateOrUpdate}>
                        {params.edit.status ? t('globalupdate') : t('global.save')}
                    </Button>
                </>
            )

            return (
                <Drawer
                    open={params.open}
                    rootClassName={styled.drawer}
                    width={580}
                    v-slots={{ extra: () => actionBtn }}
                    onClose={handleOpenDrawer}>
                    <Form
                        model={params.form.validate}
                        rules={params.form.rules}
                        labelCol={{ style: { width: $tools.convert2rem(120) } }}>
                        <FormItem label={t('menu.type')} name="type">
                            <RadioGroup
                                options={params.types}
                                onChange={() => handleChangeType()}
                                disabled={params.detail}
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
                                disabled={params.detail}
                                readonly={params.detail}
                                placeholder={t('menu.placeholder.btn')}
                            />
                        </FormItem>
                        {subMenu}
                        {firstMenu}
                        <FormItem label={t('menu.lang')} name="lang">
                            <Input
                                v-model:value={params.form.validate.lang}
                                autocomplete="off"
                                disabled={params.detail}
                                readonly={params.detail}
                                placeholder={t('menu.placeholder.lang')}
                            />
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
                </ConfigProvider>
            </div>
        )
    }
})

export default MiAppsMenu
