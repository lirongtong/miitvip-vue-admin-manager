import { defineComponent, reactive, ref, nextTick } from 'vue'
import { useI18n } from 'vue-i18n'
import { $g } from '../../../utils/global'
import { $tools } from '../../../utils/tools'
import { $request } from '../../../utils/request'
import { AppsManagementProps } from './props'
import { getPrefixCls } from '../../_utils/props-tools'
import { type Key } from '../../_utils/props-types'
import MiModal from '../../modal/modal'
import { useWindowResize } from '../../../hooks/useWindowResize'
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
    InfoCircleOutlined,
    PictureOutlined,
    CloudUploadOutlined,
    ZoomInOutlined
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
        const uploadImageRef = ref()
        const fileInputRef = ref()
        const { width } = useWindowResize()
        const params = reactive({
            loading: false,
            table: {
                loading: false,
                columns: [
                    {
                        title: t('apps.name'),
                        key: 'name',
                        dataIndex: 'name',
                        width: 120
                    },
                    {
                        title: t('apps.code'),
                        key: 'code',
                        dataIndex: 'code',
                        width: 100
                    },
                    {
                        title: t('apps.logo'),
                        key: 'logo',
                        dataIndex: 'logo',
                        width: 96,
                        align: 'center',
                        customRender: (record: any) => {
                            const data = record?.record
                            const group = data?.image?.group
                            const path = data?.image?.path
                            const isLink = $g.regExp.url.test(data?.logo)
                            const logo =
                                group && path ? (
                                    <img src={$g.fileServer + group + path} alt={data?.name} />
                                ) : data?.logo ? (
                                    isLink ? (
                                        <img src={record?.record?.logo} alt={data?.name} />
                                    ) : (
                                        <img
                                            src={$g.fileServer + record?.record?.logo}
                                            alt={data?.name}
                                        />
                                    )
                                ) : (
                                    <PictureOutlined />
                                )
                            return <div class={`${prefixCls}-logo`}>{logo}</div>
                        }
                    },
                    {
                        title: t('apps.state'),
                        key: 'state',
                        dataIndex: 'state',
                        align: 'center',
                        customRender: (record: any) => {
                            return record?.record?.state === 1 ? t('apps.up') : t('apps.down')
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
                        width: 160,
                        align: 'center',
                        customRender: (record: any) => {
                            return (
                                <div class={`${$g.prefix}table-btns`}>
                                    <a class="more" href={record?.record?.link} target="_blank">
                                        {t('view')}
                                    </a>
                                </div>
                            )
                        }
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
                        width: 280,
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
                                                onClick: () => deleteApp(record)
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
                being: false,
                image: {
                    init: false,
                    group: null,
                    path: null,
                    temp: null
                }
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
                    contact_info: null
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
            image: {
                view: false,
                data: null,
                source: null
            },
            preview: {
                local: false,
                width: 0,
                height: 0,
                show: false,
                area: {
                    width: 96,
                    height: 96
                }
            },
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
        const getApps = async (customParams?: {}) => {
            if (props.data.url) {
                if (params.table.loading) return
                params.table.loading = true
                const condition = Object.assign(
                    { ...params.search },
                    params.table.pagination,
                    props.data.params || customParams || {}
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
                                params.table.dataSource = res?.data
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
                                ),
                                { headers: { 'Content-Type': 'multipart/form-data' } }
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
                                    { image: params.image.source },
                                    { ...props.createApp.params }
                                ),
                                { headers: { 'Content-Type': 'multipart/form-data' } }
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

        // 默认的应用图标
        const handleAppDefaultLogo = (data: any) => {
            if (data?.image) {
                const group = data?.image?.group
                const path = data?.image?.path
                params.image.source = 'no-change'
                params.edit.image.group = group
                params.edit.image.path = path
                const src = $g.fileServer + group + path
                params.image.data = src
                nextTick().then(() => {
                    uploadImageRef.value.src = src
                    handleImageLoaded()
                })
            } else {
                params.edit.image.group = null
                params.edit.image.path = null
            }
        }

        // 新增/更新 - 控制弹窗显隐
        const handleAddOrUpdateDrawer = (record?: any) => {
            params.visible = !params.visible
            const data = record?.record
            if (params.visible) {
                // edit
                if (data) {
                    params.edit.being = true
                    params.edit.id = data?.id
                    params.detail.show = false
                    params.preview.local = false
                    params.form.validate = JSON.parse(JSON.stringify(data))
                    handleAppDefaultLogo(data)
                }
            } else handleAfterAction()
        }

        // 重置
        const handleAfterAction = () => {
            addOrUpdateformRef.value.resetFields()
            params.form.validate.state = 1
            params.form.validate.auth = 1
            params.edit.id = null
            params.edit.being = false
            params.detail.show = false
            params.form.validate.logo = null
            params.preview.show = false
            params.edit.image.group = null
            params.edit.image.path = null
            params.edit.init = false
            params.edit.image.temp = null
        }

        // 查看详情状态进入编辑状态
        const setDetailEditable = () => {
            params.edit.being = true
            params.edit.id = params.detail.id
            params.detail.show = false
            params.preview.local = false
        }

        // 查看详情
        const handleAppsInfo = (record: any) => {
            params.detail.show = !params.detail.show
            const data = record?.record
            if (data?.id && params.detail.show) {
                params.visible = !params.visible
                params.detail.id = data.id
                params.form.validate = JSON.parse(JSON.stringify(data))
                params.preview.local = false
                handleAppDefaultLogo(data)
            } else params.detail.id = null
        }

        // 删除应用
        const deleteApp = (record?: any) => {
            if (props.deleteApp.url && record.record) {
                const id = record.record?.id
                params.deleteIds = [id]
                batchDeleteApps()
            } else message.warning(t('api.delete', { name: t('app') }))
        }

        // 批量删除 ( 触发按钮 )
        const deleteApps = () => {
            if (params.deleteIds.length <= 0) {
                message.error(t('delete-select'))
                return
            }
            batchDeleteApps()
        }

        // 批量删除
        const batchDeleteApps = () => {
            if (params.loading) return
            params.loading = true
            if (props.deleteApp.url) {
                $request[(props.deleteApp.method || 'DELETE').toLowerCase()](
                    $tools.replaceUrlParams(props.deleteApp.url, {
                        id: params.deleteIds.join(',')
                    }),
                    props.deleteApp.params
                )
                    .then((res: any) => {
                        params.loading = false
                        if (res) {
                            if (res?.ret?.code === 200) {
                                message.success(t('success'))
                                getApps()
                            } else message.error(res?.ret?.message)
                        }
                    })
                    .catch((err: any) => {
                        params.loading = false
                        message.error(err.message)
                    })
            } else {
                params.loading = false
                message.warning(t('api.delete', { name: t('app') }))
            }
        }

        // 搜索应用
        const search = () => {
            if (searchCondition()) {
                getApps({ ...params.search })
            }
        }

        // 搜索前置条件
        const searchCondition = () => {
            return params.search.name || params.search.code || params.search.state !== null
        }

        // 输入清空时的事件监听 ( 重新获取应用列表 )
        const searchInput = (evt: any) => {
            const value = evt?.target?.value
            if ($tools.isEmpty(value) && searchCondition()) search()
        }

        // 重置搜索条件
        const searchReset = () => {
            params.search.name = null
            params.search.code = null
            params.search.state = null
            search()
        }

        // 预览
        const handleUploadImagePreview = (evt: any) => {
            const file = evt.target.files[0]
            params.image.source = file
            params.preview.local = true
            params.form.validate.logo = 'uploaded'
            const reader = new FileReader()
            reader.readAsDataURL(file)
            reader.onload = () => {
                nextTick().then(() => {
                    params.image.data = reader.result
                    uploadImageRef.value.src = reader.result
                    handleImageLoaded()
                })
            }
            if (props?.uploadImage?.url) {
                // 上传图片
                $request[(props.uploadImage.method || 'POST').toLowerCase()](
                    props.uploadImage.url,
                    Object.assign({}, props.uploadImage.params, {
                        image: file
                    }),
                    { headers: { 'Content-Type': 'multipart/form-data' } }
                )
                    .then((res: any) => {
                        if (res?.ret?.code === 200) {
                            const data = res?.data
                            params.form.validate.logo =
                                data?.group && data?.path
                                    ? data?.group + '/' + data?.path
                                    : 'uploaded'
                            if (props.uploadImage.callback) props.uploadImage.callback()
                        }
                    })
                    .catch((err: any) => {
                        message.error(err?.message)
                    })
            }
        }

        // 小图预览加载完成
        const handleImageLoaded = () => {
            params.preview.show = true
            uploadImageRef.value.setAttribute('crossOrigin', 'anonymous')
            uploadImageRef.value.onload = function () {
                const width = this.naturalWidth
                const height = this.naturalHeight
                if (width > height) {
                    params.preview.width = params.preview.area.width
                    const h = Math.ceil((params.preview.width * height) / width)
                    params.preview.height = h
                } else {
                    params.preview.height = params.preview.area.height
                    const w = Math.ceil((width * params.preview.height) / height)
                    params.preview.width = w
                }
            }
        }

        // 查看大图
        const handleViewLargeImage = () => {
            params.image.view = !params.image.view
        }

        // 清空上传按钮
        const handleRemoveUploadFile = () => {
            params.form.validate.logo = null
            if (fileInputRef.value) fileInputRef.value.value = null
            params.preview.show = false
            params.image.source = null
            params.edit.image.temp = null
            if (props?.deleteImage?.url && !params.preview.local) {
                const afterAction = () => {
                    params.loading = false
                    params.edit.init = true
                    params.preview.local = true
                    params.edit.image.group = null
                    params.edit.image.path = null
                }
                $request[(props.deleteImage.method || 'DELETE').toLowerCase()](
                    props.deleteImage.url,
                    Object.assign({}, props.deleteImage.params, {
                        group: params.edit.image.group,
                        path: params.edit.image.path
                    })
                )
                    .then((res: any) => {
                        afterAction()
                        if (res?.ret?.code === 200) {
                            if (props.deleteImage.callback) props.deleteImage.callback()
                        }
                    })
                    .catch((err: any) => {
                        afterAction()
                        message.error(err?.message)
                    })
            } else {
                params.edit.image.group = null
                params.edit.image.path = null
            }
        }
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
                <Col xs={24} md={18}>
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
                        <div class={`${searchCls}-item ptb8`}>
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
                    <Col xs={24} md={6}>
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
            const uploaderCls = `${prefixCls}-uploader`
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
                                maxlength={32}
                                v-input-limit={{
                                    reg: /[^a-zA-Z\d\-_]{0,32}$/
                                }}
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
                            <div class={`${uploaderCls}${params.detail.show ? ' disabled' : ''}`}>
                                <div class={`${uploaderCls}-image`}>
                                    <div class={`${uploaderCls}-image-icon`}>
                                        <CloudUploadOutlined v-show={!params.preview.show} />
                                        <div
                                            innerHTML={t('upload.image')}
                                            v-show={!params.preview.show}></div>
                                        <Input
                                            type="file"
                                            ref={fileInputRef}
                                            v-model:value={params.edit.image.temp}
                                            v-show={!params.preview.show}
                                            disabled={params.detail.show}
                                            readonly={params.detail.show}
                                            onChange={handleUploadImagePreview}
                                        />
                                    </div>
                                    <div
                                        class={`${uploaderCls}-image-preview`}
                                        v-show={params.preview.show}>
                                        <img
                                            ref={uploadImageRef}
                                            style={{
                                                width: `${params.preview.width}px`,
                                                height: `${params.preview.height}px`
                                            }}
                                        />
                                        <div class={`${uploaderCls}-image-preview-mask`}>
                                            <ZoomInOutlined
                                                title={t('upload.view')}
                                                onClick={handleViewLargeImage}
                                            />
                                            <DeleteOutlined
                                                title={t('delete')}
                                                onClick={handleRemoveUploadFile}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
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
                        <FormItem label={t('contact.info')} name="contact_info">
                            <Input
                                v-model:value={params.form.validate.contact_info}
                                autocomplete="off"
                                maxlength={32}
                                v-input-limit={{ reg: /[^\d\+\-]{0,32}$/ }}
                                disabled={params.detail.show}
                                readonly={params.detail.show}
                                placeholder={t('apps.placeholder.contact.info')}
                            />
                        </FormItem>
                    </Form>
                </Drawer>
            )
        }

        // 渲染查看大图 modal
        const renderViewImageModal = () => {
            return (
                <MiModal
                    visible={params.image.view}
                    title={t('upload.view')}
                    footer={false}
                    zIndex={Date.now()}
                    onCancel={handleViewLargeImage}
                    wrapClass={`${prefixCls}-view-image-modal`}
                    width={width.value < 768 ? '100%' : 720}>
                    <img src={params.image.data} />
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
                        rowKey={(record: any) => record?.id}
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
                    {renderViewImageModal()}
                </ConfigProvider>
            )
        }

        return () => <div class={prefixCls}>{renderTable()}</div>
    }
})
