import { Transition, defineComponent } from 'vue'
import { BreadcrumbProps } from './props'
import { getPrefixCls } from '../_utils/props'
import applyTheme from '../_utils/theme'
import styled from './style/breadcrumb.module.less'

const MiBreadcrumb = defineComponent({
    name: 'MiBreadcrumb',
    inheritAttrs: false,
    props: BreadcrumbProps(),
    setup(props) {
        applyTheme(styled)
        return () => (
            <Transition name={getPrefixCls(`anim-${props.animation}`)} appear={true}>
                <div class={styled.container}></div>
            </Transition>
        )
    }
})

export default MiBreadcrumb
