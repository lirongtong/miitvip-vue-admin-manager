import { defineComponent } from 'vue'
import { Layout } from 'ant-design-vue'
import { useStore } from 'vuex'
import PropTypes, { getSlotContent } from '../../utils/props'
import { mutations } from '../../store/types'
import MiLayoutSiderLogo from '../logo'
import MiLayoutSiderMenu from '../menu'

const MiLayoutSider = defineComponent({
    name: 'MiLayoutSider',
    props: {
        logo: PropTypes.any,
        menu: PropTypes.any
    },
    setup() {
        const store = useStore()
        return { store }
    },
    methods: {
        getPrefixCls() {
            return this.$tools.getPrefixCls('layout-sider')
        },
        getLogoElem() {
            let logo = getSlotContent(this, 'logo')
            if (logo === undefined) logo = (<MiLayoutSiderLogo></MiLayoutSiderLogo>)
            return logo
        },
        getMenuElem() {
            let menu = getSlotContent(this, 'menu')
            if (menu === undefined) {
                const prefixCls = this.getPrefixCls()
                menu = (<MiLayoutSiderMenu className={`${prefixCls}-menu`}></MiLayoutSiderMenu>)
            }
            return menu
        },
        setCollapsed(collapse: boolean) {
            this.$g.menus.collapsed = collapse
            this.store.commit(`layout/${mutations.layout.collapsed}`, collapse)
        }
    },
    render() {
        const prefixCls = this.getPrefixCls()
        return (
            <Layout.Sider
                class={prefixCls}
                width="256"
                breakpoint="lg"
                collapsed={this.$g.menus.collapsed}
                onCollapse={this.setCollapsed}
                trigger={null}
                collapsible={true}>
                { () => (
                    <>
                        { this.getLogoElem() }
                        { this.getMenuElem() }
                    </>
                ) }
            </Layout.Sider>
        )
    }
})

MiLayoutSider.Logo = MiLayoutSiderLogo
export default MiLayoutSider as typeof MiLayoutSider & {
    readonly Logo: typeof MiLayoutSiderLogo
}