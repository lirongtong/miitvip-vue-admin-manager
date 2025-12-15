/* eslint-disable vue/one-component-per-file */
import { mount, type VueWrapper } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import { defineComponent, h, nextTick } from 'vue'

import MiNotice from '../Notice'
import MiNoticeItem from '../Item'
import itemStyled from '../style/item.module.less'

const { resizeState, toolsOverrides } = vi.hoisted(() => {
    return {
        resizeState: { width: null as any },
        toolsOverrides: {
            uid: vi.fn(() => 'uid'),
            convert2rem: vi.fn((v: any) => String(v)),
            distinguishSize: vi.fn((v: any) => v),
            getAntdvThemeProperties: vi.fn(() => ({})),
            beautySub: vi.fn((s: any) => String(s)),
            formatDateNow: vi.fn(() => '2025-01-01')
        } as Record<string, any>
    }
})

vi.mock('../../../hooks/useWindowResize', async () => {
    const { ref } = await import('vue')
    if (!resizeState.width) resizeState.width = ref(1200)
    return {
        useWindowResize: () => ({ width: resizeState.width })
    }
})

vi.mock('../../../utils/tools', async (importOriginal) => {
    const actual: any = await importOriginal<any>()
    // 保留原始 $tools（避免影响 api/theme 等其它模块），只覆写本用例需要稳定的少数方法
    const patched = Object.create(actual.$tools)
    Object.assign(patched, toolsOverrides)
    return { ...actual, $tools: patched }
})

vi.mock('../../_utils/theme', () => {
    return { default: () => null }
})

vi.mock('swiper/modules', () => {
    return { FreeMode: {} }
})

vi.mock('ant-design-vue', async () => {
    const { defineComponent, h } = await import('vue')

    const ConfigProvider = defineComponent({
        name: 'AConfigProvider',
        setup(_props, { slots }) {
            return () => h('div', { 'data-testid': 'config-provider' }, slots.default?.())
        }
    })

    const Popover = defineComponent({
        name: 'APopover',
        props: {
            content: { type: null as any, default: null },
            onOpenChange: { type: Function as any, default: undefined }
        },
        setup(props, { slots }) {
            return () =>
                h('div', { 'data-testid': 'popover' }, [
                    h('div', { 'data-testid': 'trigger' }, slots.default?.()),
                    h('div', { 'data-testid': 'content' }, [props.content])
                ])
        }
    })

    const Badge = defineComponent({
        name: 'ABadge',
        props: {
            count: { type: [Number, String], default: 0 },
            dot: { type: Boolean, default: false },
            showZero: { type: Boolean, default: false },
            overflowCount: { type: Number, default: 99 }
        },
        setup(props, { slots }) {
            return () =>
                h(
                    'div',
                    {
                        'data-testid': 'badge',
                        'data-count': String(props.count),
                        'data-dot': String(props.dot),
                        'data-show-zero': String(props.showZero),
                        'data-overflow': String(props.overflowCount)
                    },
                    slots.default?.()
                )
        }
    })

    const Checkbox = defineComponent({
        name: 'ACheckbox',
        setup(_props, { slots }) {
            return () => h('label', { 'data-testid': 'checkbox' }, slots.default?.())
        }
    })

    const Row = defineComponent({
        name: 'ARow',
        inheritAttrs: false,
        setup(_props, { slots, attrs }) {
            return () => h('div', { ...attrs }, slots.default?.())
        }
    })

    const Flex = defineComponent({
        name: 'AFlex',
        inheritAttrs: false,
        setup(_props, { slots, attrs }) {
            return () => h('div', { ...attrs }, slots.default?.())
        }
    })

    const Tag = defineComponent({
        name: 'ATag',
        inheritAttrs: false,
        setup(_props, { slots, attrs }) {
            return () => h('span', { ...attrs, 'data-testid': 'tag' }, slots.default?.())
        }
    })

    return { ConfigProvider, Popover, Badge, Checkbox, Row, Flex, Tag }
})

vi.mock('@ant-design/icons-vue', async () => {
    const { defineComponent, h } = await import('vue')

    const icon = (name: string) =>
        defineComponent({
            name,
            setup() {
                return () => h('i', { 'data-testid': name })
            }
        })

    return {
        BellOutlined: icon('BellOutlined'),
        ShoppingOutlined: icon('ShoppingOutlined'),
        MessageOutlined: icon('MessageOutlined'),
        ArrowLeftOutlined: icon('ArrowLeftOutlined')
    }
})

vi.mock('../clock', () => {
    return {
        default: defineComponent({
            name: 'MiClock',
            setup() {
                return () => h('div', { 'data-testid': 'clock' })
            }
        })
    }
})

describe('MiNotice', () => {
    const wrappers: VueWrapper[] = []

    beforeEach(() => {
        toolsOverrides.uid.mockClear()
    })

    afterEach(() => {
        wrappers.splice(0).forEach((w) => w.unmount())
        vi.restoreAllMocks()
        document.body.innerHTML = ''
    })

    test('tabs(object)：支持 tabActive v-model，点击 tab 会 emit update:tabActive/tabClick/tabChange，并切换 slide active class', async () => {
        const wrapper = mount(MiNotice, {
            props: {
                tabs: [
                    { name: 'all', tab: '全部', items: [{ title: 't1', content: 'c1' }] },
                    { name: 'frontend', tab: '前端', items: [] }
                ],
                tabActive: 'all',
                tabDefaultActive: 'frontend'
            },
            attachTo: document.body
        })
        wrappers.push(wrapper)

        await nextTick()

        const swiper = wrapper.find('swiper-container')
        expect(swiper.exists()).toBe(true)

        const slides = wrapper.findAll('swiper-slide').map((w) => w.element as HTMLElement)
        ;(swiper.element as any).swiper = {
            clickedIndex: 1,
            slides
        }

        const tabs = wrapper.findAll('.mi-notice-tab')
        expect(tabs.length).toBe(2)

        await tabs[1].trigger('click')
        await nextTick()

        expect(wrapper.emitted().tabClick?.[0]?.[0]).toBe('frontend')
        expect(wrapper.emitted()['update:tabActive']?.[0]?.[0]).toBe('frontend')
        expect(wrapper.emitted().tabChange?.[0]?.[0]).toBe('frontend')

        expect(slides[0].classList.contains('active')).toBe(false)
        expect(slides[1].classList.contains('active')).toBe(true)
    })

    test('openChange=true 首次初始化会给当前 active slide 增加 active class', async () => {
        const wrapper = mount(MiNotice, {
            props: {
                tabs: [
                    { name: 'all', tab: '全部', items: [] },
                    { name: 'frontend', tab: '前端', items: [] }
                ],
                tabActive: 'frontend'
            },
            attachTo: document.body
        })
        wrappers.push(wrapper)

        await nextTick()

        wrapper.find('swiper-container')
        const slides = wrapper.findAll('swiper-slide').map((w) => w.element as HTMLElement)
        expect(slides.length).toBe(2)

        // 触发 Popover 的 openChange
        const popover = wrapper.findComponent({ name: 'APopover' })
        ;(popover.props() as any).onOpenChange?.(true)

        await nextTick()
        expect(slides[1].classList.contains('active')).toBe(true)
    })
})

describe('MiNoticeItem', () => {
    const wrappers: VueWrapper[] = []

    afterEach(() => {
        wrappers.splice(0).forEach((w) => w.unmount())
        vi.restoreAllMocks()
        document.body.innerHTML = ''
    })

    test('有 content 时：点击会展开详情，再点击返回收起；传入 click listener 时会有 cursor class', async () => {
        const wrapper = mount(MiNoticeItem, {
            props: {
                title: 't',
                content: 'detail'
            },
            attrs: {
                onClick: vi.fn()
            },
            attachTo: document.body
        })
        wrappers.push(wrapper)

        await nextTick()
        const container = wrapper.find(`.${itemStyled.container}`)
        expect(container.exists()).toBe(true)
        // cursor class 应存在（修复点）
        expect(container.classes()).toContain(itemStyled.cursor)

        // 初始不展示详情
        expect(wrapper.find(`.${itemStyled.detail}`).exists()).toBe(false)

        await container.trigger('click')
        await nextTick()
        expect(wrapper.find(`.${itemStyled.detail}`).exists()).toBe(true)

        const back = wrapper.find(`.${itemStyled.detailBack}`)
        await back.trigger('click')
        await nextTick()
        expect(wrapper.find(`.${itemStyled.detail}`).exists()).toBe(false)
    })
})
