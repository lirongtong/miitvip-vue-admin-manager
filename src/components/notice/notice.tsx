import { defineComponent } from 'vue'
import { Popover, Badge, Tabs } from 'ant-design-vue'
import { BellOutlined } from '@ant-design/icons-vue'
import PropTypes, { getSlot, getSlotContent } from '../../utils/props'

export default defineComponent({
    name: 'MiNotice',
    props: {
        class: PropTypes.string,
        icon: PropTypes.any,
        iconSize: PropTypes.number,
        hasTab: PropTypes.bool.def(false),
        tabChange: PropTypes.func,
        count: PropTypes.number.def(0),
        dot: PropTypes.bool.def(true),
        maxWidth: PropTypes.number.def(295),
        placement: PropTypes.string.def('bottom'),
        extra: PropTypes.any
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
                tabs.map((tab: any) => {
                    const title = getSlotContent(tab, 'title')
                    const content = getSlot(tab)
                    panes.push(this.hasTab ? (
                        <Tabs.TabPane key={tab.props.name} tab={title}>
                            { content.length > 0 ? content : tab }
                        </Tabs.TabPane>
                    ) : tab)
                })
            }
            return [...panes]
        },
        getContentElem() {
            const prefixCls = this.getPrefixCls()
            const panes = this.getTabPanesElem()
            let content = this.hasTab ? (<Tabs onChange={this.tabChange}>{ ...panes }</Tabs>) : panes
            if (panes.length <= 0) {
                content = (<div class={`${prefixCls}-no-data`}>暂无数据 ( no data )</div>)
            }
            return (
                <div class={`${prefixCls}-content`} style={{maxWidth: `${this.maxWidth}px`}}>
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