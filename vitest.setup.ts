import { createPinia } from 'pinia'
import { config } from '@vue/test-utils'
import '@testing-library/jest-dom/vitest'
import { createI18n } from 'vue-i18n'
import zh from './src/locales/zh-cn/index'
import en from './src/locales/en-us/index'

class MemoryStorage implements Storage {
    private store = new Map<string, string>()

    get length() {
        return this.store.size
    }

    clear(): void {
        this.store.clear()
    }

    getItem(key: string): string | null {
        return this.store.has(key) ? (this.store.get(key) as string) : null
    }

    key(index: number): string | null {
        return Array.from(this.store.keys())[index] ?? null
    }

    removeItem(key: string): void {
        this.store.delete(key)
    }

    setItem(key: string, value: string): void {
        this.store.set(key, String(value))
    }
}

const ensureStorage = (name: 'localStorage' | 'sessionStorage') => {
    // Node(v20+) 可能在 globalThis 上提供带 getter 的 WebStorage（读取会触发 `--localstorage-file` warning）。
    // 这里用 descriptor 读取，避免访问 getter。
    const desc = Object.getOwnPropertyDescriptor(globalThis, name)
    const s: any = desc && 'value' in desc ? (desc as any).value : undefined
    if (!s || typeof s.getItem !== 'function' || typeof s.setItem !== 'function') {
        ;(globalThis as any)[name] = new MemoryStorage()
    }
}

ensureStorage('localStorage')
ensureStorage('sessionStorage')

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
