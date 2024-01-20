import { defineComponent } from 'vue'
import { useThemeStore } from '../../stores/theme'
import { ThemeProps } from './props'
import { $g } from '../../utils/global'
import { $tools } from '../../utils/tools'
import styled from './style/theme.module.less'

const MiTheme = defineComponent({
    name: 'MiTheme',
    inheritAttrs: false,
    props: ThemeProps(),
    setup(props, { slots }) {
        const moduleThemeVars = $tools.getThemeModuleProperties(styled)
        const globalThemeVars: Record<string, any> = Object.assign({}, moduleThemeVars, props.theme)
        $g.theme.type = globalThemeVars?.theme || styled?.theme
        $g.theme.primary = globalThemeVars?.primary || styled?.primary
        $g.theme.radius = parseInt(globalThemeVars?.radius || styled?.radius)
        $tools.createThemeProperties($g.theme.primary)
        const store = useThemeStore()
        store.$patch({ properties: { ...globalThemeVars } })
        return () => slots?.default()
    }
})

export default MiTheme
