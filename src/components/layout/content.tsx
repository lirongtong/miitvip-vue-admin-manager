import { defineComponent } from 'vue'
import { RouterView } from 'vue-router'
import { Layout } from 'ant-design-vue'

export default defineComponent({
    name: 'MiContent',
    beforeCreate() {
        if (!this.$route) {
            throw new Error('[vue-router] must be required. Please import and install [vue-router] before makeit-admin-pro\r\n')
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