import { defineComponent, Transition, createVNode } from 'vue'
import { LayoutContentProps } from './props'
import { getPrefixCls } from '../_utils/props'
import { RouterViewSlot } from '../../utils/types'
import { useRoute, RouterView } from 'vue-router'
import applyTheme from '../_utils/theme'
import styled from './style/content.module.less'

const MiLayoutContent = defineComponent({
    name: 'MiLayoutContent',
    inheritAttrs: false,
    props: LayoutContentProps(),
    setup(props) {
        const route = useRoute()
        const animation = getPrefixCls(`anim-${props.animation}`)

        applyTheme(styled)

        return () => (
            <main class={styled.container}>
                <RouterView
                    v-slots={{
                        default: ({ Component }: RouterViewSlot) => {
                            return (
                                <Transition name={animation} appear={true}>
                                    <div class={styled.inner} key={route.name}>
                                        {createVNode(Component)}
                                    </div>
                                </Transition>
                            )
                        }
                    }}
                />
            </main>
        )
    }
})

export default MiLayoutContent
