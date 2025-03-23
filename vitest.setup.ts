import { createPinia } from 'pinia'
import { config } from '@vue/test-utils'
import '@testing-library/jest-dom/vitest'
import { createI18n } from 'vue-i18n'
import zh from './src/locales/zh-cn/index'
import en from './src/locales/en-us/index'

const pinia = createPinia()
const i18n = createI18n({
    legacy: false,
    locale: 'zh-cn',
    fallbackLocale: 'zh-cn',
    silentTranslationWarn: true,
    messages: { zh, en },
    globalInjection: true,
    warnHtmlMessage: false
})

config.global.stubs = { Transition: false }
config.global.plugins = [pinia, i18n]

export const setTestLocale = (locale: 'zh' | 'en') => {
    i18n.global.locale.value = locale
}
