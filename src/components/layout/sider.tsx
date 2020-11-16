import { defineComponent } from 'vue'
import { Layout } from 'ant-design-vue'
import PropTypes, { getSlotContent } from '../../utils/props'
import MiLayoutSiderLogo from '../logo'
import MiLayoutSiderMenu from '../menu'

const MiLayoutSider = defineComponent({
    name: 'MiLayoutSider',
    props: {
        logo: PropTypes.any,
        menu: PropTypes.any
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
        }
    },
    render() {
        const prefixCls = this.getPrefixCls()
        return (
            <Layout.Sider class={prefixCls} width="256" breakpoint="lg">
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