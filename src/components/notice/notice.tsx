import { defineComponent } from 'vue'
import { Popover, Badge, Tabs } from 'ant-design-vue'
import { BellOutlined } from '@ant-design/icons-vue'

export default defineComponent({
    name: 'MiNotice',
    props: {
        class: {
            type: String,
            default: undefined
        },
        tabs: {
            type: [Object, Array],
            default: undefined
        }
    },
    render() {
        const tabs = this.tabs ?? {
            0: {
                id: 'notice',
                name: '消息 ( 1 )',
                content: () => ('消息通知')
            },
            1: {
                id: 'coming',
                name: '待办 ( 1 )',
                content: () => ('待办事件')
            }
        }
        const tabPanes = () => {
            const panes = []
            const len = Array.isArray(tabs) ? tabs.length : Object.keys(tabs).length
            for (let i = 0; i < len; i++) {
                panes.push((
                    <Tabs.TabPane key={tabs[i].id} tab={tabs[i].name}>
                        { tabs[i].content }
                    </Tabs.TabPane>
                ))
            }
            return [...panes]
        }
        const content = (
            <div class="content">
                <Tabs>
                    { () => tabPanes() }
                </Tabs>
            </div>
        )
        let slots = this.$slots.default
        if (!slots) {
            slots = () => [(
                <div class="icon">
                    <Badge count="1" dot>{ () => (<BellOutlined></BellOutlined>) }</Badge>
                </div>
            )]
        }
        return (
            <Popover class={this.class} placement="bottomRight" trigger="click" content={() => content}>
                { ...slots }
            </Popover>
        )
    }
})