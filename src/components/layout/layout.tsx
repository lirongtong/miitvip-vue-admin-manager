import { defineComponent } from 'vue'
import Header from './header'

import { Layout as ALayout } from 'ant-design-vue'

const Layout = defineComponent({
    name: 'MiLayout',
    render() {
        return <ALayout class="mi-layout">
            {this.$slots.default}
        </ALayout>
    }
})
Layout.Header = Header
export default Layout as typeof Layout & {
    readonly Header: typeof Header
}
