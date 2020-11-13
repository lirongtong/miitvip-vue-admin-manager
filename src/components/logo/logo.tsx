import { defineComponent } from 'vue'
import { RouterLink } from 'vue-router'
import { MediumOutlined } from '@ant-design/icons-vue'
import { getSlot } from '../../utils/props'

export default defineComponent({
    name: 'MiLayoutSiderLogo',
    created() {
        if (!this.$route) {
            this.$tools.importError('vue-router')
        }
    },
    render() {
        const title = this.$g.title ?? '麦可易特网'
        const prefixCls = this.$tools.getPrefixCls('layout-sider-logo')
        let logo = (<MediumOutlined></MediumOutlined>)
        if (this.$g.logo) logo = (
            <img src={this.$g.logo} alt={this.$g.title} />
        )
        let defaultSlot = this.$slots.default
        if (!defaultSlot) {
            defaultSlot = () => (
                <RouterLink to={{path: '/'}} class={`${prefixCls}-site`}>
                    { () => (
                        <>
                            { logo }
                            <h1 innerHTML={title}></h1>
                        </>
                    ) }
                </RouterLink>
            )
        }
        return (
            <div class={prefixCls}>
                { defaultSlot() }
            </div>
        )
    }
})