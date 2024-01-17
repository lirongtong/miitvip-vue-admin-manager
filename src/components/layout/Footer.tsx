import { computed, defineComponent } from 'vue'
import { getPropSlot } from '../_utils/props'
import { $g } from '../../utils/global'
import { useWindowResize } from '../../hooks/useWindowResize'
import applyTheme from '../_utils/theme'
import styled from './style/footer.module.less'

export default defineComponent({
    name: 'MiLayoutFooter',
    inheritAttrs: false,
    setup(props, { slots }) {
        const { width } = useWindowResize()
        const copyright = computed(() => {
            return width.value < $g.breakpoints.md ? $g.copyright.mobile : $g.copyright.desktop
        })

        applyTheme(styled)

        return () => (
            <footer class={styled.container}>
                {getPropSlot(slots, props) ?? (
                    <div class={styled.content} innerHTML={copyright.value}></div>
                )}
            </footer>
        )
    }
})
