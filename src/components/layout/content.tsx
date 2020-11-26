import { defineComponent } from 'vue'
import { RouterView } from 'vue-router'
import { Layout } from 'ant-design-vue'
import MiBreadcrumb from './breadcrumb'

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
                { () => (
                    <>
                        <MiBreadcrumb></MiBreadcrumb>
                        <RouterView></RouterView>
                    </>
                ) }
            </Layout.Content>
        )
    }
})