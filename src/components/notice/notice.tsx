import { defineComponent } from 'vue'
import { Popover, Badge, Tabs } from 'ant-design-vue'
import { BellOutlined } from '@ant-design/icons-vue'
import MiNoticeTab from './tab'
import MiNoticeItem from './item'
import PropTypes, { getSlot, getSlotContent } from '../../utils/props'

const MiNotice = defineComponent({
    name: 'MiNotice',
    props: {
        class: PropTypes.string,
        icon: PropTypes.any,
        iconSize: PropTypes.number,
        hasTab: PropTypes.bool.def(true),
        count: PropTypes.number.def(0),
        dot: PropTypes.bool.def(true),
        placement: PropTypes.string.def('bottom'),
        extra: PropTypes.any
    },
    mounted() {
        this.$forceUpdate()
    },
    methods: {
        getPrefixCls() {
            return this.$tools.getPrefixCls('notice')
        },
        getIconElem() {
            const prefixCls = this.getPrefixCls()
            const icon = getSlotContent(this, 'icon')
            const iconSize = this.iconSize ? `font-size: ${Math.round(this.iconSize / 16)}rem` : null
            return (
                <div class={`${prefixCls}-icon`}>
                    <Badge count={this.count} dot={this.dot}>
                        { (icon ?? <BellOutlined style={iconSize}></BellOutlined>) }
                    </Badge>
                </div>
            )
        },
        getListElem(data: any[]) {
            const prefixCls = this.getPrefixCls()
            const list = []
            for (let n = 0, l = data.length; n < l; n++) {
                let title = null
                if (data[n].title) title = <div class={`${prefixCls}-title`} innerHTML={data[n].title} />
                let icon = null
                if (data[n].icon) {
                    const IconComponent = `${data[n].icon}`
                    icon = (
                        <div class={`${prefixCls}-icon`}>
                            <IconComponent />
                        </div>
                    )
                }
                const item = (
                    <div class={`${prefixCls}-item`}>
                        { icon }
                        { title }
                    </div>
                )
                list.push(item)
            }
            return [...list]
        },
        getTabPanesElem() {
            const tabs = getSlot(this)
            const panes = []
            const len = tabs.length
            if (len > 0) {
                for (let i = 0; i < len; i++) {
                    const title = getSlotContent(tabs[i], 'title')
                    panes.push(this.hasTab ? (
                        <Tabs.TabPane key={tabs[i].props.name} tab={title}>
                            { tabs[i] }
                        </Tabs.TabPane>
                    ) : tabs[i])
                }
            }
            return [...panes]
        },
        getContentElem() {
            const prefixCls = this.getPrefixCls()
            const panes = this.getTabPanesElem()
            let content = this.hasTab ? (<Tabs>{ panes }</Tabs>) : panes
            if (panes.length <= 0) {
                content = (<div class={`${prefixCls}-no-data`}>暂无数据 ( no data )</div>)
            }
            return (
                <div class={`${prefixCls}-content`}>
                    { content }
                </div>
            )
        }
    },
    render() {
        return (
            <Popover
                class={this.class}
                placement={this.placement}
                trigger="click"
                content={ this.getContentElem() }>
                { this.getIconElem() }
            </Popover>
        )
    }
})

MiNotice.Tab = MiNoticeTab
MiNotice.Item = MiNoticeItem
export default MiNotice as typeof MiNotice & {
    readonly Tab: typeof MiNoticeTab,
    readonly Item: typeof MiNoticeItem
}