import { defineComponent } from 'vue'
import { RouterView } from 'vue-router'
import { Layout } from 'ant-design-vue'

export default defineComponent({
    name: 'MiContent',
    created() {
        if (!this.$route) {
            this.$tools.importError('vue-router')
        }
    },
    render() {
        return (
            <Layout.Content class="mi-layout-content">
                { () => <RouterView></RouterView> }
            </Layout.Content>
        )
    }
})