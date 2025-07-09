import { ref, onMounted, onUnmounted } from 'vue'
import { $tools } from '../utils/tools'
import { $g } from '../utils/global'

export function useWindowResize() {
    const defaultWidth = typeof window !== 'undefined' ? window.innerWidth : 1920
    const defaultHeight = typeof window !== 'undefined' ? window.innerHeight : 945
    const width = ref<number>(defaultWidth)
    const height = ref<number>(defaultHeight)

    const handleWindowResize = () => {
        width.value = window.innerWidth
        height.value = window.innerHeight
        $g.winSize.width = width.value
        $g.winSize.height = height.value
    }

    onMounted(() => $tools.on(window, 'resize', handleWindowResize))

    onUnmounted(() => $tools.off(window, 'resize', handleWindowResize))

    return { width, height }
}

export default useWindowResize
