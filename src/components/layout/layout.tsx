import { defineComponent } from 'vue'
import { useStore } from 'vuex'
import { Layout, BackTop } from 'ant-design-vue'
import PropTypes, { getSlotContent } from '../../utils/props'
import { mutations } from '../../store/types'
import MiLayoutHeader from './header'
import MiLayoutSider from './sider'
import MiLayoutContent from './content'
import MiLayoutFooter from './footer'
import MiMenuDrawer from '../menu/drawer'

const MiLayout = defineComponent({
    name: 'MiLayout',
    props: {
        embed: PropTypes.bool,
        siderClassName: PropTypes.string,
        menuClassName: PropTypes.string,
        sider: PropTypes.any,
        header: PropTypes.any,
        footer: PropTypes.any
    },
    computed: {
        hasSider() {
            return this.$g.mobile ? false : true
        },
        layoutClass() {
            let layoutClass = this.$tools.getPrefixCls('layout')
            layoutClass += this.$g.embed ? ` ${layoutClass}-embed`: ''
            layoutClass += this.$g.mobile ? ` ${layoutClass}-mobile` : ''
            return layoutClass
        }
    },
    setup() {
        const store = useStore()
        return { store }
    },
    created() {
        if (this.$g.mobile) {
            this.$g.menus.collapsed = false
            this.store.commit(`layout/${mutations.layout.collapsed}`, false)
        }
    },
    methods: {
        getSiderElem() {
            let sider = getSlotContent(this, 'sider')
            if (sider === undefined) sider = <MiLayoutSider></MiLayoutSider>
            if (this.$g.mobile || this.embed) sider = null
            return sider
        },
        getHeaderElem() {
            let header = getSlotContent(this, 'header')
            if (header === undefined) header = <MiLayoutHeader></MiLayoutHeader>
            if (this.embed) header = null
            return header
        },
        getFooterElem() {
            let footer = getSlotContent(this, 'footer')
            if (footer === undefined) footer = <MiLayoutFooter></MiLayoutFooter>
            return footer
        },
        getLayoutElem() {
            const prefixCls = this.$tools.getPrefixCls('layout')
            return (
                <>
                    { this.getSiderElem() }
                    <Layout class={`${prefixCls}-container`} hasSider={false}>
                        { this.getHeaderElem() }
                        <MiLayoutContent></MiLayoutContent>
                        { this.getFooterElem() }
                    </Layout>
                </>
            )
        }
    },
    render() {
        const drawer = this.$g.mobile ? <MiMenuDrawer></MiMenuDrawer> : null
        return (
            <>
                <Layout hasSider={this.hasSider} class={this.layoutClass}>
                    { this.getLayoutElem() }
                    { this.$g.backToTop ? <BackTop target={() => document.body}></BackTop> : null }
                </Layout>
                { drawer }
            </>
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
