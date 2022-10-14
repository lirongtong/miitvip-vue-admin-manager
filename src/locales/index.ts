import { App } from 'vue'
import { createI18n } from 'vue-i18n'
import { $g } from '../utils/global'
import { api } from '../utils/api'
import { $storage } from '../utils/storage'
import { $request } from '../utils/request'
import { $cookie } from '../utils/cookie'
import { message } from 'ant-design-vue'
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
    messages: locales
}) as any

const getLanguage = async () => {
    if (api.languages.data) {
        const token = $cookie.get($g.caches.cookies.token.access)
        return await $request
            .get(
                api.languages.data,
                { type: 'all' },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            )
            .then((res: any) => {
                if (res) {
                    if (res?.ret?.code === 200) {
                        return res?.data
                    } else message.error(res?.ret?.message)
                }
            })
            .catch((err: any) => {
                message.error(err.message)
            })
    }
}

const setLocale = async (locale?: string, message?: {}) => {
    if (locale === undefined) locale = $storage.get(LOCALE_KEY) || DEFAULT_LANG
    const languages = (await getLanguage()) || []
    const customize = message || {}
    for (let i = 0, l = languages.length; i < l; i++) {
        const language = languages[i]
        customize[language.key] = language.language
    }
    if (locales[locale as string]) {
        i18n.global.mergeLocaleMessage(locale, customize || {})
    } else if (Object.keys(customize || {}).length > 0) {
        i18n.global.setLocaleMessage(locale, customize)
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
