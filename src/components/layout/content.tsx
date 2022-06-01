import { defineComponent, Transition, KeepAlive, VNode, createVNode } from 'vue'
import { useRoute } from 'vue-router'
import { Layout } from 'ant-design-vue'
import { RouteLocationNormalizedLoaded, RouterView } from 'vue-router'
import { getPrefixCls } from '../_utils/props-tools'
import PropTypes from '../_utils/props-types'

interface MiRouterViewSlot {
    Component: VNode,
    route: RouteLocationNormalizedLoaded
}

export default defineComponent({
    name: 'MiLayoutContent',
    inheritAttrs: false,
    props: {
        prefixCls: String,
        animation: PropTypes.string.def('page-slide')
    },
    setup(props) {
        const prefixCls = getPrefixCls('layout-content', props.prefixCls)
        const animation = getPrefixCls(`anim-${props.animation}`)
        const route = useRoute()
        return () => (
            <Layout.Content class={prefixCls}>
                <RouterView v-slots={{
                    default: ({Component}: MiRouterViewSlot) => {
                        return (
                            <Transition name={animation} appear={true}>
                                <div class={`${prefixCls}-custom`} key={route.name}>
                                    <KeepAlive>{createVNode(Component)}</KeepAlive>
                                </div>
                            </Transition>
                        )
                    }
                }} />
            </Layout.Content>
        )
    }
})
