import { computed, defineComponent } from 'vue'
import { getPropSlot } from '../_utils/props'
import { $g } from '../../utils/global'
import { useWindowResize } from '../../hooks/useWindowResize'
import { useLayoutStore } from '../../stores/layout'
import applyTheme from '../_utils/theme'
import styled from './style/footer.module.less'

const MiLayoutFooter = defineComponent({
    name: 'MiLayoutFooter',
    inheritAttrs: false,
    setup(props, { slots }) {
        const { width } = useWindowResize()
        const store = useLayoutStore()
        const collapsed = computed(() => store.collapsed)
        const copyright = computed(() => {
            return width.value < $g.breakpoints.md ? $g.copyright.mobile : $g.copyright.laptop
        })

        applyTheme(styled)

        return () => (
            <footer class={`${styled.container}${collapsed.value ? ` ${styled.collapsed}` : ''}`}>
                {getPropSlot(slots, props) ?? (
                    <div class={styled.content} innerHTML={copyright.value}></div>
                )}
            </footer>
        )
    }
})

export default MiLayoutFooter
