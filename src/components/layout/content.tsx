import { defineComponent } from 'vue'
import { Layout } from 'ant-design-vue'

export default defineComponent({
    name: 'MiContent',
    render() {
        return (
            <Layout.Content class="mi-layout-content">
                { this.$slots.default }
            </Layout.Content>
        )
    }
})