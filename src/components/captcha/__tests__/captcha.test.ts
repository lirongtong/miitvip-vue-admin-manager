import { mount, type VueWrapper } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import { defineComponent, h, nextTick } from 'vue'
import MiCaptcha from '../Captcha'
import styled from '../style/captcha.module.less'
import { $request } from '../../../utils/request'
import { message } from 'ant-design-vue'

const flushPromises = async () => {
    await Promise.resolve()
    await Promise.resolve()
}

/* eslint-disable vue/one-component-per-file */
const MiCaptchaModalStub = defineComponent({
    name: 'MiCaptchaModal',
    props: {
        open: { type: Boolean, default: false },
        verifyParams: { type: Object, default: () => ({}) }
    },
    emits: ['close'],
    setup(props, { emit }) {
        return () =>
            props.open
                ? h('div', { 'data-testid': 'captcha-modal' }, [
                      h(
                          'div',
                          { 'data-testid': 'verify-params' },
                          JSON.stringify(props.verifyParams)
                      ),
                      h(
                          'button',
                          {
                              'data-testid': 'close-success',
                              onClick: () => emit('close', { status: 'success' })
                          },
                          'success'
                      ),
                      h(
                          'button',
                          {
                              'data-testid': 'close-frequently',
                              onClick: () => emit('close', { status: 'frequently' })
                          },
                          'frequently'
                      )
                  ])
                : null
    }
})

const MiLinkStub = defineComponent({
    name: 'MiLink',
    props: { path: { type: String, default: '' } },
    setup(_props, { slots }) {
        return () => h('a', { 'data-testid': 'mi-link' }, slots.default?.())
    }
})
/* eslint-enable vue/one-component-per-file */

describe('MiCaptcha', () => {
    const wrappers: VueWrapper[] = []

    beforeEach(() => {
        vi.useFakeTimers()
        // ant-design-vue message.error 返回 MessageType（可用于关闭），这里返回一个空函数即可
        vi.spyOn(message, 'error').mockImplementation(() => (() => {}) as any)
        document.body.innerHTML = ''
    })

    afterEach(() => {
        wrappers.splice(0).forEach((w) => w.unmount())
        vi.useRealTimers()
        vi.restoreAllMocks()
        document.body.innerHTML = ''
    })

    test('initAction=function 返回 false 会标记 failed，且点击不会打开弹窗', async () => {
        const wrapper = mount(MiCaptcha, {
            props: {
                initAction: async () => false
            },
            global: {
                stubs: { MiCaptchaModal: MiCaptchaModalStub, MiLink: MiLinkStub }
            },
            attachTo: document.body
        })
        wrappers.push(wrapper)

        await nextTick()
        await flushPromises()

        const content = wrapper.find(`.${styled.content}`)
        expect(content.classes()).toContain(styled.failed)

        await content.trigger('click')
        await nextTick()
        expect(wrapper.find('[data-testid="captcha-modal"]').exists()).toBe(false)
    })

    test('initAction=string 成功时会写入 verifyParams.key（当原先没有 key）并 emit init(res)', async () => {
        const getSpy = vi.spyOn($request, 'get').mockResolvedValue({ data: { key: 'k1' } } as any)

        const wrapper = mount(MiCaptcha, {
            props: {
                initAction: '/v1/captcha/init',
                initMethod: 'get',
                verifyParams: {}
            },
            global: {
                stubs: { MiCaptchaModal: MiCaptchaModalStub, MiLink: MiLinkStub }
            },
            attachTo: document.body
        })
        wrappers.push(wrapper)

        await nextTick()
        await flushPromises()

        expect(getSpy).toHaveBeenCalled()
        expect(wrapper.emitted().init).toBeTruthy()

        // 触发打开弹窗（会把 verifyParams 透传给 modal）
        await wrapper.find(`.${styled.content}`).trigger('click')
        await nextTick()

        const modal = document.querySelector('[data-testid="captcha-modal"]')
        expect(modal).toBeTruthy()

        const verify = document.querySelector('[data-testid="verify-params"]')?.textContent || ''
        expect(verify).toContain('"key":"k1"')
    })

    test('checkAction=function 返回 true 时直接 success（不弹窗），并 emit success', async () => {
        const wrapper = mount(MiCaptcha, {
            props: {
                checkAction: async () => true
            },
            global: {
                stubs: { MiCaptchaModal: MiCaptchaModalStub, MiLink: MiLinkStub }
            },
            attachTo: document.body
        })
        wrappers.push(wrapper)

        await nextTick()
        await flushPromises()

        await wrapper.find(`.${styled.content}`).trigger('click')
        await nextTick()
        await flushPromises()

        // handleCaptchaSuccess 内部 setTimeout(0) 才置 success 状态
        vi.runOnlyPendingTimers()
        await nextTick()

        expect(wrapper.emitted().success).toBeTruthy()
        expect(wrapper.find(`.${styled.success}`).exists()).toBe(true)
        expect(wrapper.find('[data-testid="captcha-modal"]').exists()).toBe(false)
    })

    test('modal 回传 frequently 会 reset 并提示 message.error', async () => {
        const wrapper = mount(MiCaptcha, {
            props: {
                maxTries: 3
            },
            global: {
                stubs: { MiCaptchaModal: MiCaptchaModalStub, MiLink: MiLinkStub }
            },
            attachTo: document.body
        })
        wrappers.push(wrapper)

        await nextTick()
        await flushPromises()

        await wrapper.find(`.${styled.content}`).trigger('click')
        await nextTick()

        const btn = document.querySelector('[data-testid="close-frequently"]') as HTMLButtonElement
        expect(btn).toBeTruthy()
        btn.click()
        await nextTick()

        expect(message.error).toHaveBeenCalled()
    })
})
