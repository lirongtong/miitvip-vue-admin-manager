import { defineComponent, type SlotsType, type Plugin } from 'vue'
import { BellOutlined } from '@ant-design/icons-vue'
import { ConfigProvider, Tabs, Popover, Badge } from 'ant-design-vue'
import { $tools } from '../../utils/tools'
import { getPropSlot, getSlot, getSlotContent } from '../_utils/props'
import { NoticeProps } from './props'
import { useI18n } from 'vue-i18n'
import MiClock from '../clock'
import MiNoticeTab from './Tab'
import MiNoticeItem from './Item'
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
        const { tm } = useI18n()
        const width = $tools.convert2rem($tools.distinguishSize(props.width))

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

        const renderEmpty = () => {
            const date = new Date()
            const weeks: string[] = Object.values(tm('global.week') || {})
            const week: string | null = weeks[date.getDay()]
            const y = date.getFullYear()
            const m = date.getMonth() + 1
            const d = date.getDate()
            const times = `${y}-${m > 9 ? m : `0` + m}-${d > 9 ? d : `0` + d}`
            return (
                <>
                    <div class={styled.emptyTime}>
                        <div class={styled.emptyDate} innerHTML={times}></div>
                        <div class={styled.emptyWeek} innerHTML={week}></div>
                    </div>
                    <MiClock />
                </>
            )
        }

        const renderTabs = () => {
            const allSlots = getPropSlot(slots, props)
            const tabs: any[] = []
            let content: any = null
            if (allSlots && allSlots.length > 0) {
                const hasTab = allSlots[0].type.name === 'MiNoticeTab'
                allSlots.map((tab: any) => {
                    const name = getSlotContent(tab, 'name')
                    const content = getSlot(tab)
                    tabs.push(
                        hasTab ? (
                            <Tabs.TabPane key={tab.props?.key} tab={name}>
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
            return (
                <div class={`${styled.content}${!content ? ` ${styled.empty}` : ''}`}>
                    {content ?? renderEmpty()}
                </div>
            )
        }

        return () => (
            <ConfigProvider theme={{ ...$tools.getAntdvThemeProperties() }}>
                <Popover
                    overlayClassName={styled.container}
                    overlayStyle={{ width }}
                    destroyTooltipOnHide={true}
                    trigger={props.trigger}
                    placement={props.placement}
                    arrowPointAtCenter={true}
                    content={renderContent()}>
                    {renderIcon()}
                </Popover>
            </ConfigProvider>
        )
    }
})

MiNotice.Tab = MiNoticeTab
MiNotice.Item = MiNoticeItem

export default MiNotice as typeof MiNotice &
    Plugin & {
        readonly Tab: typeof MiNoticeTab
        readonly Item: typeof MiNoticeItem
    }
