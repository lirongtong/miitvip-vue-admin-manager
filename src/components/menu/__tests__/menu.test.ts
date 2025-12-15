/* eslint-disable vue/one-component-per-file */
import { mount, type VueWrapper } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import { h, nextTick } from 'vue'
import { createMemoryHistory, createRouter } from 'vue-router'
import { createPinia, setActivePinia } from 'pinia'

import MiMenu from '../Menu'
import { useMenuStore } from '../../../stores/menu'
import { useLayoutStore } from '../../../stores/layout'

const { resizeState, toolsMock, scrollSpy } = vi.hoisted(() => {
    // 避免 ESM hoist 导致 ref 未初始化（用 require 获取）
    const { ref } = require('vue')
    return {
        resizeState: {
            width: ref(1200),
            height: ref(600)
        },
        scrollSpy: vi.fn(),
        toolsMock: {
            distinguishSize: vi.fn((v: any) => v),
            getElementActualOffsetTopOrLeft: vi.fn((el: any) =>
                el?.dataset?.top ? Number(el.dataset.top) : 0
            ),
            scrollToPos: vi.fn((...args: any[]) => scrollSpy(...args))
        }
    }
})

vi.mock('../../../utils/global', () => {
    return {
        $g: {
            prefix: 'mi-',
            breakpoints: { md: 768 },
            theme: { type: 'light' },
            caches: {
                storages: {
                    collapsed: 'collapsed'
                }
            }
        }
    }
})

vi.mock('../../../utils/tools', () => {
    return {
        $tools: toolsMock
    }
})

vi.mock('../../_utils/theme', () => {
    return { default: () => null }
})

vi.mock('../../../hooks/useWindowResize', () => {
    return {
        useWindowResize: () => resizeState
    }
})

vi.mock('../Submenu', () => {
    const { defineComponent, h } = require('vue')
    return {
        default: defineComponent({
            name: 'MiSubMenuStub',
            props: { item: { type: Object, default: () => ({}) } },
            setup(props) {
                return () => h('div', { 'data-testid': 'submenu', 'data-name': props.item?.name })
            }
        })
    }
})

vi.mock('../Item', () => {
    const { defineComponent, h } = require('vue')
    return {
        default: defineComponent({
            name: 'MiMenuItemStub',
            props: { item: { type: Object, default: () => ({}) } },
            setup(props) {
                return () => h('div', { 'data-testid': 'item', 'data-name': props.item?.name })
            }
        })
    }
})

vi.mock('ant-design-vue', async () => {
    const { defineComponent, h } = await import('vue')

    const Menu = defineComponent({
        name: 'AMenu',
        inheritAttrs: false,
        props: {
            openKeys: { type: Array as any, default: () => [] },
            selectedKeys: { type: Array as any, default: () => [] },
            inlineCollapsed: { type: Boolean, default: false },
            inlineIndent: { type: Number, default: 16 }
        },
        emits: ['openChange'],
        setup(props, { slots, emit, expose }) {
            const root = document.createElement('ul')
            root.dataset.top = '10'
            expose({ $el: root })

            return () =>
                h(
                    'div',
                    {
                        'data-testid': 'menu',
                        'data-open-keys': JSON.stringify(props.openKeys),
                        'data-selected-keys': JSON.stringify(props.selectedKeys),
                        onClick: () => emit('openChange', ['x'])
                    },
                    slots.default?.()
                )
        }
    })

    return { Menu }
})

const flushPromises = async () => {
    for (let i = 0; i < 10; i += 1) await Promise.resolve()
}

describe('MiMenu', () => {
    const wrappers: VueWrapper[] = []
    let pinia: ReturnType<typeof createPinia>

    beforeEach(() => {
        pinia = createPinia()
        setActivePinia(pinia)
        resizeState.width.value = 1200
        resizeState.height.value = 600
        toolsMock.distinguishSize.mockClear()
        toolsMock.getElementActualOffsetTopOrLeft.mockClear()
        toolsMock.scrollToPos.mockClear()
        scrollSpy.mockClear()
    })

    afterEach(() => {
        wrappers.splice(0).forEach((w) => w.unmount())
        vi.restoreAllMocks()
        document.body.innerHTML = ''
    })

    const createRouterAndPush = async (path: string) => {
        const router = createRouter({
            history: createMemoryHistory(),
            routes: [
                { path: '/a', name: 'a', component: { render: () => h('div') } },
                { path: '/a/child', name: 'a-child', component: { render: () => h('div') } },
                { path: '/b', name: 'b', component: { render: () => h('div') } }
            ]
        })
        await router.push(path)
        await router.isReady()
        return router
    }

    test('初始化：根据 route.path 计算 relationshipChain/activeKeys/openKeys（accordion=true 且未折叠）', async () => {
        const router = await createRouterAndPush('/a/child')

        const menuStore = useMenuStore()
        const layoutStore = useLayoutStore()
        layoutStore.$patch({ collapsed: false })
        menuStore.$patch({ accordion: true })

        const items = [
            {
                name: 'a',
                path: '/a',
                children: [{ name: 'a-child', path: '/a/child' }]
            },
            { name: 'b', path: '/b' }
        ] as any

        const wrapper = mount(MiMenu, {
            props: { items },
            global: { plugins: [router, pinia] },
            attachTo: document.body
        })
        wrappers.push(wrapper)

        await nextTick()
        expect(menuStore.relationshipChain).toEqual(['mi-a', 'mi-a-child'])
        expect(menuStore.activeKeys).toEqual(['mi-a-child'])
        expect(menuStore.openKeys).toEqual(['mi-a'])
    })

    test('openChange：accordion=true 且 keys 来自不同根节点时，仅保留 last', async () => {
        const router = await createRouterAndPush('/a')

        const menuStore = useMenuStore()
        const layoutStore = useLayoutStore()
        layoutStore.$patch({ collapsed: false })
        menuStore.$patch({ accordion: true })

        const items = [
            { name: 'a', path: '/a', children: [{ name: 'a-child', path: '/a/child' }] },
            { name: 'b', path: '/b' }
        ] as any

        const wrapper = mount(MiMenu, {
            props: { items },
            global: { plugins: [router, pinia] },
            attachTo: document.body
        })
        wrappers.push(wrapper)

        // 直接触发 AMenu 的 openChange
        const aMenu = wrapper.findComponent({ name: 'AMenu' })
        ;(aMenu.vm as any).$emit('openChange', ['mi-a', 'mi-b'])
        await nextTick()

        expect(menuStore.openKeys).toEqual(['mi-b'])
    })

    test('onMounted：宽屏且未折叠时，会滚动到 active item（selector 使用 activeKeys[0]）', async () => {
        const router = await createRouterAndPush('/a/child')

        const menuStore = useMenuStore()
        const layoutStore = useLayoutStore()
        layoutStore.$patch({ collapsed: false })
        menuStore.$patch({ accordion: true })

        const items = [
            {
                name: 'a',
                path: '/a',
                children: [{ name: 'a-child', path: '/a/child' }]
            }
        ] as any

        // activeKeys 将会是 ['mi-a-child']，准备一个匹配的 li
        const li = document.createElement('li')
        li.dataset.menuId = 'mi-a-child'
        li.dataset.top = '800'
        document.body.appendChild(li)

        const wrapper = mount(MiMenu, {
            props: { items },
            global: { plugins: [router, pinia] },
            attachTo: document.body
        })
        wrappers.push(wrapper)

        await flushPromises()
        await nextTick()

        expect(toolsMock.scrollToPos).toHaveBeenCalled()
    })

    test('route 变化：更新 activeKeys，并把 drawer 置为 false', async () => {
        const router = await createRouterAndPush('/a')

        const menuStore = useMenuStore()
        menuStore.$patch({ drawer: true })

        const items = [
            { name: 'a', path: '/a' },
            { name: 'b', path: '/b' }
        ] as any

        const wrapper = mount(MiMenu, {
            props: { items },
            global: { plugins: [router, pinia] },
            attachTo: document.body
        })
        wrappers.push(wrapper)

        await router.push('/b')
        await router.isReady()
        await flushPromises()
        await nextTick()

        expect(menuStore.drawer).toBe(false)
        expect(menuStore.activeKeys).toEqual(['mi-b'])
    })
})
