/* eslint-disable import/no-unresolved */
import { defineComponent, type SlotsType, ref, isVNode, watch, createVNode } from 'vue'
import { BellOutlined, ShoppingOutlined, MessageOutlined } from '@ant-design/icons-vue'
import { ConfigProvider, Popover, Badge, Checkbox, Row, Flex } from 'ant-design-vue'
import { $tools } from '../../utils/tools'
import { getPropSlot, getSlotContent } from '../_utils/props'
import { NoticeItemProperties, NoticeProps } from './props'
import { useI18n } from 'vue-i18n'
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
    }>,
    props: NoticeProps(),
    emits: ['tabClick', 'tabChange', 'update:tabActive', 'itemClick'],
    setup(props, { slots, emit }) {
        const { t, tm } = useI18n()
        const width = $tools.convert2rem($tools.distinguishSize(props.width))
        const iconRef = ref<HTMLElement>()

        applyTheme(styled)

        const handleTabClick = (key: string) => {
            emit('tabClick', key)
            emit('update:tabActive', key)
        }

        const handleItemClick = (func?: any) => {
            if (func) func()
            else emit('itemClick')
        }

        const getItemSlotContent = (itemSlot: any) => {
            return {
                title: getSlotContent(itemSlot, 'title'),
                summary: getSlotContent(itemSlot, 'summary'),
                date: getSlotContent(itemSlot, 'date'),
                tag: getSlotContent(itemSlot, 'tag'),
                tagColor: itemSlot?.props?.tagColor || itemSlot?.props?.['tag-color'],
                tagIcon: itemSlot?.children?.icon,
                avatar: getSlotContent(itemSlot, 'avatar'),
                content: getSlotContent(itemSlot, 'content'),
                onClick: itemSlot?.props?.onClick
            }
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
                    tagIcon={item?.tagIcon ? createVNode(item?.tagIcon) : null}
                    tagColor={item?.tagColor}
                    onClick={() => handleItemClick(item?.onClick)}
                    content={item?.content}
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
                const tabItemSlots = getSlotContent(tab)
                const extra = []
                if (Array.isArray(tabItemSlots) && tabItemSlots.length > 0) {
                    tabItemSlots.forEach((tabItemSlot: any) => {
                        const comp = tabItemSlot?.type?.name
                        if (comp === MiNoticeItem.name) {
                            items.push(renderTabItem(getItemSlotContent(tabItemSlot)))
                        } else extra.push(tabItemSlot)
                        if (extra.length > 0) items.push(...extra)
                    })
                } else if (tabItemSlots?.type?.name === MiNoticeItem.name) {
                    items.push(renderTabItem(getItemSlotContent(tabItemSlots)))
                } else extra.push(tabItemSlots)
            } else {
                for (let i = 0, l = (tab?.items || []).length; i < l; i++) {
                    const item = tab.items[i]
                    items.push(renderTabItem(item))
                }
            }
            return items
        }

        const renderItemsOnly = (allSlots: any[]) => {
            const items: any[] = []
            const extras: any[] = []
            if (allSlots && allSlots.length > 0) {
                allSlots.map((singleSlot: any) => {
                    if (singleSlot?.type?.name === MiNoticeItem.name) {
                        items.push(renderTabItem(getItemSlotContent(singleSlot)))
                    } else if (
                        !(
                            typeof singleSlot?.type === 'symbol' &&
                            typeof singleSlot?.children === 'string'
                        )
                    )
                        extras.push(singleSlot)
                })
            }
            if (items.length <= 0 && props.items && props.items.length > 0) {
                ;(props.items || []).forEach((item: Partial<NoticeItemProperties>) => {
                    if (!Array.isArray(item)) items.push(renderTabItem(item))
                })
            }
            return items.length > 0 ? (
                <>
                    <Flex vertical={true} class={styled.items}>
                        {...items}
                    </Flex>
                    {...extras}
                </>
            ) : extras.length > 0 ? (
                { ...extras }
            ) : null
        }

        const renderExtra = (extras: any[]) => {
            const items: any[] = []
            const others: any[] = []
            ;(extras || []).forEach((extra: any) => {
                if (extra?.type?.name === MiNoticeItem.name) {
                    items.push(renderTabItem(getItemSlotContent(extra)))
                } else others.push(extra)
            })
            return (
                <Row class={styled.extra}>
                    {...items}
                    {...others}
                </Row>
            )
        }

        const renderTabSlot = (tabs: any[]): any[] => {
            let tabSlots: any[] = []
            for (let i = 0, l = tabs.length; i < l; i++) {
                const tab = tabs[i]
                const key = isVNode(tab) ? tab?.props?.key ?? i.toString() : i.toString()
                if (key === props.tabActive) {
                    tabSlots = renderTabItems(tab)
                    break
                }
            }
            return tabSlots
        }

        const renderTabs = () => {
            let allSlots = getPropSlot(slots, props)
            const tabs: any[] = []
            const extras: any[] = []
            if (allSlots && allSlots.length > 0) {
                // 自定义配置 mi-notice-tab
                allSlots.map((singleSlot: any, idx: number) => {
                    if (singleSlot?.type?.name === MiNoticeTab.name) {
                        const key = singleSlot?.props?.key || idx.toString()
                        tabs.push(renderTab(singleSlot, key))
                    } else extras.push(singleSlot)
                })
            }
            if (tabs.length <= 0 && props.tabs && props.tabs.length > 0) {
                // 参数配置 tabs ( 快速生成 )
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
                    {renderExtra(extras)}
                </>
            ) : (
                renderItemsOnly(allSlots)
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
