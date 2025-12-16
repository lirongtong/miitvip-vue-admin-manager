/* eslint-disable vue/one-component-per-file */
import { mount, type VueWrapper } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import { defineComponent, h, nextTick } from 'vue'
import MiAppsLanguage from '../index'
import styled from '../style/language.module.less'
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

    const Textarea = defineComponent({
        name: 'ATextarea',
        inheritAttrs: false,
        props: {
            value: { type: String as any, default: '' }
        },
        emits: ['update:value'],
        setup(props, { emit, attrs }) {
            return () =>
                h('textarea', {
                    ...attrs,
                    value: props.value,
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

            const clearValidate = () => true
            const resetFields = () => true

            expose({ validate, clearValidate, resetFields })
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

    const Select = defineComponent({
        name: 'ASelect',
        props: {
            value: { type: [String, Number, Array] as any, default: undefined }
        },
        emits: ['update:value', 'change'],
        setup(props, { emit, slots, attrs }) {
            return () =>
                h(
                    'select',
                    {
                        ...attrs,
                        value: props.value as any,
                        onChange: (e: any) => {
                            emit('update:value', e?.target?.value)
                            emit('change', e?.target?.value)
                        }
                    },
                    slots.default?.()
                )
        }
    })

    const SelectOption = defineComponent({
        name: 'ASelectOption',
        props: {
            value: { type: [String, Number] as any, required: true }
        },
        setup(props, { slots }) {
            return () => h('option', { value: props.value as any }, slots.default?.())
        }
    })

    const RadioGroup = simple('ARadioGroup')
    const Tooltip = simple('ATooltip')
    const Tag = simple('ATag', 'span')
    const Tabs = simple('ATabs')
    const TabPane = simple('ATabPane')
    const Popover = simple('APopover')

    return {
        Row,
        ConfigProvider,
        Empty,
        Popconfirm,
        Button,
        message: messageMock,
        Input,
        Textarea,
        Table,
        Form,
        FormItem,
        Select,
        SelectOption,
        RadioGroup,
        Tooltip,
        Tag,
        Tabs,
        TabPane,
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
            CheckOutlined: IconStub('CheckOutlined'),
            SearchOutlined: IconStub('SearchOutlined'),
            ReloadOutlined: IconStub('ReloadOutlined'),
            IssuesCloseOutlined: IconStub('IssuesCloseOutlined'),
            WarningFilled: IconStub('WarningFilled'),
            AppstoreAddOutlined: IconStub('AppstoreAddOutlined'),
            GlobalOutlined: IconStub('GlobalOutlined'),
            PlusOutlined: IconStub('PlusOutlined'),
            ExclamationCircleOutlined: IconStub('ExclamationCircleOutlined'),
            CloseCircleFilled: IconStub('CloseCircleFilled'),
            StopOutlined: IconStub('StopOutlined'),
            CheckCircleOutlined: IconStub('CheckCircleOutlined'),
            CopyOutlined: IconStub('CopyOutlined')
        },
        {
            get(target, p: string) {
                if (!Reflect.has(target, p)) {
                    ;(target as any)[p] = IconStub(p)
                }
                return (target as any)[p]
            }
        }
    )
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
/* eslint-enable vue/one-component-per-file */

describe('MiAppsLanguage', () => {
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

    test('data/category 本地模式：使用本地数据渲染自定义语言表格，不会调用接口', async () => {
        const getSpy = vi.spyOn($request, 'get').mockResolvedValue({ ret: { code: 200 } } as any)

        const category = [{ id: 1, key: 'zh-cn', language: '简体中文', is_default: 1 }] as any

        const data = [
            {
                id: 1,
                cid: 1,
                mid: 0,
                key: 'hello',
                language: '你好',
                status: 1
            }
        ] as any

        const wrapper = mount(MiAppsLanguage, {
            props: {
                category,
                data
            },
            global: {
                stubs: {
                    MiModal: MiModalStub
                },
                provide: {
                    setLocale: vi.fn()
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

    test('getCategory/getContent/getModule(string)：挂载时会依次调用接口并透出事件', async () => {
        const categoryResp: ResponseData = {
            ret: { code: 200, message: 'ok' },
            data: [{ id: 1, key: 'zh-cn', language: '简体中文', is_default: 1 }]
        }
        const contentResp: ResponseData = {
            ret: { code: 200, message: 'ok' },
            data: [
                {
                    id: 1,
                    cid: 1,
                    mid: 0,
                    key: 'hello',
                    language: '你好',
                    status: 1
                }
            ],
            total: 1
        }
        const moduleResp: ResponseData = {
            ret: { code: 200, message: 'ok' },
            data: []
        }

        const getSpy = vi.spyOn($request, 'get').mockImplementation((url: string) => {
            if (url === '/category') return Promise.resolve(categoryResp as any)
            if (url === '/content') return Promise.resolve(contentResp as any)
            if (url === '/modules') return Promise.resolve(moduleResp as any)
            return Promise.resolve({ ret: { code: 200 } } as any)
        })

        const wrapper = mount(MiAppsLanguage, {
            props: {
                getCategoryAction: '/category',
                getContentAction: '/content',
                getModuleAction: '/modules'
            },
            global: {
                stubs: {
                    MiModal: MiModalStub
                },
                provide: {
                    setLocale: vi.fn()
                }
            },
            attachTo: document.body
        })
        wrappers.push(wrapper)

        await flushPromises()
        await nextTick()

        expect(getSpy).toHaveBeenCalled()
        expect(wrapper.emitted().afterGetCategory).toBeTruthy()
        expect(wrapper.emitted().afterGetContent).toBeTruthy()
        expect(wrapper.emitted().afterGetModule).toBeTruthy()

        const table = wrapper.find('[data-testid="table"]')
        expect(table.attributes('data-count')).toBe('1')
    })

    test('创建语系：填写必填项并保存会调用 createCategoryAction 并触发 afterCreateCategory', async () => {
        const postSpy = vi.spyOn($request, 'post').mockResolvedValue({
            ret: { code: 200, message: 'ok' },
            data: { id: 1 }
        } as any)

        const wrapper = mount(MiAppsLanguage, {
            props: {
                createCategoryAction: '/category'
            },
            global: {
                stubs: {
                    MiModal: MiModalStub
                },
                provide: {
                    setLocale: vi.fn()
                }
            },
            attachTo: document.body
        })
        wrappers.push(wrapper)

        await flushPromises()
        await nextTick()

        // 打开语系管理，再点“创建”按钮
        const tabs = wrapper.findAll(`.${styled.categoriesItem}`)
        expect(tabs.length).toBeGreaterThan(0)
        const management = tabs[tabs.length - 1]
        await management.trigger('click')
        await nextTick()

        const modal = wrapper.find('[data-testid="mi-modal"]')
        expect(modal.exists()).toBe(true)

        const createBtn = modal.find('button')
        await createBtn.trigger('click')
        await nextTick()

        const keyInput = wrapper.find('[data-name="key"] input')
        const langInput = wrapper.find('[data-name="language"] input')

        await keyInput.setValue('zh-cn')
        await langInput.setValue('简体中文')
        await nextTick()

        const allButtons = wrapper.findAll('button')
        await allButtons[allButtons.length - 1].trigger('click')
        await flushPromises()
        await nextTick()

        expect(postSpy).toHaveBeenCalled()
        expect(wrapper.emitted().afterCreateCategory).toBeTruthy()
        expect(messageMock.success).toHaveBeenCalled()
    })

    test('创建语言项：在自定义语系下新增内容会调用 createContentAction 并触发 afterCreateContent', async () => {
        const categoryResp: ResponseData = {
            ret: { code: 200, message: 'ok' },
            data: [{ id: 1, key: 'zh-cn', language: '简体中文', is_default: 1 }]
        }
        const contentResp: ResponseData = {
            ret: { code: 200, message: 'ok' },
            data: [],
            total: 0
        }

        vi.spyOn($request, 'get')
            .mockResolvedValueOnce(categoryResp as any)
            .mockResolvedValueOnce(contentResp as any)

        const postSpy = vi.spyOn($request, 'post').mockResolvedValue({
            ret: { code: 200, message: 'ok' },
            data: null
        } as any)

        const wrapper = mount(MiAppsLanguage, {
            props: {
                getCategoryAction: '/category',
                getContentAction: '/content',
                createContentAction: '/content'
            },
            global: {
                stubs: {
                    MiModal: MiModalStub
                },
                provide: {
                    setLocale: vi.fn()
                }
            },
            attachTo: document.body
        })
        wrappers.push(wrapper)

        await flushPromises()
        await nextTick()

        const actionRow = wrapper.find(`.${styled.search}`)
        const buttons = actionRow.findAll('button')
        expect(buttons.length).toBeGreaterThan(1)

        // 新增语言项
        await buttons[1].trigger('click')
        await nextTick()

        const keyInput = wrapper.find('[data-name="key"] input')
        const valueInput = wrapper.find('[data-name="language"] textarea')

        await keyInput.setValue('hello')
        await valueInput.setValue('你好')
        await nextTick()

        const allButtons = wrapper.findAll('button')
        await allButtons[allButtons.length - 1].trigger('click')
        await flushPromises()
        await nextTick()

        expect(postSpy).toHaveBeenCalled()
        expect(wrapper.emitted().afterCreateContent).toBeTruthy()
        expect(messageMock.success).toHaveBeenCalled()
    })

    test('批量删除：未选中任何语言项时点击删除会提示错误', async () => {
        const wrapper = mount(MiAppsLanguage, {
            props: {
                getCategoryAction: undefined,
                getContentAction: undefined
            },
            global: {
                stubs: {
                    MiModal: MiModalStub
                },
                provide: {
                    setLocale: vi.fn()
                }
            },
            attachTo: document.body
        })
        wrappers.push(wrapper)

        await flushPromises()
        await nextTick()

        const actionRow = wrapper.find(`.${styled.search}`)
        const buttons = actionRow.findAll('button')
        expect(buttons.length).toBeGreaterThan(0)

        // 最后一个按钮是批量删除
        const deleteBtn = buttons[buttons.length - 1]
        await deleteBtn.trigger('click')
        await nextTick()

        const pop = wrapper.find('[data-testid="popconfirm"]')
        await pop.trigger('click')
        await nextTick()

        expect(messageMock.error).toHaveBeenCalled()
    })

    test('更新语言项状态：选择行后更新状态会调用 updateContentStatusAction 并触发 afterUpdateContentStatus', async () => {
        const category = [{ id: 1, key: 'zh-cn', language: '简体中文', is_default: 1 }] as any
        const data = [
            {
                id: 1,
                cid: 1,
                mid: 0,
                key: 'hello',
                language: '你好',
                status: 1
            }
        ] as any

        const putSpy = vi.spyOn($request, 'put').mockResolvedValue({
            ret: { code: 200, message: 'ok' },
            data: null
        } as any)

        const wrapper = mount(MiAppsLanguage, {
            props: {
                category,
                data,
                updateContentStatusAction: '/content/status'
            },
            global: {
                stubs: {
                    MiModal: MiModalStub
                },
                provide: {
                    setLocale: vi.fn()
                }
            },
            attachTo: document.body
        })
        wrappers.push(wrapper)

        await flushPromises()
        await nextTick()

        const table = wrapper.find('[data-testid="table"]')
        await table.trigger('click')
        await nextTick()

        const actionRow = wrapper.find(`.${styled.search}`)
        const buttons = actionRow.findAll('button')
        // 状态按钮在“新增”之后
        const statusBtn = buttons[2]
        await statusBtn.trigger('click')
        await nextTick()

        const pop = wrapper.find('[data-testid="popconfirm"]')
        await pop.trigger('click')
        await flushPromises()
        await nextTick()

        expect(putSpy).toHaveBeenCalled()
        expect(wrapper.emitted().afterUpdateContentStatus).toBeTruthy()
        expect(messageMock.success).toHaveBeenCalled()
    })
})
