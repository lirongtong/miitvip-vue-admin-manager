import { App } from 'vue'
import { createI18n } from 'vue-i18n/index'
import { $g } from '../utils/global'
import { $storage } from '../utils/storage'
import cn from './cn.json'
import en from './en.json'

const DEFAULT_LANG = $g.locale
const LOCALE_KEY = $g.caches.storages.locale

const i18n = createI18n({
    legacy: false,
    locale: DEFAULT_LANG,
    fallbackLocale: DEFAULT_LANG,
    globalInjection: true,
    messages: {
        cn: { ...cn },
        en: { ...en }
    }
})

const setLocale = (locale?: string, message?: {}) => {
    if (locale === undefined) locale = $storage.get(LOCALE_KEY) || DEFAULT_LANG
    $storage.set(LOCALE_KEY, locale)
    i18n.global.locale.value = locale
    i18n.global.messages[locale] = Object.assign({}, i18n.global.messages[locale], message)
}
setLocale()

export default {
    install(app: App) {
        i18n.setLocale = setLocale
        app.use(i18n)
        app.config.globalProperties.$i18n = i18n
        app.provide('$i18n', i18n)
        return app
    }
}
