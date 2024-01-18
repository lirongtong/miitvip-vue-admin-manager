import { defineComponent, Transition, createVNode } from 'vue'
import { LayoutContentProps } from './props'
import { getPrefixCls, getPropSlot } from '../_utils/props'
import { RouterViewSlot } from '../../utils/types'
import { useRoute, RouterView } from 'vue-router'
import MiHistoryMenu from '../history'
import MiLayoutFooter from './Footer'
import applyTheme from '../_utils/theme'
import styled from './style/content.module.less'

const MiLayoutContent = defineComponent({
    name: 'MiLayoutContent',
    inheritAttrs: false,
    props: LayoutContentProps(),
    setup(props, { slots }) {
        const route = useRoute()
        const animation = getPrefixCls(`anim-${props.animation}`)

        applyTheme(styled)

        return () => (
            <main class={styled.container}>
                {props.showHistoryMenu ? <MiHistoryMenu /> : null}
                <div class={`${styled.mask}`} />
                <RouterView
                    v-slots={{
                        default: ({ Component }: RouterViewSlot) => {
                            return (
                                <Transition name={animation} appear={true}>
                                    <div class={styled.custom} key={route.name}>
                                        {createVNode(Component)}
                                        {getPropSlot(slots, props, 'footer') ?? <MiLayoutFooter />}
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
