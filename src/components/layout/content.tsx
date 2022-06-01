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
        animName: PropTypes.string.def('anim-slide')
    },
    setup(props) {
        const prefixCls = getPrefixCls('layout-content', props.prefixCls)
        const animation = getPrefixCls(props.animName)
        return () => (
            <Layout.Content class={prefixCls}>
                <div class={`${prefixCls}-custom`}>
                    <RouterView v-slots={{
                        default: ({Component}: MiRouterViewSlot) => {
                            return () => (
                                <>
                                    <Transition name={animation}>
                                        <KeepAlive>
                                            {createVNode(Component)}
                                        </KeepAlive>
                                    </Transition>
                                </>
                            )
                        }
                    }} />
                </div>
            </Layout.Content>
        )
    }
})
