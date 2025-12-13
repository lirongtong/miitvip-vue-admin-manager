import { mount, config as vtuConfig, type VueWrapper } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import { defineComponent, h, nextTick } from 'vue'
import { createRouter, createMemoryHistory } from 'vue-router'
import { setActivePinia } from 'pinia'
import MiHistoricalRouting from '../Historical'
import styled from '../style/historical.module.less'
import { useHistoricalStore } from '../../../stores/historical'
import { $g } from '../../../utils/global'
import { $tools } from '../../../utils/tools'

/* eslint-disable vue/one-component-per-file */
const TooltipStub = defineComponent({
    name: 'TooltipStub',
    setup(_props, { slots }) {
        return () => h('span', { 'data-testid': 'tooltip' }, slots.default?.())
    }
})

const MiDropdownStub = defineComponent({
    name: 'MiDropdown',
    props: {
        items: { type: Array as any, default: () => [] }
    },
    setup(props, { slots }) {
        return () =>
            h('div', { 'data-testid': 'mi-dropdown' }, [
                h('div', { 'data-testid': 'mi-dropdown-title' }, slots.title?.()),
                h(
                    'div',
                    { 'data-testid': 'mi-dropdown-items' },
                    (props.items || []).map((it: any) =>
                        h(
                            'button',
                            {
                                type: 'button',
                                'data-testid': `close-${it?.name}`,
                                onClick: () => it?.callback?.()
                            },
                            String(it?.name)
                        )
                    )
                )
            ])
    }
})
/* eslint-enable vue/one-component-per-file */

const flushMountedTimers = async (ms: number) => {
    await nextTick()
    if (ms > 0) vi.advanceTimersByTime(ms)
    else vi.runOnlyPendingTimers()
    await nextTick()
    await nextTick()
}

describe('MiHistoricalRouting', () => {
    const wrappers: VueWrapper[] = []
    const globalStubs = { Tooltip: TooltipStub, ATooltip: TooltipStub, MiDropdown: MiDropdownStub }
    const getPiniaFromVtu = () => {
        const plugins = (vtuConfig.global.plugins || []) as any[]
        return plugins.find((p) => p && typeof p === 'object' && '_s' in p) as any
    }

    const createTestRouter = () => {
        return createRouter({
            history: createMemoryHistory(),
            routes: [
                {
                    path: '/a',
                    name: 'A',
                    component: { render: () => h('div') },
                    meta: { title: 'A-title' }
                },
                {
                    path: '/b',
                    name: 'B',
                    component: { render: () => h('div') },
                    meta: { title: 'B-title' }
                }
            ]
        })
    }

    beforeEach(() => {
        vi.useFakeTimers()
        document.body.innerHTML = ''
        // 清理历史路由（避免依赖 localStorage.removeItem 的实现差异）
        const key = `${$g.prefix}${$g.caches.storages?.routes}`
        ;(localStorage as any)?.setItem?.(key, JSON.stringify({}))
        // 清理 pinia store 内存态（同一 pinia 实例会跨测试复用）
        const pinia = getPiniaFromVtu()
        if (pinia) {
            setActivePinia(pinia)
            useHistoricalStore(pinia).setRoutes({})
        }
    })

    afterEach(() => {
        wrappers.splice(0).forEach((w) => w.unmount())
        vi.runOnlyPendingTimers()
        vi.useRealTimers()
        vi.restoreAllMocks()
        document.body.innerHTML = ''
    })

    test('mount 会收集当前路由并渲染 active item', async () => {
        const router = createTestRouter()
        await router.push('/a')
        await router.isReady()

        const onSpy = vi.spyOn($tools, 'on')

        const wrapper = mount(MiHistoricalRouting, {
            global: {
                plugins: [router],
                stubs: globalStubs
            },
            attachTo: document.body
        })
        wrappers.push(wrapper)

        await flushMountedTimers(400)

        const store = useHistoricalStore()
        expect(store.routes?.A).toBeTruthy()
        expect(wrapper.findAll(`.${styled.item}`).length).toBe(1)
        expect(wrapper.find(`.${styled.item}`).classes()).toContain(styled.itemActive)
        expect(onSpy).toHaveBeenCalled()
    })

    test('路由切换会追加历史并更新 active', async () => {
        const router = createTestRouter()
        await router.push('/a')
        await router.isReady()

        const wrapper = mount(MiHistoricalRouting, {
            global: {
                plugins: [router],
                stubs: globalStubs
            },
            attachTo: document.body
        })
        wrappers.push(wrapper)

        await flushMountedTimers(400)

        await router.push('/b')
        await flushMountedTimers(400)

        const store = useHistoricalStore()
        expect(store.routes?.A).toBeTruthy()
        expect(store.routes?.B).toBeTruthy()
        expect(wrapper.findAll(`.${styled.item}`).length).toBe(2)

        const actives = wrapper.findAll(`.${styled.itemActive}`)
        expect(actives.length).toBe(1)
        expect(actives[0].text()).toContain('B-title')
    })

    test('只有 1 个路由时不会产生非 0 的 translateX（修复 routes.value.length 误用）', async () => {
        const router = createTestRouter()
        await router.push('/a')
        await router.isReady()

        const wrapper = mount(MiHistoricalRouting, {
            global: {
                plugins: [router],
                stubs: globalStubs
            },
            attachTo: document.body
        })
        wrappers.push(wrapper)

        await nextTick()

        const listEl = wrapper.find(`.${styled.list}`).element as HTMLElement
        const itemsEl = wrapper.find(`.${styled.items}`).element as HTMLElement
        const itemEl = wrapper.find(`.${styled.item}`).element as HTMLElement

        Object.defineProperty(listEl, 'clientWidth', { configurable: true, get: () => 100 })
        Object.defineProperty(itemsEl, 'clientWidth', { configurable: true, get: () => 300 })
        Object.defineProperty(itemEl, 'clientWidth', { configurable: true, get: () => 50 })
        Object.defineProperty(itemEl, 'offsetLeft', { configurable: true, get: () => 200 })

        await flushMountedTimers(400)

        const styleText = wrapper.find(`.${styled.items}`).attributes('style') || ''
        expect(styleText).toContain('translateX(')
        // 只有一个路由时 offset 必须为 0（不会把 items 推走）
        expect(styleText).toContain('translateX(0')
    })

    test('点击 itemMask 会切换到对应 path', async () => {
        const router = createTestRouter()
        await router.push('/a')
        await router.isReady()

        const pushSpy = vi.spyOn(router, 'push')

        const wrapper = mount(MiHistoricalRouting, {
            global: {
                plugins: [router],
                stubs: globalStubs
            },
            attachTo: document.body
        })
        wrappers.push(wrapper)

        await flushMountedTimers(400)

        await router.push('/b')
        await flushMountedTimers(400)

        const masks = wrapper.findAll(`.${styled.itemMask}`)
        expect(masks.length).toBe(2)

        await masks[0].trigger('click')
        await nextTick()
        await nextTick()

        expect(pushSpy).toHaveBeenCalled()
    })

    test('下拉关闭：close other / close all 会更新 routes', async () => {
        const router = createTestRouter()
        await router.push('/a')
        await router.isReady()

        const wrapper = mount(MiHistoricalRouting, {
            global: {
                plugins: [router],
                stubs: globalStubs
            },
            attachTo: document.body
        })
        wrappers.push(wrapper)

        await flushMountedTimers(400)

        await router.push('/b')
        await flushMountedTimers(400)

        // 当前为 /b，点击 close-other 应仅保留当前
        await wrapper.find('[data-testid="close-other"]').trigger('click')
        await flushMountedTimers(400)

        const store1 = useHistoricalStore()
        expect(Object.keys(store1.routes || {}).length).toBe(1)
        expect(store1.routes?.B).toBeTruthy()

        // close-all 清空后会自动重新收集当前路由（仍保留 1 个）
        await wrapper.find('[data-testid="close-all"]').trigger('click')
        await flushMountedTimers(400)

        const store2 = useHistoricalStore()
        expect(Object.keys(store2.routes || {}).length).toBe(1)
        expect(store2.routes?.B).toBeTruthy()
    })

    test('unmount 会解绑 resize 且不会遗留定时器回调', async () => {
        const router = createTestRouter()
        await router.push('/a')
        await router.isReady()

        const offSpy = vi.spyOn($tools, 'off')

        const wrapper = mount(MiHistoricalRouting, {
            global: {
                plugins: [router],
                stubs: globalStubs
            },
            attachTo: document.body
        })

        await flushMountedTimers(400)

        wrapper.unmount()
        expect(offSpy).toHaveBeenCalled()

        // 若存在未清理 timer，这里可能会在已卸载组件上触发逻辑导致报错
        vi.runOnlyPendingTimers()
        expect(true).toBe(true)
    })
})
