import { defineComponent, Transition, KeepAlive, VNode, createVNode } from 'vue'
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
        animation: PropTypes.string.def('anim-view-slide')
    },
    setup(props) {
        const prefixCls = getPrefixCls('layout-content', props.prefixCls)
        const animation = getPrefixCls(props.animation)
        return () => (
            <Layout.Content class={prefixCls}>
                <div class={`${prefixCls}-custom`}>
                    <RouterView v-slots={{
                        default: ({Component}: MiRouterViewSlot) => {
                            return (
                                <Transition name={animation} mode="out-in">
                                    <div class={`${prefixCls}-custom-wrapper`}>
                                        <KeepAlive>{createVNode(Component)}</KeepAlive>
                                    </div>
                                </Transition>
                            )
                        }
                    }} />
                </div>
            </Layout.Content>
        )
    }
})
