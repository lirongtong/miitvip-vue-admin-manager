/* eslint-disable import/no-unresolved */
import {
    defineComponent,
    type SlotsType,
    ref,
    isVNode,
    createVNode,
    computed,
    Transition,
    nextTick
} from 'vue'
import { BellOutlined, ShoppingOutlined, MessageOutlined } from '@ant-design/icons-vue'
import { ConfigProvider, Popover, Badge, Checkbox, Row, Flex } from 'ant-design-vue'
import { $tools } from '../../utils/tools'
import { getPrefixCls, getPropSlot, getSlotContent } from '../_utils/props'
import { NoticeItemProperties, NoticeProps } from './props'
import { useI18n } from 'vue-i18n'
import { useWindowResize } from '../../hooks/useWindowResize'
import { FreeMode } from 'swiper/modules'
import MiClock from '../clock'
import MiNoticeTab from './Tab'
import MiNoticeItem from './Item'
import applyTheme from '../_utils/theme'
import styled from './style/notice.module.less'
import 'swiper/css'
import 'swiper/css/free-mode'

const MiNotice = defineComponent({
    name: 'MiNotice',
    inheritAttrs: false,
    slots: Object as SlotsType<{
        default: any
        icon: any
    }>,
    props: NoticeProps(),
    emits: ['tabClick', 'tabChange', 'itemClick'],
    setup(props, { slots, emit }) {
        const { t, tm } = useI18n()
        const { width } = useWindowResize()
        const iconRef = ref<HTMLElement>()
        const containerId = $tools.uid()
        const containerEl = ref()
        const size = computed(() => {
            return $tools.convert2rem($tools.distinguishSize(props.width, width.value))
        })
        const itemsAnim = getPrefixCls('anim-slide')
        const swiperRef = ref()
        const active = ref(0)
        const defaultActive = ref(props.tabDefaultActive)
        const init = ref<boolean>(false)

        applyTheme(styled)

        const handleTabClick = (key: string | number) => {
            emit('tabClick', key)
            nextTick().then(() => {
                if (swiperRef.value) {
                    const swiper = swiperRef.value?.swiper
                    const index = swiper?.clickedIndex ?? 0
                    if (active.value !== index) {
                        active.value = index
                        emit('tabChange', key, active.value)
                    }
                    const slides = swiper?.slides || []
                    slides.forEach((slide: HTMLElement) => {
                        slide?.classList?.remove('active')
                    })
                    const current = slides?.[index] as HTMLElement
                    if (current) current?.classList?.add('active')
                }
            })
        }

        const handleItemClick = (func?: any) => {
            if (func) func()
            else emit('itemClick')
        }

        const handleOpenChange = async (status: boolean) => {
            if (status && !init.value) {
                await nextTick()
                if (swiperRef.value) {
                    const slides = swiperRef.value.querySelectorAll('swiper-slide') || []
                    slides.forEach((slide: HTMLElement) => {
                        slide?.classList?.remove('active')
                    })
                    const current = slides?.[active.value] as HTMLElement
                    if (current) current?.classList?.add('active')
                    init.value = true
                }
            }
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
                interceptTitle: itemSlot?.props.interceptTitle,
                interceptSummary: itemSlot?.props?.interceptSummary,
                onClick: itemSlot?.props?.onClick
            }
        }

        const renderIcon = () => {
            const icon = getPropSlot(slots, props, 'icon')
            const style = {
                fontSize: props?.iconSetting?.size
                    ? $tools.convert2rem($tools.distinguishSize(props?.iconSetting.size))
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
                            <Checkbox
                                checked={true}
                                disabled={true}
                                name={`mi-bug-${$tools.uid()}`}>
                                {messages?.empty?.bugs}
                            </Checkbox>
                        </div>
                        <div class={styled.emptyItem}>
                            <Checkbox
                                checked={true}
                                disabled={true}
                                name={`mi-meeting-${$tools.uid()}`}>
                                {messages?.empty?.metting}
                            </Checkbox>
                        </div>
                        <div class={styled.emptyItem}>
                            <Checkbox
                                checked={true}
                                disabled={true}
                                name={`mi-business-${$tools.uid()}`}>
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

        const renderTab = (tab: any, idx: number, key?: string | number) => {
            const isStrTab = typeof tab === 'string'
            const defaultIcon = <MessageOutlined />
            const defaultName = t('notice.title')
            const name = isStrTab
                ? tab
                : isVNode(tab)
                  ? getSlotContent(tab, 'name') ?? defaultName
                  : tab?.tab ?? defaultName
            const icon = isStrTab
                ? defaultIcon
                : isVNode(tab)
                  ? getSlotContent(tab, 'icon') ?? defaultIcon
                  : tab?.icon ?? defaultIcon
            return (
                <Row
                    id={$tools.uid()}
                    class={[styled.tab, getPrefixCls('notice-tab')]}
                    onClick={() => handleTabClick(key ?? idx)}>
                    <Row class={[styled.tabIcon, getPrefixCls('notice-tab-icon')]}>{icon}</Row>
                    <div class={[styled.tabName, getPrefixCls('notice-tab-name')]} title={name}>
                        {name}
                    </div>
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
                    interceptTitle={item?.interceptTitle}
                    interceptSummary={item?.interceptSummary}
                />
            )
        }

        const renderTabItems = (tab: any) => {
            let items: any[] = []
            const isStrTab = typeof tab === 'string'
            if (isStrTab) {
                for (let i = 0, l = (props.items || []).length; i < l; i++) {
                    const item = props.items[i]
                    if (Array.isArray(item) && i === active.value) {
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
                const curItems = tab?.items || props.items?.[active.value] || []
                for (let i = 0, l = curItems.length; i < l; i++) {
                    const item = curItems[i]
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
                <Transition name={itemsAnim} appear={true}>
                    <Flex vertical={true} class={styled.items}>
                        {...items}
                    </Flex>
                    {...extras}
                </Transition>
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
                const key = isVNode(tab) ? tab?.props?.tab ?? i : i
                if (key === active.value) {
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
                        const key = singleSlot?.props?.name ?? idx
                        if (key === props.tabDefaultActive) {
                            defaultActive.value = key
                            active.value = idx
                        }
                        tabs.push(renderTab(singleSlot, idx, key))
                    } else extras.push(singleSlot)
                })
            }
            if (tabs.length <= 0 && props.tabs && props.tabs.length > 0) {
                // 参数配置 tabs ( 快速生成 )
                allSlots = props.tabs
                ;(props.tabs || []).forEach((tab: any, idx: number) => {
                    const key = typeof tab === 'string' ? idx : tab?.tab ?? idx
                    if (key === props.tabDefaultActive) {
                        defaultActive.value = key
                        active.value = idx
                    }
                    tabs.push(renderTab(tab, idx, key))
                })
            }
            const slides: any[] = []
            tabs.forEach((tab: any) => {
                slides.push(<swiper-slide>{tab}</swiper-slide>)
            })
            return tabs.length > 0 ? (
                <>
                    <swiper-container
                        ref={swiperRef}
                        initial-slide={defaultActive.value}
                        free-mode={true}
                        mousewheel={true}
                        pagination={false}
                        modules={[FreeMode]}
                        observer={true}
                        observer-parents={true}
                        direction={'horizontal'}
                        slides-per-view={'auto'}
                        slide-to-clicked-slide={true}
                        space-between={$tools.distinguishSize(props.tabGap)}
                        centered-slides={props.tabCenter}
                        centered-slides-bounds={props.tabCenter}
                        id={$tools.uid()}>
                        {...slides}
                    </swiper-container>
                    <Transition name={itemsAnim} appear={true}>
                        <Flex vertical={true} class={styled.items}>
                            {...renderTabSlot(allSlots)}
                        </Flex>
                    </Transition>
                    {renderExtra(extras)}
                </>
            ) : (
                renderItemsOnly(allSlots)
            )
        }

        const renderContent = () => {
            const content = renderTabs()
            return (
                <div
                    ref={containerEl}
                    class={[styled.content, { [styled.empty]: !content }]}
                    id={containerId}
                    key={containerId}>
                    {content ?? renderEmpty()}
                </div>
            )
        }

        return () => (
            <ConfigProvider theme={{ ...$tools.getAntdvThemeProperties() }}>
                <Popover
                    overlayClassName={styled.container}
                    overlayStyle={{ width: size.value, maxWidth: '100%', zIndex: Date.now() }}
                    trigger={props.trigger}
                    placement={props.placement}
                    color={props.background}
                    content={renderContent()}
                    onOpenChange={handleOpenChange}
                    key={$tools.uid()}>
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
