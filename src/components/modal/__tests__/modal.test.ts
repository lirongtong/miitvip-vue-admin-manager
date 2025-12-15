/* eslint-disable vue/one-component-per-file */
import { mount, type VueWrapper } from '@vue/test-utils'
import { afterEach, describe, expect, test, vi } from 'vitest'
import { h, nextTick } from 'vue'
import MiModal from '../Modal'
import popupStyled from '../style/popup.module.less'

const { antModalMock } = vi.hoisted(() => {
    return {
        antModalMock: {
            info: vi.fn(() => ({ destroy: vi.fn(), update: vi.fn() })),
            success: vi.fn(() => ({ destroy: vi.fn(), update: vi.fn() })),
            error: vi.fn(() => ({ destroy: vi.fn(), update: vi.fn() })),
            warning: vi.fn(() => ({ destroy: vi.fn(), update: vi.fn() })),
            confirm: vi.fn(() => ({ destroy: vi.fn(), update: vi.fn() })),
            destroyAll: vi.fn()
        }
    }
})

vi.mock('ant-design-vue', async () => {
    const { defineComponent, h } = await import('vue')

    const Button = defineComponent({
        name: 'AButton',
        inheritAttrs: false,
        setup(_props, { slots, attrs }) {
            return () => h('button', { type: 'button', ...attrs }, slots.default?.())
        }
    })

    return {
        Button,
        Modal: antModalMock
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

    return {
        CloseOutlined: IconStub('CloseOutlined'),
        QuestionCircleOutlined: IconStub('QuestionCircleOutlined')
    }
})

describe('MiModal', () => {
    const wrappers: VueWrapper[] = []

    afterEach(() => {
        wrappers.splice(0).forEach((w) => w.unmount())
        vi.restoreAllMocks()
        document.body.innerHTML = ''
    })

    test('container=false：直接渲染弹窗内容；点击遮罩区域（wrap）会触发 update:open=false 和 cancel', async () => {
        const wrapper = mount(MiModal, {
            props: {
                open: true,
                container: false
            },
            slots: {
                default: () => h('div', { 'data-testid': 'content' }, 'C')
            },
            attachTo: document.body
        })
        wrappers.push(wrapper)

        await nextTick()
        expect(wrapper.find('[data-testid="content"]').exists()).toBe(true)

        const wrap = wrapper.find(`.${popupStyled.inner}`)
        expect(wrap.exists()).toBe(true)

        await wrap.trigger('click')
        await nextTick()

        expect(wrapper.emitted()['update:open']?.[0]?.[0]).toBe(false)
        expect(wrapper.emitted().cancel).toBeTruthy()
    })

    test('closable=false：不会渲染取消按钮/关闭按钮，点击遮罩也不会触发关闭', async () => {
        const wrapper = mount(MiModal, {
            props: {
                open: true,
                closable: false,
                container: false
            },
            slots: {
                default: () => h('div', { 'data-testid': 'content' }, 'C')
            },
            attachTo: document.body
        })
        wrappers.push(wrapper)

        await nextTick()
        expect(wrapper.find(`.${popupStyled.close}`).exists()).toBe(false)

        const wrap = wrapper.find(`.${popupStyled.inner}`)
        await wrap.trigger('click')
        await nextTick()

        expect(wrapper.emitted()['update:open']).toBeFalsy()
        expect(wrapper.emitted().cancel).toBeFalsy()
    })

    test('destroyOnClose=true：open=false 时不渲染子内容；open=true 时渲染', async () => {
        const wrapper = mount(MiModal, {
            props: {
                open: false,
                destroyOnClose: true,
                container: false
            },
            slots: {
                default: () => h('div', { 'data-testid': 'content' }, 'C')
            },
            attachTo: document.body
        })
        wrappers.push(wrapper)

        await nextTick()
        expect(wrapper.find('[data-testid="content"]').exists()).toBe(false)

        await wrapper.setProps({ open: true })
        await nextTick()
        expect(wrapper.find('[data-testid="content"]').exists()).toBe(true)

        await wrapper.setProps({ open: false })
        await nextTick()
        expect(wrapper.find('[data-testid="content"]').exists()).toBe(false)
    })

    test('container=string：支持不带 # 的 id，并 teleport 到指定容器', async () => {
        const host = document.createElement('div')
        host.id = 'app'
        document.body.appendChild(host)

        const wrapper = mount(MiModal, {
            props: {
                open: true,
                container: 'app'
            },
            slots: {
                default: () => h('div', { 'data-testid': 'teleported' }, 'T')
            },
            attachTo: document.body
        })
        wrappers.push(wrapper)

        await nextTick()
        expect(
            document.querySelector('#app')?.querySelector('[data-testid="teleported"]')
        ).toBeTruthy()
    })

    test('快捷方法：success/confirm 会透传合并后的配置到 AntModal', async () => {
        const s = MiModal.success({ content: 'ok' })
        expect(antModalMock.success).toHaveBeenCalled()
        const successCfg = (antModalMock.success as any).mock.calls[0]?.[0] as any
        expect(successCfg).toBeTruthy()
        expect(successCfg.content).toBe('ok')
        expect(String(successCfg.class)).toContain('mi-modal-quick-success')
        expect(s).toBeTruthy()

        const c = MiModal.confirm({ content: 'c' })
        expect(antModalMock.confirm).toHaveBeenCalled()
        const confirmCfg = (antModalMock.confirm as any).mock.calls[0]?.[0] as any
        expect(confirmCfg).toBeTruthy()
        expect(confirmCfg.content).toBe('c')
        expect(confirmCfg.icon).toBeTruthy()
        expect(confirmCfg.okText).toBeTruthy()
        expect(confirmCfg.cancelText).toBeTruthy()
        expect(String(confirmCfg.class)).toContain('mi-modal-quick-confirm')
        expect(c).toBeTruthy()
    })
})
