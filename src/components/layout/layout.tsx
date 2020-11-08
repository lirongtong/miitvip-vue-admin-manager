import { defineComponent } from 'vue'
import MiLayoutHeader from './header'
import MiLayoutSider from './sider'
import MiLayoutContent from './content'
import MiLayoutFooter from './footer'

import { Layout } from 'ant-design-vue'

const MiLayout = defineComponent({
    name: 'MiLayout',
    computed: {
        hasSider() {
            return this.$g.mobile ? false : true
        },
        layoutClass() {
            let layoutClass = 'mi-layout '
            layoutClass += this.$g.embed ? `mi-layout-embed `: ''
            layoutClass += this.$g.mobile ? `mi-layout-mobile ` : ''
            return layoutClass
        }
    },
    render() {
        const layoutSider = (this.$g.mobile ? null : <MiLayoutSider></MiLayoutSider>)
        let slots = this.$slots.default
        if (!slots) {
            slots = () => (
                <>
                    { layoutSider }
                    <Layout class="mi-layout-container">
                        <MiLayoutHeader></MiLayoutHeader>
                        <MiLayoutContent></MiLayoutContent>
                        <MiLayoutFooter></MiLayoutFooter>
                    </Layout>
                </>
            )
        }
        return (
            <Layout hasSider={this.hasSider} class={this.layoutClass}>
                { slots }
            </Layout>
        )
    }
})
MiLayout.Header = MiLayoutHeader
MiLayout.Sider = MiLayoutSider
MiLayout.Sider.Logo = MiLayoutSider.Logo
MiLayout.Content = MiLayoutContent
MiLayout.Footer = MiLayoutFooter
export default MiLayout as typeof MiLayout & {
    readonly Sider: typeof MiLayoutSider
    readonly Header: typeof MiLayoutHeader
    readonly Content: typeof MiLayoutContent
    readonly Footer: typeof MiLayoutFooter
}
