/* eslint-disable vue/one-component-per-file */
import { mount, type VueWrapper } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import { defineComponent, h, nextTick } from 'vue'
import MiAppsMenu from '../index'
import styled from '../style/menu.module.less'
import { $request } from '../../../../utils/request'
import type { ResponseData } from '../../../../utils/types'

const flushPromises = async () => {
    for (let i = 0; i < 10; i += 1) await Promise.resolve()
}

const { messageMock } = vi.hoisted(() => {
    return {
        messageMock: {
            error: vi.fn(),
            success: vi.fn(),
            warn: vi.fn(),
            destroy: vi.fn()
        }
    }
})

vi.mock('ant-design-vue', async () => {
    const { defineComponent, h } = await import('vue')

    const simple = (name: string, tag = 'div') =>
        defineComponent({
            name,
            inheritAttrs: false,
            setup(_props, { slots, attrs }) {
                return () => h(tag, attrs, slots.default?.())
            }
        })

    const Row = simple('ARow')
    const Col = simple('ACol')
    const ConfigProvider = simple('AConfigProvider')
    const Empty = simple('AEmpty')
    const Popconfirm = defineComponent({
        name: 'APopconfirm',
        props: {
            onConfirm: { type: Function as any, default: undefined }
        },
        setup(props, { slots }) {
            return () =>
                h(
                    'div',
                    {
                        'data-testid': 'popconfirm',
                        onClick: () => props.onConfirm && props.onConfirm()
                    },
                    slots.default?.()
                )
        }
    })

    const Button = defineComponent({
        name: 'AButton',
        inheritAttrs: false,
        setup(_props, { slots, attrs }) {
            return () => h('button', { type: 'button', ...attrs }, slots.default?.())
        }
    })

    const Input = defineComponent({
        name: 'AInput',
        inheritAttrs: false,
        props: {
            value: { type: [String, Number] as any, default: '' }
        },
        emits: ['update:value'],
        setup(props, { emit, attrs }) {
            return () =>
                h('input', {
                    ...attrs,
                    value: props.value as any,
                    onInput: (e: any) => emit('update:value', e?.target?.value)
                })
        }
    })

    const Table = defineComponent({
        name: 'ATable',
        props: {
            columns: { type: Array as any, default: () => [] },
            dataSource: { type: Array as any, default: () => [] },
            rowSelection: { type: Object as any, default: () => ({}) }
        },
        setup(props) {
            return () =>
                h(
                    'div',
                    {
                        'data-testid': 'table',
                        'data-count': (props.dataSource as any[]).length,
                        onClick: () => {
                            const rows = (props.dataSource as any[]) || []
                            const ids = rows.map((r: any) => r.id ?? r.key)
                            const rs: any = props.rowSelection || {}
                            if (typeof rs.onChange === 'function') rs.onChange(ids, rows)
                        }
                    },
                    (props.dataSource as any[]).map((row: any) =>
                        h(
                            'div',
                            { 'data-row-id': row.id },
                            (props.columns as any[]).map((col: any) => {
                                if (typeof col.customRender === 'function') {
                                    return col.customRender({ record: row })
                                }
                                return null
                            })
                        )
                    )
                )
        }
    })

    const Form = defineComponent({
        name: 'AForm',
        props: {
            model: { type: Object as any, default: () => ({}) },
            rules: { type: Object as any, default: () => ({}) }
        },
        setup(props, { slots, expose }) {
            const runRules = async () => {
                const rules = props.rules || {}
                const model = props.model || {}
                const keys = Object.keys(rules)
                for (const key of keys) {
                    const arr = rules[key] || []
                    for (const rule of arr) {
                        if (typeof rule?.validator === 'function') {
                            await rule.validator(rule, (model as any)[key])
                        } else if (
                            rule?.required &&
                            ((model as any)[key] === null ||
                                (model as any)[key] === undefined ||
                                (model as any)[key] === '')
                        ) {
                            throw new Error(rule?.message || 'required')
                        }
                    }
                }
            }

            const validate = async () => {
                await runRules()
                return true
            }

            expose({ validate })
            return () => h('form', { 'data-testid': 'form' }, slots.default?.())
        }
    })

    const FormItem = defineComponent({
        name: 'AFormItem',
        props: {
            name: { type: String, default: '' }
        },
        setup(props, { slots }) {
            return () =>
                h('div', { 'data-testid': 'form-item', 'data-name': props.name }, slots.default?.())
        }
    })

    const TreeSelect = defineComponent({
        name: 'ATreeSelect',
        props: {
            value: { type: [String, Number] as any, default: null }
        },
        emits: ['update:value'],
        setup(props, { emit, attrs }) {
            return () =>
                h('input', {
                    ...attrs,
                    value: props.value as any,
                    onInput: (e: any) => emit('update:value', e?.target?.value)
                })
        }
    })

    const Drawer = simple('ADrawer', 'section')
    const RadioGroup = simple('ARadioGroup')
    const InputNumber = simple('AInputNumber', 'input')
    const Switch = simple('ASwitch', 'input')
    const Tag = simple('ATag', 'span')
    const Tabs = simple('ATabs')
    const TabPane = simple('ATabPane')
    const Tooltip = simple('ATooltip')
    const RadioButton = simple('ARadioButton')
    const Popover = simple('APopover')

    return {
        Row,
        Col,
        ConfigProvider,
        Empty,
        Popconfirm,
        Button,
        message: messageMock,
        RowProps: {},
        ColProps: {},
        Input,
        Table,
        Form,
        FormItem,
        TreeSelect,
        Drawer,
        RadioGroup,
        InputNumber,
        Switch,
        Tag,
        Tabs,
        TabPane,
        Tooltip,
        RadioButton,
        Popover
    }
})

vi.mock('@ant-design/icons-vue', async () => {
    const { defineComponent, h } = await import('vue')

    const IconStub = (name: string) =>
        defineComponent({
            name,
            setup() {
                return () => h('i', { 'data-testid': name })
            }
        })

    return new Proxy(
        {
            DeleteOutlined: IconStub('DeleteOutlined'),
            EditOutlined: IconStub('EditOutlined'),
            FormOutlined: IconStub('FormOutlined'),
            MoreOutlined: IconStub('MoreOutlined'),
            MessageOutlined: IconStub('MessageOutlined'),
            NodeExpandOutlined: IconStub('NodeExpandOutlined'),
            AimOutlined: IconStub('AimOutlined'),
            QuestionCircleOutlined: IconStub('QuestionCircleOutlined')
        },
        {
            get(target, p: string) {
                if (!Reflect.has(target, p)) {
                    // 为所有图标名返回通用占位组件，避免运行时报错
                    ;(target as any)[p] = IconStub(p)
                }
                return (target as any)[p]
            }
        }
    )
})

vi.mock('vue3-colorpicker', async () => {
    const { defineComponent, h } = await import('vue')
    const ColorPicker = defineComponent({
        name: 'ColorPicker',
        setup() {
            return () => h('div', { 'data-testid': 'color-picker' })
        }
    })
    return { ColorPicker }
})

const MiModalStub = defineComponent({
    name: 'MiModal',
    props: {
        open: { type: Boolean, default: false }
    },
    setup(props, { slots }) {
        return () =>
            props.open ? h('div', { 'data-testid': 'mi-modal' }, slots.default?.()) : null
    }
})

const MiDropdownStub = defineComponent({
    name: 'MiDropdown',
    props: {
        items: { type: Array as any, default: () => [] }
    },
    setup(props, { slots }) {
        return () =>
            h(
                'div',
                { 'data-testid': 'mi-dropdown', 'data-count': (props.items as any[]).length },
                slots.default?.()
            )
    }
})
/* eslint-enable vue/one-component-per-file */

describe('MiAppsMenu', () => {
    const wrappers: VueWrapper[] = []

    beforeEach(() => {
        vi.useFakeTimers()
        messageMock.error.mockClear()
        messageMock.success.mockClear()
        messageMock.warn.mockClear()
        messageMock.destroy.mockClear()
    })

    afterEach(() => {
        wrappers.splice(0).forEach((w) => w.unmount())
        vi.runOnlyPendingTimers()
        vi.useRealTimers()
        vi.restoreAllMocks()
        document.body.innerHTML = ''
    })

    test('data 模式：使用本地数据渲染表格且不会调用 getMenusAction', async () => {
        const getSpy = vi.spyOn($request, 'get').mockResolvedValue({ ret: { code: 200 } } as any)

        const data: any[] = [
            {
                id: 1,
                pid: 0,
                type: 1,
                name: 'dashboard',
                title: '仪表盘',
                path: '/dashboard',
                page: 'dashboard',
                icon: 'DashboardOutlined',
                weight: 1,
                lang: 'dashboard',
                children: []
            }
        ]

        const wrapper = mount(MiAppsMenu, {
            props: {
                data,
                getMenusAction: '/v1/menus'
            },
            global: {
                stubs: {
                    MiModal: MiModalStub,
                    MiDropdown: MiDropdownStub
                }
            },
            attachTo: document.body
        })
        wrappers.push(wrapper)

        await flushPromises()
        await nextTick()

        const table = wrapper.find('[data-testid="table"]')
        expect(table.exists()).toBe(true)
        expect(table.attributes('data-count')).toBe(String(data.length))
        expect(getSpy).not.toHaveBeenCalled()
    })

    test('getMenusAction(string)：挂载时会调用接口并通过 afterGetMenus 暴露结果', async () => {
        const resp: ResponseData = {
            ret: { code: 200, message: 'ok' },
            data: [
                {
                    id: 1,
                    pid: 0,
                    type: 1,
                    name: 'dashboard',
                    title: '仪表盘',
                    path: '/dashboard',
                    page: 'dashboard',
                    icon: 'DashboardOutlined',
                    weight: 1,
                    lang: 'dashboard',
                    children: []
                }
            ],
            total: 1
        }
        const getSpy = vi.spyOn($request, 'get').mockResolvedValue(resp as any)

        const wrapper = mount(MiAppsMenu, {
            props: {
                getMenusAction: '/v1/menus',
                getMenusMethod: 'get'
            },
            global: {
                stubs: {
                    MiModal: MiModalStub,
                    MiDropdown: MiDropdownStub
                }
            },
            attachTo: document.body
        })
        wrappers.push(wrapper)

        await flushPromises()
        await nextTick()

        expect(getSpy).toHaveBeenCalled()
        expect(wrapper.emitted().afterGetMenus).toBeTruthy()
        const table = wrapper.find('[data-testid="table"]')
        expect(table.attributes('data-count')).toBe('1')
    })

    test('getMenusAction 返回非 200 code 时会调用 message.error', async () => {
        const resp: any = { ret: { code: 500, message: 'err' }, data: [] }
        vi.spyOn($request, 'get').mockResolvedValue(resp)

        const wrapper = mount(MiAppsMenu, {
            props: {
                getMenusAction: '/v1/menus',
                getMenusMethod: 'get'
            },
            global: {
                stubs: {
                    MiModal: MiModalStub,
                    MiDropdown: MiDropdownStub
                }
            },
            attachTo: document.body
        })
        wrappers.push(wrapper)

        await flushPromises()
        await nextTick()

        expect(messageMock.error).toHaveBeenCalled()
    })

    test('批量删除：未选择任何行时点击按钮会提示错误', async () => {
        const wrapper = mount(MiAppsMenu, {
            props: {
                getMenusAction: undefined
            },
            global: {
                stubs: {
                    MiModal: MiModalStub,
                    MiDropdown: MiDropdownStub
                }
            },
            attachTo: document.body
        })
        wrappers.push(wrapper)

        await flushPromises()
        await nextTick()

        const actionRow = wrapper.find(`.${styled.action}`)
        expect(actionRow.exists()).toBe(true)
        const pop = actionRow.find('[data-testid="popconfirm"]')
        expect(pop.exists()).toBe(true)

        await pop.trigger('click')
        await nextTick()

        expect(messageMock.error).toHaveBeenCalled()
    })

    test('批量删除：选择行后点击按钮会调用 deleteMenusAction 并触发 afterDeleteMenus', async () => {
        const resp: ResponseData = {
            ret: { code: 200, message: 'ok' },
            data: [],
            total: 0
        }
        const delSpy = vi.spyOn($request, 'delete').mockResolvedValue(resp as any)

        const data: any[] = [
            {
                id: 1,
                pid: 0,
                type: 1,
                name: 'dashboard',
                title: '仪表盘',
                path: '/dashboard',
                page: 'dashboard',
                icon: 'DashboardOutlined',
                weight: 1,
                lang: 'dashboard',
                children: []
            }
        ]

        const wrapper = mount(MiAppsMenu, {
            props: {
                data,
                deleteMenusAction: '/v1/menus'
            },
            global: {
                stubs: {
                    MiModal: MiModalStub,
                    MiDropdown: MiDropdownStub
                }
            },
            attachTo: document.body
        })
        wrappers.push(wrapper)

        await flushPromises()
        await nextTick()

        // 点击表格区域，触发 rowSelection.onChange 选中全部
        const table = wrapper.find('[data-testid="table"]')
        await table.trigger('click')
        await nextTick()

        const actionRow = wrapper.find(`.${styled.action}`)
        const pop = actionRow.find('[data-testid="popconfirm"]')
        await pop.trigger('click')
        await flushPromises()
        await nextTick()

        expect(delSpy).toHaveBeenCalled()
        expect(wrapper.emitted().afterDeleteMenus).toBeTruthy()
        expect(messageMock.success).toHaveBeenCalled()
    })

    test('创建菜单：填写必填项并点击保存会调用 createMenusAction', async () => {
        const postSpy = vi.spyOn($request, 'post').mockResolvedValue({
            ret: { code: 200, message: 'ok' },
            data: null
        } as any)

        const wrapper = mount(MiAppsMenu, {
            props: {
                createMenusAction: '/v1/menus'
            },
            global: {
                stubs: {
                    MiModal: MiModalStub,
                    MiDropdown: MiDropdownStub
                }
            },
            attachTo: document.body
        })
        wrappers.push(wrapper)

        await flushPromises()
        await nextTick()

        // 打开抽屉：操作区第二个按钮为“新增菜单”
        const actionRow = wrapper.find(`.${styled.action}`)
        const buttons = actionRow.findAll('button')
        expect(buttons.length).toBeGreaterThan(1)
        await buttons[1].trigger('click')
        await nextTick()

        // 填写 name/path/page 字段
        const nameInput = wrapper.find('[data-name="name"] input')
        const pathInput = wrapper.find('[data-name="path"] input')
        const pageInput = wrapper.find('[data-name="page"] input')

        await nameInput.setValue('menu-1')
        await pathInput.setValue('/menu-1')
        await pageInput.setValue('menu1')
        await nextTick()

        // 抽屉右上角第二个按钮为保存
        const allButtons = wrapper.findAll('button')
        await allButtons[allButtons.length - 1].trigger('click')
        await flushPromises()
        await nextTick()

        expect(postSpy).toHaveBeenCalled()
        expect(messageMock.success).toHaveBeenCalled()
        expect(wrapper.emitted().afterCreateMenus).toBeTruthy()
    })

    test('编辑菜单：点击编辑后保存会调用 updateMenusAction', async () => {
        const putSpy = vi.spyOn($request, 'put').mockResolvedValue({
            ret: { code: 200, message: 'ok' },
            data: null
        } as any)

        const data: any[] = [
            {
                id: 1,
                pid: 0,
                type: 1,
                name: 'dashboard',
                title: '仪表盘',
                path: '/dashboard',
                page: 'dashboard',
                icon: 'DashboardOutlined',
                weight: 1,
                lang: 'dashboard',
                children: []
            }
        ]

        const wrapper = mount(MiAppsMenu, {
            props: {
                data,
                updateMenusAction: '/v1/menus'
            },
            global: {
                stubs: {
                    MiModal: MiModalStub,
                    MiDropdown: MiDropdownStub
                }
            },
            attachTo: document.body
        })
        wrappers.push(wrapper)

        await flushPromises()
        await nextTick()

        // 操作列第一个按钮为“编辑”
        const actionItems = wrapper.find(`.${styled.actionItems}`)
        expect(actionItems.exists()).toBe(true)
        const editBtn = actionItems.find('button')
        await editBtn.trigger('click')
        await nextTick()

        const allButtons = wrapper.findAll('button')
        await allButtons[allButtons.length - 1].trigger('click')
        await flushPromises()
        await nextTick()

        expect(putSpy).toHaveBeenCalled()
        expect(wrapper.emitted().afterUpdateMenus).toBeTruthy()
    })

    test('checkNameExistAction(function) 返回字符串时阻止保存，不会调用 createMenusAction', async () => {
        const postSpy = vi.spyOn($request, 'post').mockResolvedValue({
            ret: { code: 200, message: 'ok' },
            data: null
        } as any)

        const wrapper = mount(MiAppsMenu, {
            props: {
                createMenusAction: '/v1/menus',
                checkNameExistAction: () => Promise.resolve('duplicated')
            },
            global: {
                stubs: {
                    MiModal: MiModalStub,
                    MiDropdown: MiDropdownStub
                }
            },
            attachTo: document.body
        })
        wrappers.push(wrapper)

        await flushPromises()
        await nextTick()

        const actionRow = wrapper.find(`.${styled.action}`)
        const buttons = actionRow.findAll('button')
        await buttons[1].trigger('click')
        await nextTick()

        const nameInput = wrapper.find('[data-name="name"] input')
        const pathInput = wrapper.find('[data-name="path"] input')
        const pageInput = wrapper.find('[data-name="page"] input')

        await nameInput.setValue('menu-1')
        await pathInput.setValue('/menu-1')
        await pageInput.setValue('menu1')
        await nextTick()

        const allButtons = wrapper.findAll('button')
        await allButtons[allButtons.length - 1].trigger('click')
        await flushPromises()
        await nextTick()

        expect(postSpy).not.toHaveBeenCalled()
    })
})
