import { defineComponent } from 'vue'
import { Layout } from 'ant-design-vue'
import { getSlot } from '../../utils/props'

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
        let defaultSlot = getSlot(this)
        if (defaultSlot.length <= 0) defaultSlot = [<div class={`${prefixCls}-content`} innerHTML={this.copyright}></div>]
        return (
            <Layout.Footer class={prefixCls}>
                { defaultSlot }
            </Layout.Footer>
        )
    }
})