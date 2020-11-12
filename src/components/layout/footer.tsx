import { defineComponent } from 'vue'
import { Layout } from 'ant-design-vue'

export default defineComponent({
    name: 'MiFooter',
    computed: {
        copyright() {
            return this.$g.mobile
                ? this.$g.copyright
                : this.$g.footer
        }
    },
    render() {
        const prefixCls = this.$tools.getPrefixCls('layout-footer')
        let slots = this.$slots.default
        if (slots === undefined) {
            slots = () => (
                <div class={`${prefixCls}-content`} innerHTML={this.copyright}></div>
            )
        }
        return (
            <Layout.Footer class={prefixCls}>
                { slots }
            </Layout.Footer>
        )
    }
})