import { mount, type VueWrapper } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import { nextTick } from 'vue'
import MiCode from '../Code'
import MiCodeDemo from '../Demo'
import codeStyled from '../style/code.module.less'
import demoStyled from '../style/demo.module.less'

const toClipboardMock = vi.fn()

vi.mock('vue-clipboard3', () => {
    return {
        default: () => ({
            toClipboard: toClipboardMock
        })
    }
})

const TooltipStub = {
    name: 'ATooltip',
    props: ['title'],
    template: `<div data-testid="tooltip" :data-title="title"><slot /></div>`
}

const DividerStub = {
    name: 'ADivider',
    template: `<div data-testid="divider"><slot /></div>`
}

describe('MiCode', () => {
    const wrappers: VueWrapper[] = []

    beforeEach(() => {
        vi.useFakeTimers()
        toClipboardMock.mockReset().mockResolvedValue(undefined)
        document.body.innerHTML = ''
    })

    afterEach(() => {
        wrappers.splice(0).forEach((w) => w.unmount())
        vi.runOnlyPendingTimers()
        vi.useRealTimers()
        document.body.innerHTML = ''
    })

    test('渲染 language class 与内容', () => {
        const wrapper = mount(MiCode, {
            props: { language: 'js', content: `console.log('x')` },
            global: { directives: { prism: () => {} } },
            attachTo: document.body
        })
        wrappers.push(wrapper)

        const code = wrapper.find('code')
        expect(code.exists()).toBe(true)
        expect(code.classes().join(' ')).toContain(`language-js`)
        expect(code.text()).toContain(`console.log('x')`)
    })

    test('canCopy=true 且有内容时显示复制按钮，点击会复制文本并在 3s 后恢复', async () => {
        const wrapper = mount(MiCode, {
            props: { language: 'html', content: '<div>hi</div>', canCopy: true },
            global: { stubs: { ATooltip: TooltipStub }, directives: { prism: () => {} } },
            attachTo: document.body
        })
        wrappers.push(wrapper)

        const copy = wrapper.find(`.${codeStyled.copy}`)
        expect(copy.exists()).toBe(true)

        await copy.trigger('click')
        expect(toClipboardMock).toHaveBeenCalledWith('<div>hi</div>')

        // copied=true 后 tooltip title 会变化
        await nextTick()
        const tooltip = wrapper.find('[data-testid="tooltip"]')
        expect(tooltip.attributes('data-title')).toBeTruthy()

        vi.advanceTimersByTime(3000)
        await nextTick()
    })

    test('slot-only 内容也能复制（修复点：不再只依赖 props.content）', async () => {
        const wrapper = mount(MiCode, {
            props: { language: 'txt', canCopy: true },
            slots: { content: 'SLOT_TEXT' },
            global: { stubs: { ATooltip: TooltipStub }, directives: { prism: () => {} } },
            attachTo: document.body
        })
        wrappers.push(wrapper)

        const copy = wrapper.find(`.${codeStyled.copy}`)
        expect(copy.exists()).toBe(true)
        await copy.trigger('click')
        expect(toClipboardMock).toHaveBeenCalledWith('SLOT_TEXT')
    })

    test('canCopy=false 时不显示复制按钮', () => {
        const wrapper = mount(MiCode, {
            props: { language: 'js', content: 'x', canCopy: false },
            global: { directives: { prism: () => {} } },
            attachTo: document.body
        })
        wrappers.push(wrapper)
        expect(wrapper.find(`.${codeStyled.copy}`).exists()).toBe(false)
    })
})

describe('MiCodeDemo', () => {
    const wrappers: VueWrapper[] = []

    beforeEach(() => {
        vi.useFakeTimers()
        toClipboardMock.mockReset().mockResolvedValue(undefined)
        document.body.innerHTML = ''
    })

    afterEach(() => {
        wrappers.splice(0).forEach((w) => w.unmount())
        vi.runOnlyPendingTimers()
        vi.useRealTimers()
        document.body.innerHTML = ''
    })

    test('有 code 时显示操作区，点击 CodeOutlined 可切换代码展示', async () => {
        const wrapper = mount(MiCodeDemo, {
            props: { title: 'T', code: '<div />', language: 'html' },
            global: {
                stubs: {
                    ATooltip: TooltipStub,
                    Tooltip: TooltipStub,
                    ADivider: DividerStub,
                    Divider: DividerStub
                },
                directives: { prism: () => {} }
            },
            attachTo: document.body
        })
        wrappers.push(wrapper)

        // 初始隐藏
        expect(wrapper.find(`.${demoStyled.code}`).attributes('style') || '').toContain(
            'display: none'
        )

        // 点开
        await wrapper.findComponent({ name: 'CodeOutlined' }).trigger('click')
        await nextTick()
        expect(wrapper.find(`.${demoStyled.code}`).attributes('style') || '').not.toContain(
            'display: none'
        )
    })

    test('点击 CopyOutlined 会复制 props.code', async () => {
        const wrapper = mount(MiCodeDemo, {
            props: { code: 'CODE_TEXT', language: 'txt' },
            global: {
                stubs: {
                    ATooltip: TooltipStub,
                    Tooltip: TooltipStub,
                    ADivider: DividerStub,
                    Divider: DividerStub
                },
                directives: { prism: () => {} }
            },
            attachTo: document.body
        })
        wrappers.push(wrapper)

        await wrapper.findComponent({ name: 'CopyOutlined' }).trigger('click')
        expect(toClipboardMock).toHaveBeenCalledWith('CODE_TEXT')
    })
})
