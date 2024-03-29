import { ref, onMounted, onUnmounted } from 'vue'
import { $tools } from '../utils/tools'
import { $g } from '../utils/global'

export function useWindowResize() {
    const width = ref<number>(window.innerWidth)
    const height = ref<number>(window.innerHeight)

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
