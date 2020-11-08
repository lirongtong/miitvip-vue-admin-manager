import { defineComponent } from 'vue'
import { Layout } from 'ant-design-vue'

export default defineComponent({
    name: 'MiFooter',
    computed: {
        copyright() {
            return this.$g.mobile ? this.$g.copyright : this.$g.footer
        }
    },
    render() {
        let slots = this.$slots.default
        if (!slots) slots = () => (<div class="mi-layout-footer-content" innerHTML={this.copyright}></div>)
        return (
            <Layout.Footer class="mi-layout-footer">
                { slots }
            </Layout.Footer>
        )
    }
})