import { defineComponent, type SlotsType, ref } from 'vue'
import { BellOutlined, ShoppingOutlined, MessageOutlined } from '@ant-design/icons-vue'
import { ConfigProvider, Popover, Badge, Checkbox } from 'ant-design-vue'
import { $tools } from '../../utils/tools'
import { getPropSlot, getSlotContent } from '../_utils/props'
import { NoticeProps } from './props'
import { useI18n } from 'vue-i18n'
// eslint-disable-next-line import/no-unresolved
import { Navigation, FreeMode } from 'swiper/modules'
import MiClock from '../clock'
import MiNoticeTab from './Tab'
import MiNoticeItem from './Item'
import applyTheme from '../_utils/theme'
import styled from './style/notice.module.less'

const MiNotice = defineComponent({
    name: 'MiNotice',
    inheritAttrs: false,
    slots: Object as SlotsType<{
        default: any
        icon: any
        extra: any
    }>,
    props: NoticeProps(),
    setup(props, { slots }) {
        const { tm } = useI18n()
        const width = $tools.convert2rem($tools.distinguishSize(props.width))
        const iconRef = ref<HTMLElement>()

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
                <div class={styled.icon} ref={iconRef}>
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
            const messages: Record<string, any> = tm('notice') || {}
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
                    <div class={styled.emptyTitle} innerHTML={messages?.wonderful} />
                    <div class={styled.emptyItems}>
                        <div class={styled.emptyItem}>
                            <Checkbox checked={true} disabled={true}>
                                {messages?.empty?.bugs}
                            </Checkbox>
                        </div>
                        <div class={styled.emptyItem}>
                            <Checkbox checked={true} disabled={true}>
                                {messages?.empty?.metting}
                            </Checkbox>
                        </div>
                        <div class={styled.emptyItem}>
                            <Checkbox checked={true} disabled={true}>
                                {messages?.empty?.business}
                            </Checkbox>
                        </div>
                    </div>
                    <div class={styled.emptyFine}>
                        <ShoppingOutlined />
                        <span innerHTML={messages?.fine} />
                    </div>
                </>
            )
        }

        const renderTab = (tab: any, first?: boolean) => {
            const name = getSlotContent(tab, 'name')
            const icon = getSlotContent(tab, 'icon') ?? <MessageOutlined />
            const active = first ? tab?.props?.key || false : false
            return (
                <div
                    class={`${styled.tab}${active ? ` ${styled.tabActive}` : ''}`}
                    vertical={true}
                    align="center">
                    <div class={styled.tabIcon}>{icon}</div>
                    <div class={styled.tabName}>{name}</div>
                </div>
            )
        }

        const renderTabs = () => {
            const allSlots = getPropSlot(slots, props)
            const tabs: any = []
            if (allSlots && allSlots.length > 0) {
                allSlots.map((singleSlot: any, idx: number) => {
                    if (singleSlot?.type?.name === MiNoticeTab.name) {
                        tabs.push(renderTab(singleSlot, idx === 0))
                    }
                })
            }
            return (
                <swiper-container
                    freeMode={true}
                    modules={[FreeMode, Navigation]}
                    slidesPerView="auto"
                    direction="horizontal"
                    injectStyles={[`::slotted(swiper-slide) { width: auto; }`]}
                    spaceBetween={$tools.distinguishSize(props.tabGap)}>
                    {tabs.map((tab: any) => {
                        return <swiper-slide>{tab}</swiper-slide>
                    })}
                </swiper-container>
            )
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
                    trigger={props.trigger}
                    placement={props.placement}
                    color={props.background}
                    content={renderContent()}>
                    {renderIcon()}
                </Popover>
            </ConfigProvider>
        )
    }
})

MiNotice.Tab = MiNoticeTab
MiNotice.Item = MiNoticeItem

export default MiNotice as typeof MiNotice & {
    readonly Tab: typeof MiNoticeTab
    readonly Item: typeof MiNoticeItem
}
