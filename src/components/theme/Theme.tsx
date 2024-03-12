import { defineComponent, watch } from 'vue'
import { useThemeStore } from '../../stores/theme'
import { ThemeProps } from './props'
import { useI18n } from 'vue-i18n'
import { $g } from '../../utils/global'
import { $tools } from '../../utils/tools'
import { $storage } from '../../utils/storage'
import styled from './style/theme.module.less'

const MiTheme = defineComponent({
    name: 'MiTheme',
    inheritAttrs: false,
    props: ThemeProps(),
    setup(props, { slots }) {
        const { t, te } = useI18n()
        $tools.setTitle(te('global.meta.title') ? t('global.meta.title') : null)
        $tools.setKeywords(
            te('global.meta.keywords') ? t('global.meta.keywords') : $g.keywords,
            true
        )
        $tools.setDescription(
            te('global.meta.description') ? t('global.meta.description') : $g.description,
            true
        )
        const primaryColor = $storage.get($g.caches.storages.theme.hex)
        const themeType = $storage.get($g.caches.storages.theme.type)
        const moduleThemeVars = $tools.getThemeModuleProperties(styled)
        const globalThemeVars: Record<string, any> = Object.assign({}, moduleThemeVars, props.theme)
        $g.theme.type = themeType || globalThemeVars?.theme || styled?.theme
        $g.theme.primary = primaryColor || globalThemeVars?.primary || styled?.primary
        $g.theme.radius = parseInt($g?.theme?.radius || globalThemeVars?.radius || styled?.radius)
        $tools.createThemeProperties($g.theme.primary)
        const store = useThemeStore()
        store.$patch({ properties: { ...globalThemeVars } })

        watch(
            () => [$g?.theme?.type, $g?.theme?.primary],
            () => store.updateProperties($g.theme.primary),
            { immediate: false, deep: true }
        )

        return () => slots?.default()
    }
})

export default MiTheme
