import { mount, type VueWrapper } from '@vue/test-utils'
import { afterEach, describe, expect, test, vi } from 'vitest'
import { h, nextTick } from 'vue'
import { createRouter, createMemoryHistory } from 'vue-router'
import MiLink from '../Link'
import styled from '../style/link.module.less'

vi.mock('ant-design-vue', async (importOriginal) => {
    const actual: any = await importOriginal<any>()
    const { defineComponent, h } = await import('vue')

    const Row = defineComponent({
        name: 'ARow',
        inheritAttrs: false,
        setup(_props, { slots, attrs }) {
            return () => h('div', { ...attrs, 'data-testid': 'row' }, slots.default?.())
        }
    })

    return {
        ...actual,
        Row
    }
})

describe('MiLink', () => {
    const wrappers: VueWrapper[] = []

    afterEach(() => {
        wrappers.splice(0).forEach((w) => w.unmount())
        vi.restoreAllMocks()
        document.body.innerHTML = ''
    })

    test('内部路由：path 非 url 时使用 RouterLink，并携带 query', async () => {
        const router = createRouter({
            history: createMemoryHistory(),
            routes: [{ path: '/foo', name: 'foo', component: { render: () => h('div') } }]
        })
        await router.push('/foo')
        await router.isReady()

        const wrapper = mount(MiLink, {
            props: {
                path: '/foo',
                query: { a: 1 }
            },
            slots: {
                default: () => 'Go'
            },
            global: {
                plugins: [router]
            },
            attachTo: document.body
        })
        wrappers.push(wrapper)

        await nextTick()
        const a = wrapper.find('a')
        expect(a.exists()).toBe(true)
        expect(a.text()).toContain('Go')
        expect(a.attributes('href')).toContain('/foo')
        expect(a.attributes('href')).toContain('a=1')
    })

    test('外部链接：query 为空时不拼接 "?"，默认 target=_blank', async () => {
        const wrapper = mount(MiLink, {
            props: {
                path: 'https://example.com/x'
            },
            slots: {
                default: () => 'X'
            },
            attachTo: document.body
        })
        wrappers.push(wrapper)

        await nextTick()
        const a = wrapper.find('a')
        expect(a.attributes('href')).toBe('https://example.com/x')
        expect(a.attributes('target')).toBe('_blank')
    })

    test('外部链接：path 已含 query 时追加 "&"，并对值做 encode', async () => {
        const wrapper = mount(MiLink, {
            props: {
                path: 'https://example.com/x?x=1',
                query: { q: 'a b' }
            },
            slots: {
                default: () => 'X'
            },
            attachTo: document.body
        })
        wrappers.push(wrapper)

        await nextTick()
        const a = wrapper.find('a')
        expect(a.attributes('href')).toBe('https://example.com/x?x=1&q=a%20b')
    })

    test('email：合法邮箱生成 mailto 链接', async () => {
        const wrapper = mount(MiLink, {
            props: {
                type: 'email',
                path: 'a@b.com'
            },
            attachTo: document.body
        })
        wrappers.push(wrapper)

        await nextTick()
        const a = wrapper.find('a')
        expect(a.attributes('href')).toBe('mailto:a@b.com')
        expect(a.classes()).toContain(styled.email)
        expect(a.html()).toContain('a@b.com')
    })

    test('vertical=true：容器添加 vertical class', async () => {
        const wrapper = mount(MiLink, {
            props: {
                path: 'https://example.com',
                vertical: true
            },
            slots: {
                default: () => 'V'
            },
            attachTo: document.body
        })
        wrappers.push(wrapper)

        await nextTick()
        const row = wrapper.find('[data-testid="row"]')
        expect(row.classes()).toContain(styled.container)
        expect(row.classes()).toContain(styled.vertical)
    })
})
