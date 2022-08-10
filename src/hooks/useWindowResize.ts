import { ref, onMounted, onUnmounted } from 'vue'
import { $tools } from '../utils/tools'

export function useWindowResize() {
    const width = ref(window.innerWidth)
    const height = ref(window.innerHeight)

    const handleWindowResize = () => {
        width.value = window.innerWidth
        height.value = window.innerHeight
    }

    onMounted(() => $tools.on(window, 'resize', handleWindowResize))

    onUnmounted(() => $tools.off(window, 'resize', handleWindowResize))

    return { width, height }
}
