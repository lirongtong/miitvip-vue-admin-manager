import { defineComponent } from 'vue'
import { Layout } from 'ant-design-vue'

export default defineComponent({
    name: 'MiLayoutSider',
    setup() {
        const slots = {
            default: () => (
                <div class="menu"></div>
            )
        }
        return () => (
            <Layout.Sider class="mi-layout-sider" width="256" breakpoint="lg">
                { slots }
            </Layout.Sider>
        )
    }
})