import { defineComponent } from 'vue'
import { Popover, Badge, Tabs } from 'ant-design-vue'
import { BellOutlined } from '@ant-design/icons-vue'
import PropTypes, { getSlot, getSlotContent } from '../../utils/props'

export default defineComponent({
    name: 'MiNotice',
    props: {
        class: PropTypes.string,
        tabs: PropTypes.array,
        tabChange: PropTypes.func,
        tabClick: PropTypes.func,
        icon: PropTypes.any,
        iconSize: PropTypes.number,
        count: PropTypes.number.def(0),
        dot: PropTypes.bool.def(true),
        data: PropTypes.oneOfType([PropTypes.object, PropTypes.array]).isRequired,
        placement: PropTypes.string.def('bottomRight')
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
                        { () => (icon ?? <BellOutlined style={iconSize}></BellOutlined>) }
                    </Badge>
                </div>
            )
        },
        getListElem(data: any[]) {
            const prefixCls = this.getPrefixCls()
            const list = []
            for (let n = 0, l = data.length; n < l; n++) {
                let title = null
                if (data[n].title) {
                    title = (<div class={`${prefixCls}-title`} innerHTML={data[n].title} />)
                }

                let icon = null
                if (data[n].icon) {
                    const IconComponent = data[n].icon
                    icon = (
                        <div class={`${prefixCls}-icon`}>
                            <component is={IconComponent}></component>
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
            const prefixCls = this.getPrefixCls()
            const panes = []
            const len = Array.isArray(this.tabs) ? this.tabs.length : Object.keys(this.tabs).length
            for (let i = 0; i < len; i++) {
                let content = [(<div class={`${prefixCls}-no-data`}>暂无有效数据</div>)]
                const data = this.data[this.tabs[i].id]
                if (Array.isArray(data) && data.length > 0) content = this.getListElem(data)
                panes.push((
                    <Tabs.TabPane key={this.tabs[i].id} tab={this.tabs[i].name}>
                        { () => content }
                    </Tabs.TabPane>
                ))
            }
            return [...panes]
        },
        getContentElem() {
            const prefixCls = this.getPrefixCls()
            const defaultSlot = getSlot(this)
            const content = defaultSlot.length > 0 ? defaultSlot : (
                <Tabs>{ () => this.getTabPanesElem() }</Tabs>
            )
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
                content={() => this.getContentElem()}>
                { () => this.getIconElem() }
            </Popover>
        )
    }
})