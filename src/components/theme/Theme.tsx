import { defineComponent } from 'vue'
import { useThemeStore } from '../../stores/theme'
import { ThemeProps } from './props'
import { $tools } from '../../utils/tools'
import styled from './style/theme.module.less'

export default defineComponent({
    name: 'MiTheme',
    inheritAttrs: false,
    props: ThemeProps(),
    setup(props, { slots }) {
        const moduleThemeVars = $tools.getThemeModuleProperties(styled)
        const globalThemeVars: Record<string, any> = Object.assign({}, moduleThemeVars, props.theme)
        $tools.createThemeProperties(
            globalThemeVars?.theme || styled?.['--theme'] || styled?.['--primary'] || '#f0c26f'
        )
        const store = useThemeStore()
        store.$patch({ properties: { ...globalThemeVars } })
        return () => slots?.default()
    }
})
