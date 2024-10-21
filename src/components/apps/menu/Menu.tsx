import { defineComponent } from 'vue'
import { useI18n } from 'vue-i18n'
import { ConfigProvider, Empty, Popconfirm, Button, message, Row, Col } from 'ant-design-vue'
import { MenuTreeProps } from './props'
import { $request } from '../../../utils/request'
import { type ResponseData } from '../../../utils/types'
import * as AntdvIcons from '@ant-design/icons-vue'
import zhCN from 'ant-design-vue/es/locale/zh_CN'
import applyTheme from '../../_utils/theme'
import styled from './style/menu.module.less'

const MiAppsMenu = defineComponent({
    name: 'MiAppsMenu',
    inheritAttrs: false,
    props: MenuTreeProps(),
    setup(props) {
        const { t } = useI18n()
        applyTheme(styled)

        const handleDeleteMenus = () => {}

        const handleOpenCreateOrUpdateMenusDrawer = () => {}

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

        // 空状态
        const renderEmpty = () => {
            return (
                <div class={styled.empty}>
                    <Empty description={t('global.no-data')} />
                </div>
            )
        }

        // 操作
        const renderAction = () => {
            const optBtns = (
                <Col xs={24} md={12}>
                    <Popconfirm
                        title={t('global.delete.confirm')}
                        style={{ zIndex: Date.now() }}
                        okText={t('global.ok')}
                        cancelText={t('global.cancel')}
                        onConfirm={() => handleDeleteMenus()}>
                        <Button type="primary" danger={true} icon={<AntdvIcons.DeleteOutlined />}>
                            {t('global.delete.batch')}
                        </Button>
                    </Popconfirm>
                    <Button
                        type="primary"
                        icon={<AntdvIcons.EditOutlined />}
                        onClick={handleOpenCreateOrUpdateMenusDrawer}>
                        {t('menu.add')}
                    </Button>
                </Col>
            )
            const searchBtns = <Col xs={24} md={12}></Col>
            return (
                <Row class={styled.action}>
                    {searchBtns}
                    {optBtns}
                </Row>
            )
        }

        return () => (
            <div class={styled.container}>
                <ConfigProvider
                    locale={props.paginationLocale ?? zhCN}
                    renderEmpty={() => renderEmpty()}>
                    {renderAction()}
                </ConfigProvider>
            </div>
        )
    }
})

export default MiAppsMenu
