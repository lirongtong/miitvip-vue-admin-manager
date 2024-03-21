import { defineComponent, Transition, createVNode, ref, computed } from 'vue'
import { LayoutContentProps } from './props'
import { getPrefixCls } from '../_utils/props'
import { RouterViewSlot } from '../../utils/types'
import { useRoute, RouterView } from 'vue-router'
import MiBacktop from '../backtop/Backtop'
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
                <RouterView
                    v-slots={{
                        default: ({ Component }: RouterViewSlot) => {
                            return (
                                <Transition name={animation} appear={true}>
                                    <div ref={container} class={styled.inner} key={route.name}>
                                        {createVNode(Component)}
                                    </div>
                                </Transition>
                            )
                        }
                    }}
                />
                <MiBacktop listenerContainer={backtopContainer.value} {...props.backtopSetting} />
            </main>
        )
    }
})

export default MiLayoutContent
