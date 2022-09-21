import { defineComponent, Transition, VNode, createVNode } from 'vue'
import { useRoute, RouteLocationNormalizedLoaded, RouterView } from 'vue-router'
import { Layout } from 'ant-design-vue'
import { getPrefixCls, getPropSlot } from '../_utils/props-tools'
import PropTypes from '../_utils/props-types'
import MiRouteHistory from '../history'
import MiLayoutFooter from './footer'

interface MiRouterViewSlot {
    Component: VNode
    route: RouteLocationNormalizedLoaded
}

export default defineComponent({
    name: 'MiLayoutContent',
    inheritAttrs: false,
    props: {
        prefixCls: PropTypes.string,
        animation: PropTypes.string.def('page-slide'),
        showRouteHistory: PropTypes.bool.def(true),
        footer: PropTypes.any
    },
    setup(props, { slots }) {
        const prefixCls = getPrefixCls('layout-content', props.prefixCls)
        const animation = getPrefixCls(`anim-${props.animation}`)
        const route = useRoute()
        return () => (
            <Layout.Content class={prefixCls}>
                {props.showRouteHistory ? <MiRouteHistory /> : null}
                <div class={`${prefixCls}-drop`}></div>
                <RouterView
                    v-slots={{
                        default: ({ Component }: MiRouterViewSlot) => {
                            return (
                                <Transition name={animation} appear={true}>
                                    <div class={`${prefixCls}-custom`} key={route.name as any}>
                                        {createVNode(Component)}
                                        {getPropSlot(slots, props, 'footer') ?? <MiLayoutFooter />}
                                    </div>
                                </Transition>
                            )
                        }
                    }}
                />
            </Layout.Content>
        )
    }
})
