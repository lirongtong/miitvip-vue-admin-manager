import { App } from 'vue'
import { createI18n } from 'vue-i18n'
import { $g } from '../utils/global'
import { $storage } from '../utils/storage'
import zhCN from './zh_CN'
import enUS from './en_US'

const DEFAULT_LANG = $g.locale
const LOCALE_KEY = $g.caches.storages.locale

const locales = {
    'zh-cn': zhCN,
    'en-us': enUS
}
const i18n = createI18n({
    legacy: false,
    locale: DEFAULT_LANG,
    fallbackLocale: DEFAULT_LANG,
    silentTranslationWarn: true,
    messages: locales,
    globalInjection: true,
    warnHtmlMessage: false
}) as any

const setLocale = async (locale?: string, message?: {}) => {
    if (locale === undefined) locale = $storage.get(LOCALE_KEY) || DEFAULT_LANG
    if (locales[locale as string]) {
        i18n.global.mergeLocaleMessage(locale, message || {})
    } else if (Object.keys(message || {}).length > 0) {
        i18n.global.setLocaleMessage(locale, message)
    } else locale = DEFAULT_LANG
    i18n.global.locale.value = locale
    $storage.set(LOCALE_KEY, locale)
}
setLocale($g.locale)

export default {
    install(app: App) {
        i18n.setLocale = setLocale
        app.use(i18n)
        app.config.globalProperties.$i18n = i18n
        app.provide('$i18n', i18n)
        return app
    }
}
