import { defineComponent } from 'vue'
import { Layout } from 'ant-design-vue'
import MiLayoutSiderLogo from '../logo'

const MiLayoutSider = defineComponent({
    name: 'MiLayoutSider',
    render() {
        let slots = this.$slots.default
        if (!slots) {
            slots = () => (
                <MiLayoutSiderLogo></MiLayoutSiderLogo>
            )
        }
        return (
            <Layout.Sider class="mi-layout-sider" width="256" breakpoint="lg">
                { slots }
            </Layout.Sider>
        )
    }
})

MiLayoutSider.Logo = MiLayoutSiderLogo
export default MiLayoutSider as typeof MiLayoutSider & {
    readonly Logo: typeof MiLayoutSiderLogo
}