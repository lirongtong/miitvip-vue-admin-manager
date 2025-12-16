import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { nextTick } from 'vue'

import MiTheme from '../Theme'
import { useThemeStore } from '../../../stores/theme'
import { $g } from '../../../utils/global'

vi.mock('vue-router', () => {
    const beforeEach = vi.fn()
    const afterEach = vi.fn()
    return {
        useRoute: () => ({
            path: '/test',
            meta: {}
        }),
        useRouter: () => ({
            beforeEach,
            afterEach,
            push: vi.fn()
        })
    }
})

vi.mock('ant-design-vue', () => ({
    message: {
        destroy: vi.fn(),
        error: vi.fn()
    }
}))

vi.mock('nprogress', () => ({
    default: {
        configure: vi.fn(),
        start: vi.fn(),
        done: vi.fn(),
        remove: vi.fn()
    }
}))

// 避免真正请求
vi.mock('axios', () => ({
    default: {
        interceptors: {
            response: {
                use: vi.fn()
            }
        }
    }
}))

// 避免真实刷新逻辑
vi.mock('@/stores/auth', () => ({
    useAuthStore: () => ({
        refresh: vi.fn(),
        logout: vi.fn()
    })
}))

describe('MiTheme', () => {
    beforeEach(() => {
        setActivePinia(createPinia())
    })

    afterEach(() => {
        vi.clearAllMocks()
    })

    test('渲染默认插槽内容', () => {
        const wrapper = mount(MiTheme, {
            global: {
                provide: {
                    setLocale: vi.fn()
                }
            },
            slots: {
                default: () => 'theme-content'
            }
        })

        expect(wrapper.text()).toContain('theme-content')
    })

    test('初始化时根据 props.theme 设置全局主题并更新 store', () => {
        const theme = {
            type: 'light',
            primary: '#ff0000',
            radius: 6
        } as const

        const wrapper = mount(MiTheme, {
            props: { theme },
            global: {
                provide: {
                    setLocale: vi.fn()
                }
            },
            slots: {
                default: () => 'theme-content'
            }
        })

        expect(wrapper.exists()).toBe(true)

        const store = useThemeStore()
        expect($g.theme.primary).toBe(theme.primary)
        expect($g.theme.type).toBe(theme.type)
        expect(store.properties).toBeTruthy()
    })

    test('当全局主题变化时调用 theme store updateProperties', async () => {
        setActivePinia(createPinia())
        const store = useThemeStore()
        const spy = vi.spyOn(store, 'updateProperties')

        mount(MiTheme, {
            global: {
                provide: {
                    setLocale: vi.fn()
                }
            }
        })

        $g.theme.primary = '#00ff00'
        await nextTick()

        expect(spy).toHaveBeenCalled()
    })
})
