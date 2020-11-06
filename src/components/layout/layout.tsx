import { defineComponent } from 'vue'
import MiLayoutHeader from './header'
import MiLayoutSider from './sider'

import { Layout } from 'ant-design-vue'

const MiLayout = defineComponent({
    name: 'MiLayout',
    setup() {
        const slots = {
            default: () => (
                <MiLayoutSider></MiLayoutSider>
            )
        }
        return () => (
            <Layout>
                { slots }
            </Layout>
        )
    }
})
MiLayout.Header = MiLayoutHeader
MiLayout.Sider = MiLayoutSider
export default MiLayout as typeof MiLayout & {
    readonly Header: typeof MiLayoutHeader
    readonly Sider: typeof MiLayoutSider
}
