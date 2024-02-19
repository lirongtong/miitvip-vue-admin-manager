import { onMounted, onUnmounted } from 'vue'
import { $tools } from '../../utils/tools'
import { useThemeStore } from '../../stores/theme'

export default function (moduleStyled: any, destroy = false) {
    onMounted(() => {
        const properties = useThemeStore()?.$state?.properties || {}
        $tools.applyThemeModuleProperties(
            moduleStyled,
            $tools.assignThemeModuleProperties(moduleStyled, properties)
        )
    })

    onUnmounted(() => {
        if (destroy) $tools.destroyThemeModuleProperties(moduleStyled)
    })
}
