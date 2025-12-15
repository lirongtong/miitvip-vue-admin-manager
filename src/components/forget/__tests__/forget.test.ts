import { mount, type VueWrapper } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import { defineComponent, h, nextTick } from 'vue'
import { createRouter, createMemoryHistory } from 'vue-router'
import MiForget from '../Forget'
import styled from '../style/forget.module.less'
import { $request } from '../../../utils/request'
import { $g } from '../../../utils/global'
import { $storage } from '../../../utils/storage'

const flushPromises = async () => {
    await Promise.resolve()
    await Promise.resolve()
}

const { formState, messageMock } = vi.hoisted(() => {
    return {
        formState: { forceReject: null as string | null },
        messageMock: {
            error: vi.fn(),
            success: vi.fn()
        }
    }
})

vi.mock('ant-design-vue', async () => {
    const { defineComponent, h } = await import('vue')

    // eslint-disable-next-line vue/one-component-per-file
    const Form = defineComponent({
        name: 'AForm',
        props: {
            model: { type: Object as any, default: () => ({}) },
            rules: { type: Object as any, default: () => ({}) }
        },
        setup(props, { slots, expose }) {
            const runRules = async (names?: string[]) => {
                if (formState.forceReject) throw new Error(formState.forceReject)

                const rules = props.rules || {}
                const model = props.model || {}
                const keys = names && names.length > 0 ? names : Object.keys(rules)

                for (const key of keys) {
                    const arr = rules?.[key] || []
                    for (const rule of arr) {
                        if (typeof rule?.validator === 'function') {
                            await rule.validator(rule, model?.[key])
                        } else if (
                            rule?.required &&
                            (model?.[key] === null ||
                                model?.[key] === undefined ||
                                model?.[key] === '')
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

            const validateFields = async (names: string[]) => {
                await runRules(names)
                return true
            }

            expose({ validate, validateFields })
            return () => h('form', { 'data-testid': 'form' }, slots.default?.())
        }
    })

    // eslint-disable-next-line vue/one-component-per-file
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

    // eslint-disable-next-line vue/one-component-per-file
    const Input = defineComponent({
        name: 'AInput',
        inheritAttrs: false,
        props: {
            value: { type: [String, Number], default: '' },
            type: { type: String, default: 'text' },
            suffix: { type: null, default: null },
            prefix: { type: null, default: null }
        },
        emits: ['update:value'],
        setup(props, { emit, attrs }) {
            const { class: cls, prefix: _prefix, ...restAttrs } = attrs as any
            return () =>
                h('div', { class: cls }, [
                    h('input', {
                        ...restAttrs,
                        type: props.type,
                        value: props.value as any,
                        onInput: (e: any) => emit('update:value', e?.target?.value)
                    }),
                    props.suffix
                ])
        }
    })

    // eslint-disable-next-line vue/one-component-per-file
    const Button = defineComponent({
        name: 'AButton',
        setup(_props, { slots, attrs }) {
            return () => h('button', { type: 'button', ...attrs }, slots.default?.())
        }
    })

    // eslint-disable-next-line vue/one-component-per-file
    const Row = defineComponent({
        name: 'ARow',
        setup(_props, { slots }) {
            return () => h('div', { 'data-testid': 'row' }, slots.default?.())
        }
    })

    // eslint-disable-next-line vue/one-component-per-file
    const Col = defineComponent({
        name: 'ACol',
        setup(_props, { slots }) {
            return () => h('div', { 'data-testid': 'col' }, slots.default?.())
        }
    })

    // eslint-disable-next-line vue/one-component-per-file
    const ConfigProvider = defineComponent({
        name: 'AConfigProvider',
        setup(_props, { slots }) {
            return () => h('div', { 'data-testid': 'config-provider' }, slots.default?.())
        }
    })

    return {
        Row,
        Col,
        ConfigProvider,
        Form: Object.assign(Form, { Item: FormItem }),
        Input,
        Button,
        message: messageMock,
        theme: {
            darkAlgorithm: {},
            defaultAlgorithm: {}
        }
    }
})

/* eslint-disable vue/one-component-per-file */
const MiThemeStub = defineComponent({
    name: 'MiTheme',
    setup(_props, { slots }) {
        return () => h('div', { 'data-testid': 'theme' }, slots.default?.())
    }
})

const MiLinkStub = defineComponent({
    name: 'MiLink',
    props: { path: { type: String, default: '' } },
    setup(props, { slots }) {
        return () =>
            h('a', { 'data-testid': 'mi-link', 'data-path': props.path }, slots.default?.())
    }
})

const MiCaptchaStub = defineComponent({
    name: 'MiCaptcha',
    emits: ['success', 'init', 'checked'],
    setup(_props, { emit }) {
        return () =>
            h(
                'button',
                {
                    type: 'button',
                    'data-testid': 'captcha',
                    onClick: () => emit('success', { cuid: 'c1' })
                },
                'captcha'
            )
    }
})

const MiPaletteStub = defineComponent({
    name: 'MiPalette',
    setup() {
        return () => h('div', { 'data-testid': 'palette' })
    }
})

const MiLayoutFooterStub = defineComponent({
    name: 'MiLayoutFooter',
    setup() {
        return () => h('footer', { 'data-testid': 'footer' })
    }
})

const MiPasswordStub = defineComponent({
    name: 'MiPassword',
    props: {
        value: { type: String, default: '' },
        confirmValue: { type: String, default: '' }
    },
    emits: ['update:value', 'update:confirmValue'],
    setup(props, { emit, expose }) {
        expose({
            validate: async () => true
        })
        return () =>
            h('div', { 'data-testid': 'password' }, [
                h('input', {
                    'data-testid': 'password-input',
                    value: props.value,
                    onInput: (e: any) => emit('update:value', e?.target?.value)
                }),
                h('input', {
                    'data-testid': 'confirm-input',
                    value: props.confirmValue,
                    onInput: (e: any) => emit('update:confirmValue', e?.target?.value)
                })
            ])
    }
})
/* eslint-enable vue/one-component-per-file */

const resetCaches = () => {
    $storage.del(Object.values({ ...$g.caches.storages.password.reset }))
    messageMock.error.mockClear()
    messageMock.success.mockClear()
}

const setUsername = async (wrapper: VueWrapper, v: string) => {
    const input = wrapper.find('[data-name="username"] input')
    await input.setValue(v)
    await input.trigger('input')
    await nextTick()
}

const setCode = async (wrapper: VueWrapper, v: string) => {
    const input = wrapper.find('[data-name="code"] input')
    await input.setValue(v)
    await input.trigger('input')
    await nextTick()
}

const clickPrimary = async (wrapper: VueWrapper) => {
    const btns = wrapper.findAll(`.${styled.btnPrimary}`)
    const btn = btns[btns.length - 1]
    await btn.trigger('click')
    await flushPromises()
    await nextTick()
}

describe('MiForget', () => {
    const wrappers: VueWrapper[] = []

    const createTestRouter = async () => {
        const router = createRouter({
            history: createMemoryHistory(),
            routes: [
                { path: '/login', name: 'login', component: { render: () => h('div') } },
                { path: '/x', name: 'x', component: { render: () => h('div') } }
            ]
        })
        await router.push('/x')
        await router.isReady()
        return router
    }

    beforeEach(() => {
        vi.useFakeTimers()
        resetCaches()
        formState.forceReject = null
    })

    afterEach(() => {
        wrappers.splice(0).forEach((w) => w.unmount())
        vi.runOnlyPendingTimers()
        vi.useRealTimers()
        vi.restoreAllMocks()
        resetCaches()
    })

    test('发送验证码成功：会调用 sendCodeAction，写入缓存并展示 code 输入', async () => {
        const router = await createTestRouter()

        const postSpy = vi.spyOn($request, 'post').mockResolvedValue({
            ret: { code: 200 },
            data: { time: 100, uuid: 'u1' }
        } as any)

        const wrapper = mount(MiForget, {
            props: {
                sendCodeAction: '/send',
                checkCodeAction: '/check',
                resetPasswordAction: '/reset',
                sendCodeParams: { type: 'email' },
                showSendEmailSuccessModal: false
            },
            global: {
                plugins: [router],
                stubs: {
                    MiTheme: MiThemeStub,
                    MiLink: MiLinkStub,
                    MiCaptcha: MiCaptchaStub,
                    MiPassword: MiPasswordStub,
                    MiPalette: MiPaletteStub,
                    MiLayoutFooter: MiLayoutFooterStub
                }
            },
            attachTo: document.body
        })
        wrappers.push(wrapper)

        await setUsername(wrapper, 'a@b.com')

        await wrapper.find('[data-testid="captcha"]').trigger('click')
        await nextTick()

        await clickPrimary(wrapper)

        expect(postSpy).toHaveBeenCalledTimes(1)
        expect(postSpy).toHaveBeenCalledWith(
            '/send',
            expect.objectContaining({
                type: 'email',
                username: 'a@b.com',
                captcha: true,
                cuid: 'c1'
            })
        )

        expect($storage.get($g.caches.storages.password.reset.username)).toBe('a@b.com')
        expect($storage.get($g.caches.storages.password.reset.uid)).toBe('u1')
        expect($storage.get($g.caches.storages.password.reset.time)).toBe(100)

        expect(wrapper.find('[data-name="code"]').exists()).toBe(true)
        expect(wrapper.emitted().afterSendCode).toBeTruthy()
    })

    test('倒计时期间点击 resend 不会再次发送', async () => {
        const router = await createTestRouter()

        const postSpy = vi.spyOn($request, 'post').mockResolvedValue({
            ret: { code: 200 },
            data: { time: 100, uuid: 'u1' }
        } as any)

        const wrapper = mount(MiForget, {
            props: {
                sendCodeAction: '/send',
                checkCodeAction: '/check',
                resetPasswordAction: '/reset',
                resendDowntime: 120,
                showSendEmailSuccessModal: false
            },
            global: {
                plugins: [router],
                stubs: {
                    MiTheme: MiThemeStub,
                    MiLink: MiLinkStub,
                    MiCaptcha: MiCaptchaStub,
                    MiPassword: MiPasswordStub,
                    MiPalette: MiPaletteStub,
                    MiLayoutFooter: MiLayoutFooterStub
                }
            },
            attachTo: document.body
        })
        wrappers.push(wrapper)

        await setUsername(wrapper, 'a@b.com')
        await wrapper.find('[data-testid="captcha"]').trigger('click')
        await clickPrimary(wrapper)

        expect(postSpy).toHaveBeenCalledTimes(1)
        await wrapper.find(`.${styled.suffix}`).trigger('click')
        expect(postSpy).toHaveBeenCalledTimes(1)
    })

    test('校验验证码成功：会进入更新密码界面', async () => {
        const router = await createTestRouter()

        vi.spyOn($request, 'post')
            .mockResolvedValueOnce({ ret: { code: 200 }, data: { time: 100, uuid: 'u1' } } as any)
            .mockResolvedValueOnce({
                ret: { code: 200 },
                data: { token: 't1', uuid: 'u2' }
            } as any)

        const wrapper = mount(MiForget, {
            props: {
                sendCodeAction: '/send',
                checkCodeAction: '/check',
                resetPasswordAction: '/reset',
                showSendEmailSuccessModal: false
            },
            global: {
                plugins: [router],
                stubs: {
                    MiTheme: MiThemeStub,
                    MiLink: MiLinkStub,
                    MiCaptcha: MiCaptchaStub,
                    MiPassword: MiPasswordStub,
                    MiPalette: MiPaletteStub,
                    MiLayoutFooter: MiLayoutFooterStub
                }
            },
            attachTo: document.body
        })
        wrappers.push(wrapper)

        await setUsername(wrapper, 'a@b.com')
        await wrapper.find('[data-testid="captcha"]').trigger('click')
        await clickPrimary(wrapper)

        await setCode(wrapper, '123456')
        await clickPrimary(wrapper)

        expect($storage.get($g.caches.storages.password.reset.token)).toBe('t1')
        expect($storage.get($g.caches.storages.password.reset.uid)).toBe('u2')
        expect(wrapper.find('[data-testid="password"]').exists()).toBe(true)
        expect(wrapper.emitted().afterCheckCode).toBeTruthy()
    })

    test('更新密码成功（string action）：会清理缓存并在 3s 后跳转', async () => {
        const router = await createTestRouter()
        const pushSpy = vi.spyOn(router, 'push')

        vi.spyOn($request, 'post')
            .mockResolvedValueOnce({ ret: { code: 200 }, data: { time: 100, uuid: 'u1' } } as any)
            .mockResolvedValueOnce({
                ret: { code: 200 },
                data: { token: 't1', uuid: 'u2' }
            } as any)

        const putSpy = vi.spyOn($request, 'put').mockResolvedValue({ ret: { code: 200 } } as any)

        const wrapper = mount(MiForget, {
            props: {
                sendCodeAction: '/send',
                checkCodeAction: '/check',
                resetPasswordAction: '/reset',
                redirectTo: '/login',
                showSendEmailSuccessModal: false
            },
            global: {
                plugins: [router],
                stubs: {
                    MiTheme: MiThemeStub,
                    MiLink: MiLinkStub,
                    MiCaptcha: MiCaptchaStub,
                    MiPassword: MiPasswordStub,
                    MiPalette: MiPaletteStub,
                    MiLayoutFooter: MiLayoutFooterStub
                }
            },
            attachTo: document.body
        })
        wrappers.push(wrapper)

        await setUsername(wrapper, 'a@b.com')
        await wrapper.find('[data-testid="captcha"]').trigger('click')
        await clickPrimary(wrapper)

        await setCode(wrapper, '123456')
        await clickPrimary(wrapper)
        await flushPromises()
        await nextTick()

        await wrapper.find('[data-testid="password-input"]').setValue('p1')
        await wrapper.find('[data-testid="confirm-input"]').setValue('p1')
        await nextTick()

        await clickPrimary(wrapper)

        expect(putSpy).toHaveBeenCalled()
        expect(messageMock.success).toHaveBeenCalled()
        expect($storage.get($g.caches.storages.password.reset.uid)).toBe(null)

        vi.advanceTimersByTime(3000)
        await nextTick()
        expect(pushSpy).toHaveBeenCalledWith({ path: '/login' })

        expect(wrapper.emitted().afterResetSuccess).toBeTruthy()
    })

    test('resetPasswordAction=function 返回 true：同样清理缓存并跳转，并 emit afterResetSuccess', async () => {
        const router = await createTestRouter()
        const pushSpy = vi.spyOn(router, 'push')

        vi.spyOn($request, 'post')
            .mockResolvedValueOnce({ ret: { code: 200 }, data: { time: 100, uuid: 'u1' } } as any)
            .mockResolvedValueOnce({
                ret: { code: 200 },
                data: { token: 't1', uuid: 'u2' }
            } as any)

        const resetFn = vi.fn().mockResolvedValue(true)

        const wrapper = mount(MiForget, {
            props: {
                sendCodeAction: '/send',
                checkCodeAction: '/check',
                resetPasswordAction: resetFn,
                redirectTo: '/login',
                showSendEmailSuccessModal: false
            },
            global: {
                plugins: [router],
                stubs: {
                    MiTheme: MiThemeStub,
                    MiLink: MiLinkStub,
                    MiCaptcha: MiCaptchaStub,
                    MiPassword: MiPasswordStub,
                    MiPalette: MiPaletteStub,
                    MiLayoutFooter: MiLayoutFooterStub
                }
            },
            attachTo: document.body
        })
        wrappers.push(wrapper)

        await setUsername(wrapper, 'a@b.com')
        await wrapper.find('[data-testid="captcha"]').trigger('click')
        await clickPrimary(wrapper)

        await setCode(wrapper, '123456')
        await clickPrimary(wrapper)
        await flushPromises()
        await nextTick()

        await wrapper.find('[data-testid="password-input"]').setValue('p1')
        await wrapper.find('[data-testid="confirm-input"]').setValue('p1')
        await nextTick()

        await clickPrimary(wrapper)

        expect(resetFn).toHaveBeenCalled()
        expect(messageMock.success).toHaveBeenCalled()

        vi.advanceTimersByTime(3000)
        await nextTick()
        expect(pushSpy).toHaveBeenCalledWith({ path: '/login' })

        expect(wrapper.emitted().afterResetSuccess).toBeTruthy()
    })

    test('自定义 rules 会参与校验：validate 失败不会触发发送验证码', async () => {
        const router = await createTestRouter()

        const postSpy = vi.spyOn($request, 'post').mockResolvedValue({
            ret: { code: 200 },
            data: { time: 100, uuid: 'u1' }
        } as any)

        const wrapper = mount(MiForget, {
            props: {
                sendCodeAction: '/send',
                checkCodeAction: '/check',
                resetPasswordAction: '/reset',
                rules: {
                    username: [
                        {
                            required: true,
                            validator: () => Promise.reject('bad')
                        }
                    ]
                },
                showSendEmailSuccessModal: false
            },
            global: {
                plugins: [router],
                stubs: {
                    MiTheme: MiThemeStub,
                    MiLink: MiLinkStub,
                    MiCaptcha: MiCaptchaStub,
                    MiPassword: MiPasswordStub,
                    MiPalette: MiPaletteStub,
                    MiLayoutFooter: MiLayoutFooterStub
                }
            },
            attachTo: document.body
        })
        wrappers.push(wrapper)

        await setUsername(wrapper, 'a@b.com')
        await wrapper.find('[data-testid="captcha"]').trigger('click')
        await clickPrimary(wrapper)

        expect(postSpy).toHaveBeenCalledTimes(0)
    })
})
