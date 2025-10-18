import type { App } from 'vue'
import { type I18n, createI18n, type VueI18n } from 'vue-i18n'
import { $g } from '../utils/global'
import { $storage } from '../utils/storage'
import zhCN from './zh-cn'
import enUS from './en-us'

const DEFAULT_LANG = $g?.locale || 'zh-cn'
const LOCALE_KEY = $g.caches.storages.locale || 'language-locale'

const locales = {
    'zh-cn': zhCN,
    'en-us': enUS
}

const i18nIns = createI18n({
    legacy: false,
    locale: DEFAULT_LANG,
    fallbackLocale: DEFAULT_LANG,
    silentTranslationWarn: true,
    messages: locales,
    globalInjection: true,
    warnHtmlMessage: false
}) as I18n & VueI18n & Record<string, any>

const setLocale = async (locale?: string, message?: {}) => {
    if (!locale)
        locale =
            typeof window !== 'undefined' ? $storage.get(LOCALE_KEY) || DEFAULT_LANG : DEFAULT_LANG
    if (locales[locale]) {
        i18nIns.global.mergeLocaleMessage(locale, message || {})
    } else if (Object.keys(message || {}).length > 0) {
        i18nIns.global.setLocaleMessage(locale, message)
    } else locale = DEFAULT_LANG
    ;(i18nIns.global.locale as any).value = locale
    $storage.set(LOCALE_KEY, locale)
}
i18nIns.setLocale = setLocale

let _i18n: any = null
export const setupI18n = (options: { i18n?: any } = {}) => {
    _i18n = options.i18n || null
}

export default {
    install(app: App) {
        if (_i18n) {
            Object.entries(locales).forEach(([locale, msg]) => {
                _i18n.global.mergeLocaleMessage(locale, msg)
            })
        } else {
            app.use(i18nIns)
            app.config.globalProperties.$i18n = i18nIns
            app.provide('setLocale', (lang: string, message?: {}) => setLocale(lang, message))
            return app
        }
    }
}
