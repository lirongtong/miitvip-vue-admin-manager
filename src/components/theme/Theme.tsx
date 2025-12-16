import { defineComponent, inject, nextTick, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useThemeStore } from '../../stores/theme'
import { ThemeProps } from './props'
import { useI18n } from 'vue-i18n'
import { api } from '../../utils/api'
import { $g } from '../../utils/global'
import { $tools } from '../../utils/tools'
import { $storage } from '../../utils/storage'
import { $request } from '../../utils/request'
import { $cookie } from '../../utils/cookie'
import type { ResponseData } from '../../utils/types'
import { useAuthStore } from '../../stores/auth'
import axios from 'axios'
import { message } from 'ant-design-vue'
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

        // interceptors
        let regranting = false
        axios.interceptors.response.use(
            (response) => {
                return response
            },
            async (err: any) => {
                const config = err?.config || {}

                const resend = () => {
                    const method = (config?.method || 'get').toLowerCase()
                    return $request?.[method](
                        config.url,
                        method === 'get' ? config?.params || {} : config?.data || {},
                        {
                            retry: config.retry,
                            retryCount: config.retryCount
                        }
                    )
                }

                // 未授权 ( unauthorized ).
                if (err?.response?.status === 401) {
                    if (!regranting) {
                        regranting = true
                        const token = $cookie.get($g.caches.cookies?.token?.refresh)
                        const useAuth = useAuthStore()

                        const failed = (error?: any) => {
                            regranting = false
                            message.destroy()
                            message.error(error?.message || error || t('global.error.auth'))
                            useAuth.logout()
                            router.push({ path: '/login', query: { redirect: route.path } })
                            return Promise.reject(error || err)
                        }

                        if (!$tools.isEmpty(token) && api?.oauth?.refresh) {
                            try {
                                const res: ResponseData | any = await useAuth.refresh(
                                    api?.oauth?.refresh,
                                    token
                                )
                                regranting = false
                                if (res?.ret?.code === 200) return resend()
                                return failed()
                            } catch (error: any) {
                                return failed(error)
                            }
                        }

                        return failed()
                    }

                    // 已在其他请求中进行 regranting，这里直接抛出原错误
                    return Promise.reject(err?.response || err)
                }

                // 其他错误：根据 retry 配置进行重试
                if (!config?.retry) return Promise.reject(err?.response || err)
                if (config?.retryCount >= config.retry) {
                    return Promise.reject(err?.response || err)
                }
                config.retryCount += 1
                return resend()
            }
        )

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
