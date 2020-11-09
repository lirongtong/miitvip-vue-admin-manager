import { defineComponent } from 'vue'
import { Layout } from 'ant-design-vue'
import { MenuFoldOutlined, MenuUnfoldOutlined, ExpandOutlined } from '@ant-design/icons-vue'
import MiNotice from '../notice'
import MiDropdown from '../dropdown'

export default defineComponent({
    name: 'MiLayoutHeader',
    render() {
        const headerPrefixCls = 'mi-layout-header'
        const cls = {
            headerLeft: `${headerPrefixCls}-left`,
            headerRight: `${headerPrefixCls}-right`,
            headerTrigger: `${headerPrefixCls}-trigger`,
            headerTriggerMin: `${headerPrefixCls}-trigger-min`
        }
        const triggerCls = `${cls.headerTrigger} ${cls.headerTriggerMin}`
        let foldIcon = (<MenuUnfoldOutlined></MenuUnfoldOutlined>)
        let screenIcon = (
            <div class={triggerCls}>
                <ExpandOutlined></ExpandOutlined>
            </div>
        )
        if (this.$g.mobile) {
            foldIcon = (<MenuFoldOutlined></MenuFoldOutlined>)
            screenIcon = undefined
        }
        let slots = this.$slots.default
        if (!slots) {
            slots = () => [(
                <>
                    <div class={cls.headerLeft}>
                        <div class={cls.headerTrigger}>{ foldIcon }</div>
                    </div>
                    <div class={cls.headerRight}>
                        <div class={triggerCls}>{ screenIcon }</div>
                        <div class={triggerCls}>{ <MiNotice></MiNotice> }</div>
                        <div class={triggerCls}>{ <MiDropdown></MiDropdown> }</div>
                    </div>
                </>
            )]
        }
        return (
            <Layout.Header class={headerPrefixCls}>
                { ...slots }
            </Layout.Header>
        )
    }
})
