import { defineComponent, Transition, createVNode, ref, computed, type SlotsType } from 'vue'
import { LayoutContentProps } from './props'
import { getPrefixCls, getPropSlot } from '../_utils/props'
import { RouterViewSlot } from '../../utils/types'
import { useRoute, RouterView } from 'vue-router'
import { useLayoutStore } from '../../stores/layout'
import MiBacktop from '../backtop/Backtop'
import MiAnchor from '../anchor/Anchor'
import applyTheme from '../_utils/theme'
import styled from './style/content.module.less'

const MiLayoutContent = defineComponent({
    name: 'MiLayoutContent',
    inheritAttrs: false,
    props: LayoutContentProps(),
    slots: Object as SlotsType<{
        default: any
        content: any
    }>,
    setup(props, { slots }) {
        const route = useRoute()
        const store = useLayoutStore()
        const collapsed = computed(() => store.collapsed)
        const animation = getPrefixCls(`anim-${props.animation}`)
        const container = ref(null)
        const listenerContainer = computed(() => container.value)

        applyTheme(styled)

        return () => (
            <main class={`${styled.container}${collapsed.value ? ` ${styled.collapsed}` : ''}`}>
                <div ref={container} class={styled.inner} key={route.name}>
                    {getPropSlot(slots, props, 'content') ?? (
                        <RouterView
                            v-slots={{
                                default: ({ Component }: RouterViewSlot) => {
                                    return Component ? (
                                        <Transition name={animation} appear={true}>
                                            <div class={styled.box}>
                                                {createVNode(Component)}
                                                {props.showBacktop ? (
                                                    <MiBacktop
                                                        listenerContainer={listenerContainer.value}
                                                        {...props.backtopSetting}
                                                    />
                                                ) : null}
                                                {props.showAnchor ? (
                                                    <MiAnchor
                                                        listenerContainer={listenerContainer.value}
                                                        {...props.anchorSetting}
                                                    />
                                                ) : null}
                                            </div>
                                        </Transition>
                                    ) : null
                                }
                            }}
                        />
                    )}
                </div>
            </main>
        )
    }
})

export default MiLayoutContent
