import { defineComponent } from 'vue'
import { Popover, Badge, Empty, Tabs } from 'ant-design-vue'
import { BellOutlined } from '@ant-design/icons-vue'
import PropTypes from '../_utils/props-types'
import { getSlot, getPropSlot, getSlotContent, getPrefixCls, pxToRem } from '../_utils/props-tools'

export const noticeProps = () => ({
    prefixCls: String,
    className: PropTypes.string,
    icon: PropTypes.any,
    iconSize: PropTypes.number,
    noDataTip: PropTypes.string.def('No Data'),
    count: PropTypes.number.def(0),
    dot: PropTypes.bool.def(true),
    tabChange: PropTypes.func,
    trigger: PropTypes.any.def('click'),
    placement: PropTypes.string.def('bottom'),
    extra: PropTypes.any
})

export default defineComponent({
    name: 'MiNotice',
    inheritAttrs: false,
    props: noticeProps(),
    slots: ['icon', 'extra'],
    setup(props, { slots }) {
        return () => {
            const prefixCls = getPrefixCls('notice', props.prefixCls)
            const getIconElem = () => {
                const icon = getPropSlot(slots, props, 'icon')
                const size = props.iconSize ? `font-size: ${pxToRem(props.iconSize)}` : null
                return (
                    <div class={`${prefixCls}-icon`}>
                        <Badge count={props.count} dot={props.dot}>
                            {icon ?? <BellOutlined style={size}></BellOutlined>}
                        </Badge>
                    </div>
                )
            }
            const getTabPanesElem = () => {
                const tabs = getPropSlot(slots, props)
                const panes = []
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
            const getContentElem = () => {
                const panes = getTabPanesElem()
                const len = panes.length
                let content = len > 1 ? <Tabs onChange={props.tabChange}>{...panes}</Tabs> : panes
                if (len <= 0) content = <Empty description={props.noDataTip}></Empty>
                return <div class={`${prefixCls}-content`}>{content}</div>
            }
            return (
                <Popover class={props.className} trigger={props.trigger} content={getContentElem()}>
                    {getIconElem}
                </Popover>
            )
        }
    }
})
