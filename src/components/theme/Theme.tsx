import { defineComponent } from 'vue'
import { useThemeStore } from '../../stores/theme'
import { ThemeProps } from './props'
import { $g } from '../../utils/global'
import { $tools } from '../../utils/tools'
import styled from './style/theme.module.less'

export default defineComponent({
    name: 'MiTheme',
    inheritAttrs: false,
    props: ThemeProps(),
    setup(props, { slots }) {
        const moduleThemeVars = $tools.getThemeModuleProperties(styled)
        const globalThemeVars: Record<string, any> = Object.assign({}, moduleThemeVars, props.theme)
        $g.primaryColor =
            globalThemeVars?.theme || globalThemeVars?.primary || styled?.theme || '#F0C26F'
        $g.radius = globalThemeVars?.radius || styled?.radius || 4
        $tools.createThemeProperties($g.primaryColor)
        const store = useThemeStore()
        store.$patch({ properties: { ...globalThemeVars } })
        return () => slots?.default()
    }
})
