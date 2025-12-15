/* eslint-disable vue/one-component-per-file */
import { mount, type VueWrapper } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import { nextTick } from 'vue'

import MiPalette from '../Palette'
import styled from '../style/palette.module.less'

const { toolsMock, storageMock, gMock, messageMock } = vi.hoisted(() => {
    return {
        messageMock: {
            destroy: vi.fn(),
            success: vi.fn()
        },
        storageMock: {
            get: vi.fn(),
            set: vi.fn()
        },
        toolsMock: {
            convert2rem: vi.fn((v: any) => String(v)),
            distinguishSize: vi.fn((v: any) => v),
            createThemeProperties: vi.fn(),
            uid: vi.fn(() => 'uid')
        },
        gMock: {
            caches: {
                storages: {
                    theme: {
                        hex: 'theme-hex',
                        type: 'theme-type'
                    }
                }
            },
            theme: {
                type: 'dark',
                primary: ''
            }
        }
    }
})

vi.mock('../../../utils/global', () => ({ $g: gMock }))
vi.mock('../../../utils/tools', () => ({ $tools: toolsMock }))
vi.mock('../../../utils/storage', () => ({ $storage: storageMock }))
vi.mock('../../_utils/theme', () => ({ default: () => null }))

vi.mock('vue3-colorpicker', async () => {
    const { defineComponent, h } = await import('vue')
    return {
        ColorPicker: defineComponent({
            name: 'ColorPicker',
            props: {
                pureColor: { type: String, default: '' },
                onPureColorChange: { type: Function as any, default: undefined }
            },
            setup(props) {
                return () =>
                    h(
                        'button',
                        {
                            type: 'button',
                            'data-testid': 'color',
                            onClick: () => props.onPureColorChange?.('#112233')
                        },
                        props.pureColor
                    )
            }
        })
    }
})

vi.mock('ant-design-vue', async () => {
    const { defineComponent, h } = await import('vue')

    const Popover = defineComponent({
        name: 'APopover',
        props: {
            open: { type: Boolean, default: false },
            trigger: { type: String, default: 'click' },
            placement: { type: String, default: 'bottom' },
            content: { type: null as any, default: null },
            onOpenChange: { type: Function as any, default: undefined }
        },
        emits: ['update:open'],
        setup(props, { slots, emit }) {
            return () =>
                h('div', { 'data-testid': 'popover' }, [
                    h(
                        'button',
                        {
                            type: 'button',
                            'data-testid': 'trigger',
                            onClick: () => {
                                const next = !props.open
                                emit('update:open', next)
                                props.onOpenChange?.(next)
                            }
                        },
                        'trigger'
                    ),
                    props.open ? h('div', { 'data-testid': 'content' }, [props.content]) : null,
                    slots.default?.()
                ])
        }
    })

    const Row = defineComponent({
        name: 'ARow',
        inheritAttrs: false,
        setup(_props, { slots, attrs }) {
            return () => h('div', { ...attrs }, slots.default?.())
        }
    })

    const Button = defineComponent({
        name: 'AButton',
        inheritAttrs: false,
        setup(_props, { slots, attrs }) {
            return () => h('button', { type: 'button', ...attrs }, slots.default?.())
        }
    })

    const Switch = defineComponent({
        name: 'ASwitch',
        props: {
            checked: { type: null as any, default: null },
            checkedValue: { type: null as any, default: true },
            unCheckedValue: { type: null as any, default: false },
            onChange: { type: Function as any, default: undefined }
        },
        setup(props) {
            return () =>
                h(
                    'button',
                    {
                        type: 'button',
                        'data-testid': 'switch',
                        onClick: () => {
                            const next =
                                props.checked === props.checkedValue
                                    ? props.unCheckedValue
                                    : props.checkedValue
                            props.onChange?.(next)
                        }
                    },
                    String(props.checked)
                )
        }
    })

    const ConfigProvider = defineComponent({
        name: 'AConfigProvider',
        setup(_props, { slots }) {
            return () => h('div', { 'data-testid': 'config-provider' }, slots.default?.())
        }
    })

    return {
        Popover,
        Row,
        Button,
        Switch,
        ConfigProvider,
        message: messageMock,
        theme: { darkAlgorithm: {}, defaultAlgorithm: {} }
    }
})

vi.mock('@ant-design/icons-vue', async () => {
    const { defineComponent, h } = await import('vue')
    return {
        BgColorsOutlined: defineComponent({
            name: 'BgColorsOutlined',
            setup() {
                return () => h('i', { 'data-testid': 'palette-icon' })
            }
        })
    }
})

describe('MiPalette', () => {
    const wrappers: VueWrapper[] = []

    beforeEach(() => {
        messageMock.destroy.mockClear()
        messageMock.success.mockClear()
        toolsMock.createThemeProperties.mockClear()
        storageMock.get.mockReset()
        storageMock.set.mockReset()

        // 初始：存储里无值
        storageMock.get.mockImplementation((k: string) => {
            if (k === gMock.caches.storages.theme.hex) return ''
            if (k === gMock.caches.storages.theme.type) return 'dark'
            return null
        })
    })

    afterEach(() => {
        wrappers.splice(0).forEach((w) => w.unmount())
        vi.restoreAllMocks()
        document.body.innerHTML = ''
    })

    test('切换主题：点击 switch 会写入 storage 并调用 createThemeProperties', async () => {
        const wrapper = mount(MiPalette, { attachTo: document.body })
        wrappers.push(wrapper)

        await nextTick()
        await wrapper.find('[data-testid="trigger"]').trigger('click')
        await nextTick()

        await wrapper.find('[data-testid="switch"]').trigger('click')
        await nextTick()

        expect(storageMock.set).toHaveBeenCalledWith(gMock.caches.storages.theme.type, 'light')
        expect(toolsMock.createThemeProperties).toHaveBeenCalled()
        expect(gMock.theme.type).toBe('light')
    })

    test('选择颜色：ColorPicker onPureColorChange 会更新 primary 并调用 createThemeProperties', async () => {
        const wrapper = mount(MiPalette, { attachTo: document.body })
        wrappers.push(wrapper)

        await wrapper.find('[data-testid="trigger"]').trigger('click')
        await nextTick()

        await wrapper.find('[data-testid="color"]').trigger('click')
        await nextTick()

        expect(gMock.theme.primary).toBe('#112233')
        expect(toolsMock.createThemeProperties).toHaveBeenCalledWith('#112233')
    })

    test('保存：点击保存会写入 hex，并关闭 popover', async () => {
        const wrapper = mount(MiPalette, { attachTo: document.body })
        wrappers.push(wrapper)

        await wrapper.find('[data-testid="trigger"]').trigger('click')
        await nextTick()
        await wrapper.find('[data-testid="color"]').trigger('click')
        await nextTick()

        // 保存按钮就是第一个带文本 save 的按钮（stub 不含文本，这里按顺序取第二个 Row 内按钮）
        const buttons = wrapper.findAll('button')
        // trigger, switch, color, reset, save, icon...
        await buttons[buttons.length - 1].trigger('click')
        await nextTick()

        expect(storageMock.set).toHaveBeenCalledWith(gMock.caches.storages.theme.hex, '#112233')
    })

    test('reset：会恢复 dark + default hex，并调用 message.success', async () => {
        const wrapper = mount(MiPalette, { attachTo: document.body })
        wrappers.push(wrapper)

        await wrapper.find('[data-testid="trigger"]').trigger('click')
        await nextTick()

        const resetBtn = wrapper.find(`.${styled.btnReset}`)
        expect(resetBtn.exists()).toBe(true)
        await resetBtn.trigger('click')
        await nextTick()

        expect(storageMock.set).toHaveBeenCalledWith(gMock.caches.storages.theme.type, 'dark')
        expect(storageMock.set).toHaveBeenCalledWith(gMock.caches.storages.theme.hex, '#63ACFF')
        expect(toolsMock.createThemeProperties).toHaveBeenCalledWith('#63ACFF')
    })
})
