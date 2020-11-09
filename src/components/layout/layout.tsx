import { defineComponent } from 'vue'
import { Layout } from 'ant-design-vue'
import MiLayoutHeader from './header'
import MiLayoutSider from './sider'
import MiLayoutContent from './content'
import MiLayoutFooter from './footer'

const MiLayout = defineComponent({
    name: 'MiLayout',
    props: {
        embed: {
            type: Boolean,
            default: undefined
        },
        siderClassName: {
            type: String,
            default: undefined
        },
        menuClassName: {
            type: String,
            default: undefined
        }
    },
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
        // let slots = this.$slots.default
        // if (!slots) {
        //     slots = () => (
        //         <>
        //             { this.$g.mobile ? null : <MiLayoutSider></MiLayoutSider> }
        //             <Layout class="mi-layout-container">
        //                 <MiLayoutHeader></MiLayoutHeader>
        //                 <MiLayoutContent></MiLayoutContent>
        //                 <MiLayoutFooter></MiLayoutFooter>
        //             </Layout>
        //         </>
        //     )
        // }

        let slots = this.$slots.default
        if (!slots) {
            slots = () => [(
                <>
                    { this.$g.mobile ? null : <MiLayoutSider></MiLayoutSider> }
                    <Layout class="mi-layout-container">
                        { () => <MiLayoutHeader></MiLayoutHeader> }
                    </Layout>
                </>
            )]
        }
        return (
            <Layout hasSider={this.hasSider} class={this.layoutClass}>
                { ...slots }
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
