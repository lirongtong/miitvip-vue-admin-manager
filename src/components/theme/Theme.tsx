import { defineComponent, inject, nextTick, watch } from 'vue'
import { useThemeStore } from '../../stores/theme'
import { ThemeProps } from './props'
import { useI18n } from 'vue-i18n'
import { $g } from '../../utils/global'
import { $tools } from '../../utils/tools'
import { $storage } from '../../utils/storage'
import { useRoute, useRouter } from 'vue-router'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import MiThemeProvider from './Provider'
import styled from './style/theme.module.less'

const MiTheme = defineComponent({
    name: 'MiTheme',
    inheritAttrs: false,
    props: ThemeProps(),
    setup(props, { slots }) {
        const { t } = useI18n()
        const route = useRoute()
        const router = useRouter()
        const setLocale = inject('setLocale') as any

        // meta
        const title = t('global.meta.title')
        if (!$tools.isEmpty(title)) $tools.setTitle(title)
        $tools.setKeywords($g?.keywords || t('global.meta.keywords'), true)
        $tools.setDescription($g.description || t('global.meta.description'), true)

        // theme tokens
        const primaryColor = $storage.get($g.caches.storages.theme.hex)
        const themeType = $storage.get($g.caches.storages.theme.type)
        const moduleThemeVars = $tools.getThemeModuleProperties(styled)
        const globalThemeVars: Record<string, any> = Object.assign({}, moduleThemeVars, props.theme)
        $g.theme.type = props.theme?.type || themeType || globalThemeVars?.theme || styled?.theme
        $g.theme.primary =
            props.theme?.primary || primaryColor || globalThemeVars?.primary || styled?.primary
        $g.theme.radius = parseInt($g?.theme?.radius || globalThemeVars?.radius || styled?.radius)
        $tools.createThemeProperties($g.theme.primary)
        const store = useThemeStore()
        store.$patch({ properties: { ...globalThemeVars } })

        // default language
        $g.locale = $tools.getLanguage()
        setLocale($g.locale)

        // nprogress
        NProgress.configure({
            easing: 'ease',
            speed: 1000,
            showSpinner: false,
            trickleSpeed: 200
        })

        // listener router
        router.beforeEach((_to, _from, next) => {
            NProgress.start()
            next()
        })
        router.afterEach(() => {
            if (route?.meta?.title) $tools.setTitle(route?.meta?.title as string)
            if (route?.meta?.keywords) $tools.setKeywords(route?.meta?.keywords as string)
            if (route?.meta?.description) $tools.setDescription(route?.meta?.description as string)
            nextTick().then(() => {
                NProgress.done(true)
                NProgress.remove()
            })
        })

        watch(
            () => [$g?.theme?.type, $g?.theme?.primary],
            () => store.updateProperties($g.theme.primary),
            { immediate: false, deep: true }
        )

        return () => slots?.default()
    }
})

MiTheme.Provider = MiThemeProvider
export default MiTheme as typeof MiTheme & {
    readonly Provider: typeof MiThemeProvider
}
