import { mount, type VueWrapper } from '@vue/test-utils'
import { afterEach, describe, expect, test, vi } from 'vitest'
import { defineComponent, h, nextTick } from 'vue'
import MiDropdown from '../Dropdown'
import MiDropdownItem from '../Item'
import styled from '../style/dropdown.module.less'

/* eslint-disable vue/one-component-per-file */
vi.mock('ant-design-vue', async () => {
    const { defineComponent, h } = await import('vue')

    const MenuItem = defineComponent({
        name: 'AMenuItem',
        setup(_props, { slots }) {
            return () => h('div', { 'data-testid': 'menu-item' }, slots.default?.())
        }
    })

    const Menu = Object.assign(
        defineComponent({
            name: 'AMenu',
            setup(_props, { slots }) {
                return () => h('div', { 'data-testid': 'menu' }, slots.default?.())
            }
        }),
        { Item: MenuItem }
    )

    const Dropdown = defineComponent({
        name: 'ADropdown',
        props: {
            overlay: { type: null, default: null },
            overlayClassName: { type: String, default: '' }
        },
        setup(props, { slots }) {
            return () =>
                h('div', { 'data-testid': 'dropdown' }, [
                    h('div', { 'data-testid': 'dropdown-trigger' }, slots.default?.()),
                    h(
                        'div',
                        { 'data-testid': 'dropdown-overlay', class: props.overlayClassName },
                        props.overlay
                    )
                ])
        }
    })

    const Avatar = defineComponent({
        name: 'AAvatar',
        setup() {
            return () => h('div', { 'data-testid': 'avatar' })
        }
    })

    return { Dropdown, Avatar, Menu }
})

const MiLinkStub = defineComponent({
    name: 'MiLink',
    props: {
        path: { type: String, default: '' },
        target: { type: String, default: '_self' },
        query: { type: Object, default: () => ({}) }
    },
    setup(props, { slots, attrs }) {
        return () =>
            h(
                'a',
                {
                    ...attrs,
                    'data-testid': 'mi-link',
                    'data-path': props.path,
                    'data-target': props.target,
                    'data-query': JSON.stringify(props.query || {})
                },
                slots.default?.()
            )
    }
})
/* eslint-enable vue/one-component-per-file */

describe('MiDropdown', () => {
    const wrappers: VueWrapper[] = []

    afterEach(() => {
        wrappers.splice(0).forEach((w) => w.unmount())
        vi.restoreAllMocks()
        document.body.innerHTML = ''
    })

    test('默认 title：未传 title/slot 时显示 Avatar', async () => {
        const wrapper = mount(MiDropdown, {
            global: { stubs: { MiLink: MiLinkStub } },
            attachTo: document.body
        })
        wrappers.push(wrapper)

        await nextTick()
        expect(wrapper.find(`.${styled.avatar}`).exists()).toBe(true)
    })

    test('title slot 优先：渲染自定义 title 并不显示 Avatar', async () => {
        const wrapper = mount(MiDropdown, {
            global: { stubs: { MiLink: MiLinkStub } },
            slots: {
                title: () => h('span', { 'data-testid': 'custom-title' }, 'T'),
                // 组件 slots 类型里 overlay 也是必填，这里给一个空实现即可
                overlay: () => null
            },
            attachTo: document.body
        })
        wrappers.push(wrapper)

        await nextTick()
        expect(wrapper.find('[data-testid="custom-title"]').exists()).toBe(true)
        expect(wrapper.find(`.${styled.title}`).exists()).toBe(true)
        expect(wrapper.find(`.${styled.avatar}`).exists()).toBe(false)
    })

    test('items：会生成 menu-item，并且点击会触发 item.callback', async () => {
        const cb = vi.fn()
        const wrapper = mount(MiDropdown, {
            props: {
                items: [
                    {
                        name: 'n1',
                        title: 'Hello',
                        path: '/p1',
                        target: '_blank',
                        query: { a: 1 },
                        callback: cb
                    }
                ]
            },
            global: { stubs: { MiLink: MiLinkStub } },
            attachTo: document.body
        })
        wrappers.push(wrapper)

        await nextTick()
        const link = wrapper.find('[data-testid="mi-link"]')
        expect(link.exists()).toBe(true)
        expect(link.attributes('data-path')).toBe('/p1')
        expect(link.attributes('data-target')).toBe('_blank')
        expect(link.attributes('data-query')).toBe(JSON.stringify({ a: 1 }))

        await link.trigger('click')
        expect(cb).toHaveBeenCalledTimes(1)
    })

    test('overlay slot：存在时优先渲染 overlay slot（不强依赖 items）', async () => {
        const wrapper = mount(MiDropdown, {
            props: {
                items: [{ name: 'n1', title: 'Hello' }]
            },
            global: { stubs: { MiLink: MiLinkStub } },
            slots: {
                // 组件 slots 类型里 title/overlay 都是必填，这里补一个空 title
                title: () => null,
                overlay: () => h('div', { 'data-testid': 'custom-overlay' }, 'O')
            },
            attachTo: document.body
        })
        wrappers.push(wrapper)

        await nextTick()
        expect(wrapper.find('[data-testid="custom-overlay"]').exists()).toBe(true)
    })
})

describe('MiDropdownItem', () => {
    test('title 支持 innerHTML，tag 支持 content', async () => {
        const wrapper = mount(MiDropdownItem, {
            props: {
                item: {
                    title: '<b data-testid="t">Title</b>',
                    tag: { content: '<i data-testid="tag">Hot</i>' }
                }
            },
            attachTo: document.body
        })

        await nextTick()
        expect(wrapper.find('[data-testid="t"]').exists()).toBe(true)
        expect(wrapper.find('[data-testid="tag"]').exists()).toBe(true)
        wrapper.unmount()
    })
})
