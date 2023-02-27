/* eslint-disable import/namespace */
import { defineComponent, reactive, ref } from 'vue'
import { menuManagementProps, type MenusDataItem } from './props'
import { getPrefixCls } from '../../_utils/props-tools'
import { $request } from '../../../utils/request'
import { $tools } from '../../../utils/tools'
import { $g } from '../../../utils/global'
import { useWindowResize } from '../../../hooks/useWindowResize'
import MiModal from '../../../components/modal/modal'
import MiDropdown from '../../../components/dropdown/dropdown'
import { directional, tips, edit, data, brands, generic } from './icons'
import { useI18n } from 'vue-i18n'
import * as AntdvIcons from '@ant-design/icons-vue'
import {
    Table,
    message,
    ConfigProvider,
    Popconfirm,
    Button,
    Input,
    TreeSelect,
    Row,
    Col,
    Drawer,
    RadioGroup,
    Form,
    FormItem,
    InputNumber,
    Switch,
    FormInstance,
    Empty,
    Tabs,
    TabPane
} from 'ant-design-vue'

export declare type Key = string | number

export default defineComponent({
    name: 'MiMenuManagement',
    inheritAttrs: false,
    props: menuManagementProps(),
    setup(props) {
        const prefixCls = getPrefixCls('menus', props.prefixCls)
        const btnCls = `${$g.prefix}btn`
        const formCls = `${$g.prefix}form`
        const { t } = useI18n()
        const addOrUpdateformRef = ref<FormInstance>()
        const params = reactive({
            loading: false,
            table: {
                loading: false,
                columns: [
                    {
                        title: t('menus.name'),
                        key: 'name',
                        dataIndex: 'name',
                        width: 200
                    },
                    {
                        title: t('menus.type'),
                        key: 'type',
                        dataIndex: 'type',
                        align: 'center',
                        customRender: (record: any) => {
                            return record.record.type === 1
                                ? t('menus.top')
                                : record.record.type === 2
                                ? t('menus.sub')
                                : record.record.type === 3
                                ? t('menus.btn')
                                : t('menus.unknow')
                        },
                        width: 100
                    },
                    {
                        title: t('menus.icon'),
                        key: 'icon',
                        dataIndex: 'icon',
                        align: 'center',
                        customRender: (record: any) => {
                            const IconTag = AntdvIcons[record.record.icon]
                            return <IconTag style={`font-size: 20px`} />
                        },
                        width: 100
                    },
                    {
                        title: t('menus.page'),
                        key: 'page',
                        dataIndex: 'page',
                        width: 200,
                        ellipsis: true
                    },
                    {
                        title: t('menus.path'),
                        key: 'path',
                        dataIndex: 'path',
                        width: 200,
                        ellipsis: true
                    },
                    {
                        title: t('menus.weight'),
                        key: 'weight',
                        dataIndex: 'weight',
                        align: 'center',
                        width: 90
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
                                    <a class="edit" onClick={() => openAddOrUpdateDrawer(record)}>
                                        <AntdvIcons.FormOutlined />
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
                                                onClick: () => deleteMenu(record)
                                            }}
                                            key={record.record.key}>
                                            <AntdvIcons.DeleteOutlined />
                                            {t('delete')}
                                        </Popconfirm>
                                    </a>
                                    <span></span>
                                    <MiDropdown
                                        title={() => {
                                            return (
                                                <a class="more">
                                                    <AntdvIcons.MoreOutlined />
                                                    {t('more')}
                                                </a>
                                            )
                                        }}
                                        items={getDropdownItems(record.record)}></MiDropdown>
                                </div>
                            )
                        }
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
            deleteIds: [] as any,
            openDrawer: false,
            isEdit: false,
            editId: null,
            editPid: null,
            details: {
                id: null,
                show: false
            },
            types: [
                { label: t('menus.top'), value: 1 },
                { label: t('menus.sub'), value: 2 },
                { label: t('menus.btn'), value: 3 }
            ],
            policies: [
                { label: t('menus.policies.invisible'), value: 0 },
                { label: t('menus.policies.visible'), value: 1 },
                { label: t('menus.policies.accessible'), value: 2 }
            ],
            states: [
                { label: t('invalid'), value: 0 },
                { label: t('valid'), value: 1 }
            ],
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
                    auth: '',
                    policy: 2,
                    state: 1,
                    is_router: true,
                    is_blank: false,
                    is_hide: false
                },
                rules: {
                    name: [{ required: true, message: t('menus.placeholder.name') }],
                    page: [{ required: true, message: t('menus.placeholder.page') }],
                    pid: [{ required: true, message: t('menus.placeholder.up') }]
                }
            },
            menus: {
                tree: [] as MenusDataItem[],
                detail: false
            },
            tabs: {
                active: 'directional',
                visiable: false
            }
        })
        const { width } = useWindowResize()

        // 获取菜单
        const getMenus = (customParams?: {}) => {
            if (props.data.url) {
                if (params.table.loading) return
                params.table.loading = true
                const condition = Object.assign(
                    params.table.pagination,
                    props.data.params || customParams || {}
                )
                $request[(props.data.method || 'GET').toLowerCase()](props.data.url, condition)
                    .then((res: any) => {
                        params.table.loading = false
                        if (res) {
                            if (res?.ret?.code === 200) {
                                params.menus.tree = getMenusTreeData(res?.data)
                                params.table.dataSource = params.menus.tree as any[]
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

        // 封装菜单
        const getMenusTreeData = (data: any): MenusDataItem[] => {
            const top = [] as MenusDataItem[]
            for (let i = 0, l = data.length; i < l; i++) {
                const cur = data[i]
                const temp = {
                    ...cur,
                    key: cur.id,
                    title: cur.name,
                    value: cur.id
                } as MenusDataItem
                if (cur.children) temp.children = getMenusTreeData(cur.children)
                top.push(temp)
            }
            return top
        }

        // Table Column 下拉菜单
        const getDropdownItems = (data: any): any[] => {
            return [
                {
                    name: 'detail',
                    title: t('detail'),
                    icon: AntdvIcons.MessageOutlined,
                    callback: () => setDetailState(data)
                },
                {
                    name: 'add-submenu',
                    title: t('menus.addSub'),
                    icon: AntdvIcons.NodeExpandOutlined,
                    callback: () => {
                        openAddOrUpdateDrawer()
                        params.form.validate.pid = data?.id
                        params.form.validate.type = 2
                    }
                }
            ] as any
        }

        // 输入查询
        const searchInput = (evt: any) => {
            const value = evt?.target?.value
            if ($tools.isEmpty(value)) searchReset()
        }

        // 重置查询
        const searchReset = () => {
            params.search.key = null
            search()
        }

        // 查询
        const search = () => {
            getMenus({ keyword: params.search.key })
        }

        // 查看详情状态
        const setDetailState = (data?: any) => {
            params.details.show = !params.details.show
            if (data?.id && params.details.show) {
                params.details.id = data?.id
                params.openDrawer = !params.openDrawer
                params.editPid = data?.pid
                params.form.validate = JSON.parse(JSON.stringify(data))
                params.form.validate.is_router = data?.is_router > 0
                params.form.validate.weight = parseInt(data?.weight)
            } else params.details.id = null
        }

        // 进入编辑状态 ( 查看详情 )
        const setDetailEditable = () => {
            params.isEdit = true
            params.editId = params.details.id
            params.details.show = false
        }

        // 编辑状态
        const setEditState = (data: any) => {
            if (data?.record) {
                params.isEdit = true
                params.details.show = false
                params.editId = data.record?.id
                params.editPid = data.record?.pid
                params.form.validate = JSON.parse(JSON.stringify(data.record))
                params.form.validate.is_router = data.record?.is_router > 0
                params.form.validate.weight = parseInt(data.record?.weight)
            } else resetEditState()
        }

        // 重置编辑状态 ( 取消编辑 )
        const resetEditState = () => {
            params.isEdit = false
            params.editId = null
            params.editPid = null
            params.details.show = false
        }

        // 新增/创建 - 抽屉形式列表
        const openAddOrUpdateDrawer = (data?: any) => {
            params.openDrawer = !params.openDrawer
            if (params.openDrawer) setEditState(data)
            else resetEditState()
        }

        // 更新菜单类型
        const changeType = () => {
            if (params.form.validate.type === 1) params.form.validate.pid = null
            else
                params.form.validate.pid =
                    params.editPid && params.editPid !== 0 ? params.editPid : null
        }

        // 设置菜单图标
        const setIcon = (name: string) => {
            params.form.validate.icon = name
            handleIconsModal()
        }

        // 图标 Modal
        const handleIconsModal = () => {
            if (!params.details.show) params.tabs.visiable = !params.tabs.visiable
        }

        // 创建/更新
        const addOrUpdate = () => {
            if (addOrUpdateformRef.value) {
                addOrUpdateformRef.value.validate().then(() => {
                    if (params.loading) return
                    params.loading = true
                    if (!AntdvIcons[params.form.validate.icon])
                        params.form.validate.icon = 'TagOutlined'
                    if (params.isEdit) {
                        // update
                        if (!params.editId) {
                            message.error(t('no-id'))
                            return
                        }
                        if (props.updateMenu.url) {
                            $request[(props.updateMenu.method || 'PUT').toLowerCase()](
                                $tools.replaceUrlParams(props.updateMenu.url, {
                                    id: params.editId
                                }),
                                Object.assign(
                                    {},
                                    { ...params.form.validate },
                                    { ...props.updateMenu.params }
                                )
                            )
                                .then((res: any) => {
                                    params.loading = false
                                    if (res?.ret?.code === 200) {
                                        openAddOrUpdateDrawer()
                                        getMenus()
                                        addOrUpdateformRef.value.resetFields()
                                        params.form.validate.pid = null
                                        params.form.validate.type = 1
                                        resetEditState()
                                        message.success(t('success'))
                                        if (props.updateMenu.callback) props.updateMenu.callback()
                                    } else message.error(res?.ret?.message)
                                })
                                .catch((err: any) => {
                                    params.loading = false
                                    message.error(err?.message)
                                })
                        }
                    } else {
                        // create
                        if (props.addMenu.url) {
                            $request[(props.addMenu.method || 'POST').toLowerCase()](
                                props.addMenu.url,
                                Object.assign(
                                    {},
                                    { ...params.form.validate },
                                    { ...props.addMenu.params }
                                )
                            )
                                .then((res: any) => {
                                    params.loading = false
                                    if (res?.ret?.code === 200) {
                                        openAddOrUpdateDrawer()
                                        getMenus()
                                        addOrUpdateformRef.value.resetFields()
                                        params.form.validate.pid = null
                                        params.form.validate.type = 1
                                        message.success(t('success'))
                                        if (props.addMenu.callback) props.addMenu.callback()
                                    } else message.error(res?.ret?.message)
                                })
                                .catch((err: any) => {
                                    params.loading = false
                                    message.error(err?.message)
                                })
                        }
                    }
                })
            }
        }

        // 封装待删除的菜单id
        const wrapBatchDeleteIds = (_keys: Key[], rows: any[]) => {
            const ids: any[] = []
            for (let i = 0, l = rows.length; i < l; i++) {
                const id = rows[i]?.id || rows[i]?.key
                if (id) ids.push(id)
            }
            params.deleteIds = ids
        }

        // 删除菜单项
        const deleteMenuItem = () => {
            if (params.loading) return
            params.loading = true
            if (props.deleteMenu.url) {
                $request[(props.deleteMenu.method || 'DELETE').toLowerCase()](
                    $tools.replaceUrlParams(props.deleteMenu.url, {
                        id: params.deleteIds.join(',')
                    }),
                    props.deleteMenu.params
                )
                    .then((res: any) => {
                        params.loading = false
                        if (res) {
                            if (res?.ret?.code === 200) {
                                message.success(t('success'))
                                getMenus()
                            } else message.error(res?.ret?.message)
                        }
                    })
                    .catch((err: any) => {
                        params.loading = false
                        message.error(err.message)
                    })
            }
        }

        // 删除菜单 - 单条
        const deleteMenu = (data: any) => {
            if (props.deleteMenu.url && data.record) {
                const id = data.record?.id
                params.deleteIds = [id]
                deleteMenuItem()
            }
        }

        // 删除菜单 - 批量
        const deleteMenus = () => {
            if (params.deleteIds.length <= 0) {
                message.error(t('delete-select'))
                return
            }
            deleteMenuItem()
        }

        getMenus()

        const renderIconsTrigger = () => {
            return (
                <a onClick={handleIconsModal}>
                    <AntdvIcons.AimOutlined />
                </a>
            )
        }

        const renderIconsModal = () => {
            const wrapIcons = (data: string[]) => {
                const res: any[] = []
                data.forEach((icon: string) => {
                    const IconTag = AntdvIcons[icon]
                    res.push(
                        <div onClick={() => setIcon(icon)}>
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
                    visible={params.tabs.visiable}
                    title={false}
                    footer={false}
                    onCancel={handleIconsModal}
                    zIndex={202302221012}
                    width={width.value < 768 ? '100%' : 720}>
                    <Tabs v-model:activeKey={params.tabs.active} class={`${$g.prefix}tabs`}>
                        <TabPane key="directional" tab={t('menus.icons.directional')}>
                            {...icons.directional}
                        </TabPane>
                        <TabPane key="tips" tab={t('menus.icons.tips')}>
                            {...icons.tips}
                        </TabPane>
                        <TabPane key="edit" tab={t('menus.icons.edit')}>
                            {...icons.edit}
                        </TabPane>
                        <TabPane key="data" tab={t('menus.icons.data')}>
                            {...icons.data}
                        </TabPane>
                        <TabPane key="brands" tab={t('menus.icons.brands')}>
                            {...icons.brands}
                        </TabPane>
                        <TabPane key="generic" tab={t('menus.icons.generic')}>
                            {...icons.generic}
                        </TabPane>
                    </Tabs>
                </MiModal>
            )
        }

        const renderActionBtns = () => {
            const btns = (
                <>
                    <Popconfirm
                        title={t('delete-confirm')}
                        style={{ zIndex: Date.now() }}
                        okText={t('ok')}
                        onConfirm={() => deleteMenus()}
                        cancelText={t('cancel')}>
                        <Button
                            type="primary"
                            danger={true}
                            icon={<AntdvIcons.DeleteOutlined />}
                            style={{ marginRight: $tools.convert2Rem(8) }}>
                            {t('batch-delete')}
                        </Button>
                    </Popconfirm>
                    <Button
                        class={`${btnCls}-success`}
                        icon={<AntdvIcons.EditOutlined />}
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
                                    return <AntdvIcons.SearchOutlined />
                                }
                            }}>
                            {t('seek')}
                        </Button>
                        <Button
                            class={`${btnCls}-info`}
                            onClick={searchReset}
                            v-slots={{
                                icon: () => {
                                    return <AntdvIcons.ReloadOutlined />
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
            // 子菜单
            const subMenu = [2, 3].includes(params.form.validate.type) ? (
                <FormItem label={t('menus.up')} name="pid">
                    <TreeSelect
                        v-model:value={params.form.validate.pid}
                        placeholder={t('menus.placeholder.up')}
                        allowClear={true}
                        dropdownClassName={`${prefixCls}-drawer-select`}
                        treeData={params.menus.tree}
                        treeDefaultExpandAll={true}></TreeSelect>
                </FormItem>
            ) : null
            // 一级菜单
            const exclusiveBtn =
                params.form.validate.type === 3 ? null : (
                    <>
                        <FormItem label={t('menus.subname')} name="sub_name">
                            <Input
                                v-model:value={params.form.validate.sub_name}
                                autocomplete="off"
                                disabled={params.details.show}
                                readonly={params.details.show}
                                maxlength={60}
                                placeholder={t('menus.placeholder.subname')}
                            />
                        </FormItem>
                        <FormItem label={t('menus.path')} name="path">
                            <Input
                                v-model:value={params.form.validate.path}
                                autocomplete="off"
                                disabled={params.details.show}
                                readonly={params.details.show}
                                placeholder={t('menus.placeholder.path')}
                            />
                        </FormItem>
                        <FormItem label={t('menus.page')} name="page">
                            <Input
                                v-model:value={params.form.validate.page}
                                autocomplete="off"
                                disabled={params.details.show}
                                readonly={params.details.show}
                                placeholder={t('menus.placeholder.page')}
                            />
                        </FormItem>
                        <FormItem label={t('menus.icon')} name="icon">
                            <Input
                                v-model:value={params.form.validate.icon}
                                autocomplete="off"
                                disabled={params.details.show}
                                readonly={params.details.show}
                                v-slots={{ suffix: () => renderIconsTrigger() }}
                                placeholder={t('menus.placeholder.icon')}
                            />
                        </FormItem>
                        <FormItem label={t('menus.router')} name="is_router">
                            <Switch
                                v-model:checked={params.form.validate.is_router}
                                checked-children={t('yes')}
                                disabled={params.details.show}
                                un-checked-children={t('no')}
                            />
                        </FormItem>
                        <FormItem label={t('menus.open')} name="is_blank">
                            <Switch
                                v-model:checked={params.form.validate.is_blank}
                                checked-children={t('external')}
                                disabled={params.details.show}
                                un-checked-children={t('internal')}
                            />
                        </FormItem>
                        <FormItem label={t('menus.weight')} name="weight">
                            <InputNumber
                                v-model:value={params.form.validate.weight}
                                min={1}
                                disabled={params.details.show}
                                readonly={params.details.show}
                            />
                        </FormItem>
                        <FormItem label={t('menus.hide')} name="is_hide">
                            <Switch
                                v-model:checked={params.form.validate.is_hide}
                                checked-children={t('yes')}
                                disabled={params.details.show}
                                un-checked-children={t('no')}
                            />
                        </FormItem>
                        <FormItem label={t('menus.redirect')} name="redirect">
                            <Input
                                v-model:value={params.form.validate.redirect}
                                autocomplete="off"
                                disabled={params.details.show}
                                readonly={params.details.show}
                                placeholder={t('menus.placeholder.redirect')}
                            />
                        </FormItem>
                    </>
                )
            // 按钮 / 权限
            const btnMenu =
                params.form.validate.type === 3 ? (
                    <>
                        <FormItem label={t('menus.auth')} name="auth">
                            <Input
                                v-model:value={params.form.validate.auth}
                                autocomplete="off"
                                disabled={params.details.show}
                                readonly={params.details.show}
                                placeholder={t('menus.placeholder.auth')}
                            />
                        </FormItem>
                        <FormItem label={t('menus.policy')} name="policy">
                            <RadioGroup
                                options={params.policies}
                                disabled={params.details.show}
                                v-model:value={params.form.validate.policy}></RadioGroup>
                        </FormItem>
                        <FormItem label={t('state')} name="state">
                            <RadioGroup
                                options={params.states}
                                disabled={params.details.show}
                                v-model:value={params.form.validate.state}></RadioGroup>
                        </FormItem>
                    </>
                ) : null
            // 抽屉式表单的标题
            const title = params.isEdit
                ? t('menus.update')
                : params.details.show
                ? t('detail')
                : t('menus.add')
            // 抽屉式表单的按钮
            const drawerActionBtn = params.details.show ? (
                <>
                    <Button
                        style={{ marginRight: $tools.convert2Rem(8) }}
                        onClick={openAddOrUpdateDrawer}>
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
                        onClick={openAddOrUpdateDrawer}>
                        {t('cancel')}
                    </Button>
                    <Button type="primary" onClick={addOrUpdate} loading={params.loading}>
                        {params.isEdit ? t('update') : t('save')}
                    </Button>
                </>
            )
            return (
                <Drawer
                    visible={params.openDrawer}
                    zIndex={Date.now()}
                    onClose={openAddOrUpdateDrawer}
                    title={title}
                    width={580}
                    v-slots={{
                        extra: () => drawerActionBtn
                    }}
                    class={`${$g.prefix}drawer${
                        params.details.show ? ` ${prefixCls}-detail` : ''
                    }`}>
                    <Form
                        class={`${formCls} ${formCls}-theme`}
                        model={params.form.validate}
                        rules={params.form.rules}
                        ref={addOrUpdateformRef}
                        labelCol={{ style: { width: $tools.convert2Rem(120) } }}>
                        <FormItem label={t('menus.type')} name="type">
                            <RadioGroup
                                options={params.types}
                                onChange={() => changeType()}
                                disabled={params.details.show}
                                v-model:value={params.form.validate.type}></RadioGroup>
                        </FormItem>
                        <FormItem
                            label={
                                params.form.validate.type === 3
                                    ? t('menus.btnName')
                                    : t('menus.name')
                            }
                            name="name">
                            <Input
                                v-model:value={params.form.validate.name}
                                autocomplete="off"
                                maxlength={60}
                                disabled={params.details.show}
                                readonly={params.details.show}
                                placeholder={t('menus.placeholder.btn')}
                            />
                        </FormItem>
                        {subMenu}
                        {exclusiveBtn}
                        <FormItem label={t('menus.lang')} name="lang">
                            <Input
                                v-model:value={params.form.validate.lang}
                                autocomplete="off"
                                disabled={params.details.show}
                                readonly={params.details.show}
                                placeholder={t('menus.placeholder.lang')}
                            />
                        </FormItem>
                        {btnMenu}
                    </Form>
                </Drawer>
            )
        }

        const renderTable = () => {
            return (
                <ConfigProvider
                    locale={props.paginationLocale}
                    renderEmpty={() => <Empty description={t('no-data')} />}>
                    {renderActionBtns()}
                    <Table
                        columns={params.table.columns}
                        rowSelection={{
                            onChange: (keys: Key[], rows: any[]) => {
                                wrapBatchDeleteIds(keys, rows)
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
                    {renderIconsModal()}
                </ConfigProvider>
            )
        }

        return () => <div class={prefixCls}>{renderTable()}</div>
    }
})
