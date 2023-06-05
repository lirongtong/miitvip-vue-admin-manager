import { defineComponent, PropType, SlotsType } from 'vue'
import { Popover, Badge, Tabs, Checkbox } from 'ant-design-vue'
import { BellOutlined, ShoppingOutlined } from '@ant-design/icons-vue'
import PropTypes from '../_utils/props-types'
import { useI18n } from 'vue-i18n'
import { getSlot, getPropSlot, getSlotContent, getPrefixCls } from '../_utils/props-tools'
import { $tools } from '../../utils/tools'
import MiClock from '../clock'

export const noticeProps = () => ({
    prefixCls: String,
    icon: PropTypes.any,
    iconSize: PropTypes.number,
    noDataTip: PropTypes.string.def('No Message ~ Enjoy your day.'),
    count: PropTypes.number.def(0),
    dot: PropTypes.bool.def(true),
    tabChange: PropTypes.func,
    trigger: PropTypes.any.def('click'),
    placement: {
        type: String as PropType<
            | 'top'
            | 'left'
            | 'right'
            | 'bottom'
            | 'topLeft'
            | 'topRight'
            | 'bottomLeft'
            | 'bottomRight'
            | 'leftTop'
            | 'leftBottom'
            | 'rightTop'
            | 'rightBottom'
        >,
        default: 'bottom'
    },
    extra: PropTypes.any
})

export default defineComponent({
    name: 'MiNotice',
    inheritAttrs: false,
    props: noticeProps(),
    slots: Object as SlotsType<{
        icon: any
        extra: any
    }>,
    setup(props, { slots }) {
        return () => {
            const { t, locale } = useI18n()
            const prefixCls = getPrefixCls('notice', props.prefixCls)
            const langCls = getPrefixCls(`lang-${locale.value}`)
            const emptyCls = `${prefixCls}-empty`

            const renderEmpty = () => {
                const date = new Date()
                let times = date.toDateString()
                let week: string | null = null
                if (['zh-cn', 'zh-tw'].includes(locale.value)) {
                    const weeks: string[] = [
                        t('week.sun'),
                        t('week.mon'),
                        t('week.tues'),
                        t('week.wed'),
                        t('week.thur'),
                        t('week.fri'),
                        t('week.sat')
                    ]
                    week = weeks[date.getDay()]
                    const year = date.getFullYear()
                    const month = date.getMonth() + 1
                    const day = date.getDate()
                    times = `${year}-${month > 9 ? month : `0` + month}-${
                        day > 9 ? day : `0` + day
                    }`
                }
                return (
                    <>
                        <div class={`${emptyCls}-time`}>
                            <div class={`${emptyCls}-date`}>{times}</div>
                            <div class={`${emptyCls}-week`}>{week}</div>
                        </div>
                        <MiClock />
                        <div class={`${emptyCls}-title`} innerHTML={t('notice.good-day')} />
                        <div class={`${emptyCls}-items`}>
                            <div class={`${emptyCls}-item`}>
                                <Checkbox checked={true} disabled={true}>
                                    {t('notice.no-bugs')}
                                </Checkbox>
                            </div>
                            <div class={`${emptyCls}-item`}>
                                <Checkbox checked={true} disabled={true}>
                                    {t('notice.no-meeting')}
                                </Checkbox>
                            </div>
                            <div class={`${emptyCls}-item`}>
                                <Checkbox checked={true} disabled={true}>
                                    {t('notice.no-business')}
                                </Checkbox>
                            </div>
                        </div>
                        <div class={`${emptyCls}-fine`}>
                            <ShoppingOutlined />
                            <span class="yes" innerHTML={t('notice.fine')}></span>
                        </div>
                    </>
                )
            }

            const renderIcon = () => {
                const icon = getPropSlot(slots, props, 'icon')
                const size = (
                    props.iconSize ? `font-size: ${$tools.px2Rem(props.iconSize)}` : null
                ) as any
                return (
                    <div class={`${prefixCls}-icon`}>
                        <Badge count={props.count} dot={props.dot}>
                            {icon ?? <BellOutlined style={size}></BellOutlined>}
                        </Badge>
                    </div>
                )
            }

            const renderTabPanes = () => {
                const tabs = getPropSlot(slots, props)
                const panes: any[] = []
                if (tabs && tabs.length > 0) {
                    const l = tabs.length
                    tabs.map((tab: any) => {
                        const title = getSlotContent(tab, 'title')
                        const content = getSlot(tab)
                        panes.push(
                            l > 1 ? (
                                <Tabs.TabPane key={tab.props.name} tab={title}>
                                    {content ?? tab}
                                </Tabs.TabPane>
                            ) : (
                                tab
                            )
                        )
                    })
                }
                return [...panes]
            }

            const renderContent = () => {
                const panes = renderTabPanes()
                const len = panes.length
                let content = len > 1 ? <Tabs onChange={props.tabChange}>{...panes}</Tabs> : panes
                if (len <= 0) content = renderEmpty()
                return (
                    <div class={`${prefixCls}-content${len <= 0 ? ` ${emptyCls}` : ''}`}>
                        {content}
                    </div>
                )
            }
            return (
                <Popover
                    overlayClassName={`${prefixCls} ${langCls}`}
                    destroyTooltipOnHide={true}
                    trigger={props.trigger}
                    placement={props.placement}
                    content={renderContent()}>
                    {renderIcon}
                </Popover>
            )
        }
    }
})
