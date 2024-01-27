import { defineComponent, type SlotsType, ref, isVNode } from 'vue'
import { BellOutlined, ShoppingOutlined, MessageOutlined } from '@ant-design/icons-vue'
import { ConfigProvider, Popover, Badge, Checkbox, Flex, Row } from 'ant-design-vue'
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
    emits: ['tabClick', 'tabChange', 'update:tabActive'],
    setup(props, { slots, emit }) {
        const { t, tm } = useI18n()
        const width = $tools.convert2rem($tools.distinguishSize(props.width))
        const iconRef = ref<HTMLElement>()

        applyTheme(styled)

        const handleTabClick = (key: string) => {
            emit('tabClick', key)
            emit('update:tabActive', key)
        }

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

        const renderTab = (tab: any, key: string) => {
            const tabIsStr = typeof tab === 'string'
            const defaultIcon = <MessageOutlined />
            const defaultName = t('notice.title')
            const name = tabIsStr
                ? tab
                : isVNode(tab)
                  ? getSlotContent(tab, 'name') ?? defaultName
                  : tab?.name ?? defaultName
            const icon = tabIsStr
                ? defaultIcon
                : isVNode(tab)
                  ? getSlotContent(tab, 'icon') ?? defaultIcon
                  : tab?.icon ?? defaultIcon
            return (
                <Row
                    class={`${styled.tab}${key === props.tabActive ? ` ${styled.tabActive}` : ``}`}
                    onClick={() => handleTabClick(key)}>
                    <Row class={styled.tabIcon}>{icon}</Row>
                    <Row class={styled.tabName}>{name}</Row>
                </Row>
            )
        }

        const renderTabSlot = (tabs: any[]) => {
            let tabSlot: any = null
            ;(tabs || []).map((tab: any) => {
                if (tab?.type?.name === MiNoticeTab.name) {
                    const key = tab?.props?.key
                    if (key === props.tabActive) {
                        tabSlot = (
                            <Flex class={styled.items} vertical={true}>
                                {tab}
                            </Flex>
                        )
                    }
                }
            })
            return tabSlot
        }

        const renderTabs = () => {
            let allSlots = getPropSlot(slots, props)
            const tabs: any[] = []
            if (allSlots && allSlots.length > 0) {
                allSlots.map((singleSlot: any, idx: number) => {
                    if (singleSlot?.type?.name === MiNoticeTab.name) {
                        const key = singleSlot?.props?.key || idx.toString()
                        tabs.push(renderTab(singleSlot, key))
                    }
                })
            }
            if (tabs.length <= 0 && props.tabs && props.tabs.length > 0) {
                allSlots = props.tabs
                ;(props.tabs || []).forEach((tab: any, idx: number) => {
                    let key = idx.toString()
                    key = typeof tab === 'string' ? key : tab?.key ?? key
                    tabs.push(renderTab(tab, key))
                })
            }
            return tabs.length > 0 ? (
                <>
                    <swiper-container
                        freeMode={true}
                        modules={[FreeMode, Navigation]}
                        slidesPerView="auto"
                        direction="horizontal"
                        injectStyles={[
                            `::slotted(swiper-slide) { width: auto; }
                            ::slotted(swiper-slide:last-child) { margin-right: 0 !important; }`
                        ]}
                        spaceBetween={$tools.distinguishSize(props.tabGap)}>
                        {tabs.map((tab: any) => {
                            return <swiper-slide>{tab}</swiper-slide>
                        })}
                    </swiper-container>
                    {renderTabSlot(allSlots)}
                    {getPropSlot(slots, props, 'extra')}
                </>
            ) : null
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
