/* eslint-disable vue/one-component-per-file */
import { mount, type VueWrapper } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import { defineComponent, h, nextTick } from 'vue'
import { createRouter, createMemoryHistory } from 'vue-router'
import MiLogin from '../Login'
import { $request } from '../../../utils/request'

const flushPromises = async () => {
    // 更稳：覆盖多层 then/await 链
    for (let i = 0; i < 10; i += 1) await Promise.resolve()
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

    const Row = defineComponent({
        name: 'ARow',
        setup(_props, { slots }) {
            return () => h('div', { 'data-testid': 'row' }, slots.default?.())
        }
    })

    const Col = defineComponent({
        name: 'ACol',
        setup(_props, { slots }) {
            return () => h('div', { 'data-testid': 'col' }, slots.default?.())
        }
    })

    const ConfigProvider = defineComponent({
        name: 'AConfigProvider',
        setup(_props, { slots }) {
            return () => h('div', { 'data-testid': 'config-provider' }, slots.default?.())
        }
    })

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
                    // Login 组件里 model.captcha 表示“是否开启验证码”，未开启时不应校验 captcha 字段
                    if (key === 'captcha' && model?.captcha === false) continue
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

    const FormItem = defineComponent({
        name: 'AFormItem',
        props: { name: { type: String, default: '' } },
        setup(props, { slots }) {
            return () =>
                h('div', { 'data-testid': 'form-item', 'data-name': props.name }, slots.default?.())
        }
    })

    const Input = defineComponent({
        name: 'AInput',
        inheritAttrs: false,
        props: {
            value: { type: [String, Number], default: '' },
            prefix: { type: null as any, default: null }
        },
        emits: ['update:value'],
        setup(props, { emit }) {
            return () =>
                h('input', {
                    value: props.value as any,
                    onInput: (e: any) => emit('update:value', e?.target?.value)
                })
        }
    })

    const Checkbox = defineComponent({
        name: 'ACheckbox',
        props: { checked: { type: Boolean, default: false } },
        emits: ['update:checked'],
        setup(props, { emit, slots }) {
            return () =>
                h('label', { 'data-testid': 'remember' }, [
                    h('input', {
                        type: 'checkbox',
                        checked: props.checked,
                        onChange: (e: any) => emit('update:checked', !!e?.target?.checked)
                    }),
                    slots.default?.()
                ])
        }
    })

    const Button = defineComponent({
        name: 'AButton',
        setup(_props, { slots, attrs }) {
            return () => h('button', { type: 'button', ...attrs }, slots.default?.())
        }
    })

    return {
        Row,
        Col,
        ConfigProvider,
        Form: Object.assign(Form, { Item: FormItem }),
        Input,
        Checkbox,
        Button,
        message: messageMock,
        theme: { darkAlgorithm: {}, defaultAlgorithm: {} }
    }
})

const MiThemeStub = defineComponent({
    name: 'MiTheme',
    setup(_props, { slots }) {
        return () => h('div', { 'data-testid': 'theme' }, slots.default?.())
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

const MiPasswordStub = defineComponent({
    name: 'MiPassword',
    props: {
        value: { type: String, default: '' }
    },
    emits: ['update:value'],
    setup(props, { emit, expose }) {
        expose({
            validate: async () => {
                if (!props.value) throw new Error('pwd')
                return true
            }
        })
        return () =>
            h('input', {
                'data-testid': 'password',
                value: props.value,
                onInput: (e: any) => emit('update:value', e?.target?.value)
            })
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

const MiPaletteStub = defineComponent({
    name: 'MiPalette',
    setup() {
        return () => h('div', { 'data-testid': 'palette' })
    }
})

const MiSocialiteStub = defineComponent({
    name: 'MiSocialite',
    setup() {
        return () => h('div', { 'data-testid': 'socialite' })
    }
})

const MiLayoutFooterStub = defineComponent({
    name: 'MiLayoutFooter',
    setup() {
        return () => h('footer', { 'data-testid': 'footer' })
    }
})
/* eslint-enable vue/one-component-per-file */

const setUsername = async (wrapper: VueWrapper, v: string) => {
    const input = wrapper.find('[data-name="username"] input')
    await input.setValue(v)
    await input.trigger('input')
    await nextTick()
}

const setPassword = async (wrapper: VueWrapper, v: string) => {
    const input = wrapper.find('[data-testid="password"]')
    await input.setValue(v)
    await input.trigger('input')
    await nextTick()
}

const clickLogin = async (wrapper: VueWrapper) => {
    const btn = wrapper.findAll('button').find((b) => /login|登录/.test(b.text()))

    expect(btn).toBeTruthy()
    await btn!.trigger('click')
    await flushPromises()
    await nextTick()
}

describe('MiLogin', () => {
    const wrappers: VueWrapper[] = []

    const createTestRouter = async () => {
        const router = createRouter({
            history: createMemoryHistory(),
            routes: [
                { path: '/', name: 'home', component: { render: () => h('div') } },
                { path: '/login', name: 'login', component: { render: () => h('div') } }
            ]
        })
        await router.push('/login')
        await router.isReady()
        return router
    }

    beforeEach(() => {
        vi.useFakeTimers()
        formState.forceReject = null
        messageMock.error.mockClear()
        messageMock.success.mockClear()
    })

    afterEach(() => {
        wrappers.splice(0).forEach((w) => w.unmount())
        vi.runOnlyPendingTimers()
        vi.useRealTimers()
        vi.restoreAllMocks()
        document.body.innerHTML = ''
    })

    test('captcha=false：填写账号密码后可直接登录，且请求参数不包含 cuid', async () => {
        const router = await createTestRouter()

        const postSpy = vi.spyOn($request, 'post').mockResolvedValue({ ret: { code: 200 } } as any)

        const wrapper = mount(MiLogin, {
            props: {
                action: '/v1/login',
                captcha: false
            },
            global: {
                plugins: [router],
                stubs: {
                    MiTheme: MiThemeStub,
                    MiPassword: MiPasswordStub,
                    MiCaptcha: MiCaptchaStub,
                    MiLink: MiLinkStub,
                    MiPalette: MiPaletteStub,
                    MiSocialite: MiSocialiteStub,
                    MiLayoutFooter: MiLayoutFooterStub
                }
            },
            attachTo: document.body
        })
        wrappers.push(wrapper)

        expect(wrapper.find('[data-testid="captcha"]').exists()).toBe(false)

        await setUsername(wrapper, 'u')
        await setPassword(wrapper, 'p')
        await clickLogin(wrapper)

        expect(postSpy).toHaveBeenCalled()
        const params = (postSpy.mock.calls[0] as any[])[1]
        expect(params.cuid).toBeUndefined()
        expect(wrapper.emitted().afterLogin).toBeTruthy()
    })

    test('captcha=true：未通过验证码时不会调用登录；通过后才会调用并携带 cuid', async () => {
        const router = await createTestRouter()

        const postSpy = vi.spyOn($request, 'post').mockResolvedValue({ ret: { code: 200 } } as any)

        const wrapper = mount(MiLogin, {
            props: {
                action: '/v1/login',
                captcha: true
            },
            global: {
                plugins: [router],
                stubs: {
                    MiTheme: MiThemeStub,
                    MiPassword: MiPasswordStub,
                    MiCaptcha: MiCaptchaStub,
                    MiLink: MiLinkStub,
                    MiPalette: MiPaletteStub,
                    MiSocialite: MiSocialiteStub,
                    MiLayoutFooter: MiLayoutFooterStub
                }
            },
            attachTo: document.body
        })
        wrappers.push(wrapper)

        await setUsername(wrapper, 'u')
        await setPassword(wrapper, 'p')

        await clickLogin(wrapper)
        expect(postSpy).not.toHaveBeenCalled()

        await wrapper.find('[data-testid="captcha"]').trigger('click')
        await nextTick()

        await clickLogin(wrapper)
        expect(postSpy).toHaveBeenCalled()
        const params = (postSpy.mock.calls[0] as any[])[1]
        expect(params.cuid).toBe('c1')
        expect(wrapper.emitted().captchaSuccess).toBeTruthy()
    })

    test('action=function：返回 true emit afterLogin；返回 string 调用 message.error', async () => {
        const router = await createTestRouter()

        const actionOk = vi.fn().mockResolvedValue(true)
        const wrapper1 = mount(MiLogin, {
            props: { action: actionOk, captcha: false },
            global: {
                plugins: [router],
                stubs: {
                    MiTheme: MiThemeStub,
                    MiPassword: MiPasswordStub,
                    MiCaptcha: MiCaptchaStub,
                    MiLink: MiLinkStub,
                    MiPalette: MiPaletteStub,
                    MiSocialite: MiSocialiteStub,
                    MiLayoutFooter: MiLayoutFooterStub
                }
            },
            attachTo: document.body
        })
        wrappers.push(wrapper1)

        await setUsername(wrapper1, 'u')
        await setPassword(wrapper1, 'p')
        await clickLogin(wrapper1)

        expect(actionOk).toHaveBeenCalled()
        expect(wrapper1.emitted().afterLogin).toBeTruthy()

        const actionErr = vi.fn().mockResolvedValue('bad')
        const wrapper2 = mount(MiLogin, {
            props: { action: actionErr, captcha: false },
            global: {
                plugins: [router],
                stubs: {
                    MiTheme: MiThemeStub,
                    MiPassword: MiPasswordStub,
                    MiCaptcha: MiCaptchaStub,
                    MiLink: MiLinkStub,
                    MiPalette: MiPaletteStub,
                    MiSocialite: MiSocialiteStub,
                    MiLayoutFooter: MiLayoutFooterStub
                }
            },
            attachTo: document.body
        })
        wrappers.push(wrapper2)

        await setUsername(wrapper2, 'u')
        await setPassword(wrapper2, 'p')
        await clickLogin(wrapper2)

        expect(actionErr).toHaveBeenCalled()
        expect(messageMock.error).toHaveBeenCalled()
    })

    test('mobile 注册按钮使用 props.registerLink', async () => {
        const router = await createTestRouter()

        const wrapper = mount(MiLogin, {
            props: { action: '/v1/login', captcha: false, registerLink: '/r2' },
            global: {
                plugins: [router],
                stubs: {
                    MiTheme: MiThemeStub,
                    MiPassword: MiPasswordStub,
                    MiCaptcha: MiCaptchaStub,
                    MiLink: MiLinkStub,
                    MiPalette: MiPaletteStub,
                    MiSocialite: MiSocialiteStub,
                    MiLayoutFooter: MiLayoutFooterStub
                }
            },
            attachTo: document.body
        })
        wrappers.push(wrapper)

        // 触发 mobile 分支：缩小窗口
        Object.defineProperty(window, 'innerWidth', { configurable: true, value: 375 })
        window.dispatchEvent(new Event('resize'))
        await nextTick()

        // 第二个 link 是注册
        const links = wrapper.findAll('[data-testid="mi-link"]')
        expect(links.some((l) => l.attributes('data-path') === '/r2')).toBe(true)
    })
})
