import { mount, config as vtuConfig, type VueWrapper } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import { defineComponent, h, nextTick } from 'vue'
import MiLayout from '../Layout'
import styled from '../style/layout.module.less'
import { useLayoutStore } from '../../../stores/layout'
import { setActivePinia } from 'pinia'

/* eslint-disable vue/one-component-per-file */
vi.mock('ant-design-vue', async () => {
    const { defineComponent, h } = await import('vue')

    const ConfigProvider = defineComponent({
        name: 'AConfigProvider',
        setup(_props, { slots }) {
            return () => h('div', { 'data-testid': 'config-provider' }, slots.default?.())
        }
    })

    return {
        ConfigProvider,
        theme: { darkAlgorithm: {}, defaultAlgorithm: {} }
    }
})

vi.mock('../../notice', async () => {
    const { defineComponent, h } = await import('vue')
    return {
        default: defineComponent({
            name: 'MiNotice',
            setup() {
                return () => h('div', { 'data-testid': 'notice' })
            }
        })
    }
})

vi.mock('../../notice/Notice', async () => {
    const { defineComponent, h } = await import('vue')
    return {
        default: defineComponent({
            name: 'MiNotice',
            setup() {
                return () => h('div', { 'data-testid': 'notice' })
            }
        })
    }
})

vi.mock('../Header', async () => {
    const { defineComponent, h } = await import('vue')
    return {
        default: defineComponent({
            name: 'MiLayoutHeader',
            props: {
                showBreadcrumbs: { type: Boolean, default: true }
            },
            setup(props) {
                return () =>
                    h('div', {
                        'data-testid': 'header',
                        'data-show-breadcrumbs': String(props.showBreadcrumbs)
                    })
            }
        })
    }
})

vi.mock('../Sider', async () => {
    const { defineComponent, h } = await import('vue')
    return {
        default: defineComponent({
            name: 'MiLayoutSider',
            setup() {
                return () => h('aside', { 'data-testid': 'sider' })
            }
        })
    }
})

vi.mock('../Content', async () => {
    const { defineComponent, h } = await import('vue')
    return {
        default: defineComponent({
            name: 'MiLayoutContent',
            setup() {
                return () => h('main', { 'data-testid': 'content' })
            }
        })
    }
})

vi.mock('../Footer', async () => {
    const { defineComponent, h } = await import('vue')
    return {
        default: defineComponent({
            name: 'MiLayoutFooter',
            setup() {
                return () => h('footer', { 'data-testid': 'footer' })
            }
        })
    }
})

const TransitionStub = defineComponent({
    name: 'Transition',
    props: {
        name: { type: String, default: '' },
        appear: { type: Boolean, default: false }
    },
    setup(_props, { slots }) {
        return () => slots.default?.()
    }
})
/* eslint-enable vue/one-component-per-file */

const setWindowWidth = (w: number) => {
    Object.defineProperty(window, 'innerWidth', { configurable: true, value: w })
    window.dispatchEvent(new Event('resize'))
}

describe('MiLayout', () => {
    const wrappers: VueWrapper[] = []

    const getPiniaFromVtu = () => {
        const plugins = (vtuConfig.global.plugins || []) as any[]
        return plugins.find((p) => p && typeof p === 'object' && '_s' in p) as any
    }

    beforeEach(() => {
        const pinia = getPiniaFromVtu()
        if (pinia) setActivePinia(pinia)
        setWindowWidth(1200)
        useLayoutStore().$patch({ collapsed: false })
    })

    afterEach(() => {
        wrappers.splice(0).forEach((w) => w.unmount())
        vi.restoreAllMocks()
        document.body.innerHTML = ''
    })

    test('提供 default slot 时仅渲染 default slot 内容', async () => {
        const wrapper = mount(MiLayout, {
            slots: {
                default: () => h('div', { 'data-testid': 'only-default' }, 'D'),
                // MiLayout slots 类型里这些是必填，这里补空实现即可
                header: () => null,
                sider: () => null,
                content: () => null,
                footer: () => null
            },
            global: {
                stubs: {
                    Transition: TransitionStub
                }
            },
            attachTo: document.body
        })
        wrappers.push(wrapper)

        await nextTick()
        expect(wrapper.find('[data-testid="only-default"]').exists()).toBe(true)
        expect(wrapper.find('[data-testid="header"]').exists()).toBe(false)
        expect(wrapper.find('[data-testid="sider"]').exists()).toBe(false)
    })

    test('桌面宽度会渲染 sider，移动端宽度不会渲染 sider', async () => {
        const wrapper = mount(MiLayout, {
            global: {
                stubs: {
                    Transition: TransitionStub
                }
            },
            attachTo: document.body
        })
        wrappers.push(wrapper)

        await nextTick()
        expect(wrapper.find('[data-testid="sider"]').exists()).toBe(true)
        expect(wrapper.find(`.${styled.content}`).classes()).toContain(styled.hasSider)

        setWindowWidth(375)
        await nextTick()
        expect(wrapper.find('[data-testid="sider"]').exists()).toBe(false)
    })

    test('showBreadcrumbs 会透传给 Header', async () => {
        const wrapper = mount(MiLayout, {
            props: { showBreadcrumbs: false },
            global: {
                stubs: {
                    Transition: TransitionStub
                }
            },
            attachTo: document.body
        })
        wrappers.push(wrapper)

        await nextTick()
        const header = wrapper.find('[data-testid="header"]')
        expect(header.exists()).toBe(true)
        expect(header.attributes('data-show-breadcrumbs')).toBe('false')
    })

    test('collapsed=true 时 content 会带 collapsed class', async () => {
        useLayoutStore().$patch({ collapsed: true })

        const wrapper = mount(MiLayout, {
            global: {
                stubs: {
                    Transition: TransitionStub
                }
            },
            attachTo: document.body
        })
        wrappers.push(wrapper)

        await nextTick()
        expect(wrapper.find(`.${styled.content}`).classes()).toContain(styled.collapsed)
    })
})
