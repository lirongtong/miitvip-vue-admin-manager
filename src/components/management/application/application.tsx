import { defineComponent, reactive } from 'vue'
import { useI18n } from 'vue-i18n'
import { $g } from '../../../utils/global'
import { $tools } from '../../../utils/tools'
import { AppsManagementProps } from './props'
import { getPrefixCls } from '../../_utils/props-tools'
import {
    Table,
    ConfigProvider,
    message,
    Empty,
    Input,
    Col,
    Row,
    Button,
    Popconfirm
} from 'ant-design-vue'
import { SearchOutlined, ReloadOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons-vue'

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
        const params = reactive({
            search: {
                key: null
            }
        })

        // 获取应用
        const getApps = () => {}

        // 创建/更新应用
        const addOrUpdateApps = () => {}

        // 删除应用
        const deleteApps = () => {}

        // 搜索英语
        const search = () => {}

        // 输入清空事件监听 ( 重新获取应用 )
        const searchInput = () => {}

        // 重置搜索条件
        const searchReset = () => {}

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
                    <Button class={`${btnCls}-success`} icon={<EditOutlined />}>
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
                                v-model:value={params.search.key}
                            />
                        </div>
                        <div class={`${searchCls}-item`}>
                            <label>{t('apps.code')}</label>
                            <Input
                                placeholder={t('apps.placeholder.code')}
                                onInput={searchInput}
                                onPressEnter={search}
                                v-model:value={params.search.key}
                            />
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

        // 渲染 Table
        const renderTable = () => {
            return (
                <ConfigProvider
                    locale={props.paginationLocale}
                    renderEmpty={() => <Empty description={t('no-data')} />}>
                    {renderSearchArea()}
                </ConfigProvider>
            )
        }

        return () => <div class={prefixCls}>{renderTable()}</div>
    }
})
