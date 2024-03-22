import { defineComponent, Transition, createVNode, ref, computed } from 'vue'
import { LayoutContentProps } from './props'
import { getPrefixCls } from '../_utils/props'
import { RouterViewSlot } from '../../utils/types'
import { useRoute, RouterView } from 'vue-router'
import MiBacktop from '../backtop/Backtop'
import MiAnchor from '../anchor/Anchor'
import applyTheme from '../_utils/theme'
import styled from './style/content.module.less'

const MiLayoutContent = defineComponent({
    name: 'MiLayoutContent',
    inheritAttrs: false,
    props: LayoutContentProps(),
    setup(props) {
        const route = useRoute()
        const animation = getPrefixCls(`anim-${props.animation}`)
        const container = ref(null)
        const backtopContainer = computed(() => {
            return container.value
        })

        applyTheme(styled)

        return () => (
            <main class={styled.container}>
                <div ref={container} class={styled.inner} key={route.name}>
                    <RouterView
                        v-slots={{
                            default: ({ Component }: RouterViewSlot) => {
                                return (
                                    <Transition name={animation} appear={true}>
                                        <div class={styled.box}>
                                            {createVNode(Component)}
                                            {props.showBacktop ? (
                                                <MiBacktop
                                                    listenerContainer={backtopContainer.value}
                                                    {...props.backtopSetting}
                                                />
                                            ) : null}
                                            {props.showAnchor ? (
                                                <MiAnchor
                                                    listenerContainer={backtopContainer.value}
                                                    {...props.backtopSetting}
                                                />
                                            ) : null}
                                        </div>
                                    </Transition>
                                )
                            }
                        }}
                    />
                </div>
            </main>
        )
    }
})

export default MiLayoutContent
