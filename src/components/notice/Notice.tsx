import { defineComponent, type SlotsType } from 'vue'
import { BellOutlined } from '@ant-design/icons-vue'
import { ConfigProvider, Tabs, Popover, Badge } from 'ant-design-vue'
import { $tools } from '../../utils/tools'
import { getPropSlot, getSlot, getSlotContent } from '../_utils/props'
import { NoticeProps } from './props'
import applyTheme from '../_utils/theme'
import styled from './style/notice.module.less'

const MiNotice = defineComponent({
    name: 'MiNotice',
    inheritAttrs: false,
    slots: Object as SlotsType<{
        icon: any
        extra: any
    }>,
    props: NoticeProps(),
    setup(props, { slots }) {
        applyTheme(styled)

        const renderIcon = () => {
            const icon = getPropSlot(slots, props, 'icon')
            const style = {
                fontSize: props?.iconSetting?.size
                    ? $tools.convert2rem($tools.distinguishSize(props?.iconSetting?.size))
                    : null,
                color: props?.iconSetting?.color ?? null
            }
            return (
                <div class={styled.icon}>
                    <Badge
                        count={props.amount}
                        overflowCount={props.maxAmount}
                        dot={props.dot}
                        showZero={props.showZero}>
                        {icon ?? <BellOutlined style={style} />}
                    </Badge>
                </div>
            )
        }

        const renderEmpty = () => {}

        const renderTabs = () => {
            const allSlots = getPropSlot(slots, props)
            const tabs: any[] = []
            let content: any = null
            if (allSlots && allSlots.length > 0) {
                const hasTab = allSlots[0].type.name === 'MiNoticeTab'
                allSlots.map((tab: any) => {
                    const title = getSlotContent(tab, 'title')
                    const content = getSlot(tab)
                    tabs.push(
                        hasTab ? (
                            <Tabs.TabPane key={tab.props?.name} tab={title}>
                                {content ?? tab}
                            </Tabs.TabPane>
                        ) : (
                            tab
                        )
                    )
                })
                content = hasTab ? (
                    <Tabs class={styled.tabs} onChange={props.tabChange}>
                        {...tabs}
                    </Tabs>
                ) : (
                    [...tabs]
                )
            }
            return content
        }

        const renderContent = () => {
            const content = renderTabs()
            return <div class={styled.content}>{content ?? renderEmpty()}</div>
        }

        console.log(
            $tools.getAntdvThemeProperties({
                components: { tooltip: { colorBgElevated: '#fff' } }
            })
        )

        return () => (
            <ConfigProvider theme={{ ...$tools.getAntdvThemeProperties() }}>
                <Popover
                    overlayClassName={styled.container}
                    destroyTooltipOnHide={true}
                    trigger={props.trigger}
                    content={renderContent()}>
                    {renderIcon()}
                </Popover>
            </ConfigProvider>
        )
    }
})

export default MiNotice
