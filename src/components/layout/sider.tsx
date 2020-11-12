import { defineComponent } from 'vue'
import { Layout } from 'ant-design-vue'
import PropTypes, { getSlotContent } from '../../utils/props'
import MiLayoutSiderLogo from '../logo'

const MiLayoutSider = defineComponent({
    name: 'MiLayoutSider',
    props: {logo: PropTypes.any},
    methods: {
        getLogoElem() {
            let logo = getSlotContent(this, 'logo')
            if (logo === undefined) logo = (<MiLayoutSiderLogo></MiLayoutSiderLogo>)
            return logo
        }
    },
    render() {
        const prefixCls = this.$tools.getPrefixCls('layout-sider')
        return (
            <Layout.Sider class={prefixCls} width="256" breakpoint="lg">
                { () => this.getLogoElem() }
            </Layout.Sider>
        )
    }
})

MiLayoutSider.Logo = MiLayoutSiderLogo
export default MiLayoutSider as typeof MiLayoutSider & {
    readonly Logo: typeof MiLayoutSiderLogo
}