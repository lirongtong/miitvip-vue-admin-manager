import { defineComponent } from 'vue'
import { Layout } from 'ant-design-vue'
import { MenuFoldOutlined } from '@ant-design/icons-vue'

export default defineComponent({
    name: 'MiLayoutHeader',
    render() {
        const headerCls = 'mi-layout-header'
        const cls = {
            headerLeft: `${headerCls}-left`,
            headerRight: `${headerCls}-right`,
            headerTrigger: `${headerCls}-trigger`,
            headerTriggerMin: `${headerCls}-trigger-min`
        }
        let slots = this.$slots.default
        if (!slots) {
            slots = () => (
                <>
                    <div class={cls.headerLeft}>
                        <MenuFoldOutlined></MenuFoldOutlined>
                    </div>
                    <div class={cls.headerRight}></div>
                </>
            )
        }
        return (
            <Layout.Header class={headerCls}>
                { slots }
            </Layout.Header>
        )
    }
})
