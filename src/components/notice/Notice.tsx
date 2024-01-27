import { defineComponent, type SlotsType, ref, isVNode, watch } from 'vue'
import { BellOutlined, ShoppingOutlined, MessageOutlined } from '@ant-design/icons-vue'
import { ConfigProvider, Popover, Badge, Checkbox, Row, Flex } from 'ant-design-vue'
import { $tools } from '../../utils/tools'
import { getPropSlot, getSlotContent } from '../_utils/props'
import { NoticeItemProperties, NoticeProps } from './props'
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
            const isStrTab = typeof tab === 'string'
            const defaultIcon = <MessageOutlined />
            const defaultName = t('notice.title')
            const name = isStrTab
                ? tab
                : isVNode(tab)
                  ? getSlotContent(tab, 'name') ?? defaultName
                  : tab?.name ?? defaultName
            const icon = isStrTab
                ? defaultIcon
                : isVNode(tab)
                  ? getSlotContent(tab, 'icon') ?? defaultIcon
                  : tab?.icon ?? defaultIcon
            return (
                <Row
                    key={$tools.uid()}
                    class={`${styled.tab}${key === props.tabActive ? ` ${styled.tabActive}` : ``}`}
                    onClick={() => handleTabClick(key)}>
                    <Row class={styled.tabIcon}>{icon}</Row>
                    <Row class={styled.tabName}>{name}</Row>
                </Row>
            )
        }

        const renderTabItem = (item: Partial<NoticeItemProperties>) => {
            return (
                <MiNoticeItem
                    key={$tools.uid()}
                    title={item?.title}
                    summary={item?.summary}
                    date={item?.date}
                    tag={item?.tag}
                    avatar={item?.avatar}
                />
            )
        }

        const renderTabItems = (tab: any) => {
            let items: any[] = []
            const isStrTab = typeof tab === 'string'
            if (isStrTab) {
                for (let i = 0, l = (props.items || []).length; i < l; i++) {
                    const key = i.toString()
                    const item = props.items[i]
                    if (Array.isArray(item) && key === props.tabActive) {
                        ;(item || []).forEach((data: Partial<NoticeItemProperties>) => {
                            items.push(renderTabItem(data))
                        })
                        break
                    }
                }
            } else if (isVNode(tab)) {
                const key = tab?.props?.key
                if (key === props.tabActive) {
                    const tabItemSlots = getSlotContent(tab)
                    if (tabItemSlots.length > 0) {
                        const extra = []
                        tabItemSlots.forEach((tabItemSlot: any) => {
                            const comp = tabItemSlot?.type?.name
                            if (comp === MiNoticeItem.name) {
                                const item = {
                                    title: getSlotContent(tabItemSlot, 'title'),
                                    summary: getSlotContent(tabItemSlot, 'summary'),
                                    date: getSlotContent(tabItemSlot, 'date'),
                                    tag: getSlotContent(tabItemSlot, 'tag'),
                                    avatar: getSlotContent(tabItemSlot, 'avatar')
                                }
                                items.push(renderTabItem(item))
                            } else extra.push(tabItemSlot)
                            if (extra.length > 0) items.push(...extra)
                        })
                    }
                }
            } else {
                for (let i = 0, l = (tab?.items || []).length; i < l; i++) {
                    const item = tab.items[i]
                    items.push(renderTabItem(item))
                }
            }
            return items
        }

        const renderTabSlot = (tabs: any[]): any[] => {
            let tabSlots: any[] = []
            for (let i = 0, l = tabs.length; i < l; i++) {
                const tab = tabs[i]
                tabSlots = renderTabItems(tab)
                if (tabSlots.length > 0) break
            }
            return tabSlots
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
                    <Flex vertical={true} class={styled.items}>
                        {...renderTabSlot(allSlots)}
                    </Flex>
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

        watch(
            () => props.tabActive,
            (nVal: string) => emit('tabChange', nVal)
        )

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
