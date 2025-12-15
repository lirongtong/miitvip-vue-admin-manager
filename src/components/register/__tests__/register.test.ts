/* eslint-disable vue/one-component-per-file */
import { mount, type VueWrapper } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import { nextTick } from 'vue'

import MiRegister from '../Register'
import styled from '../style/register.module.less'

const flushPromises = async () => {
    for (let i = 0; i < 10; i += 1) await Promise.resolve()
}

const { state, messageMock } = vi.hoisted(() => {
    return {
        state: {
            width: 1200,
            formForceReject: null as string | null,
            passwordForceReject: null as string | null,
            routerPush: vi.fn(),
            authRegister: vi.fn(),
            requestPost: vi.fn(),
            requestGet: vi.fn(),
            lastCaptchaSuccess: null as any
        },
        messageMock: {
            error: vi.fn(),
            success: vi.fn(),
            destroy: vi.fn()
        }
    }
})

vi.mock('vue-router', () => ({
    useRouter: () => ({ push: state.routerPush })
}))

vi.mock('../../../hooks/useWindowResize', async () => {
    const { ref } = await import('vue')
    return {
        useWindowResize: () => ({ width: ref(state.width) })
    }
})

vi.mock('../../../stores/auth', () => ({
    useAuthStore: () => ({ register: state.authRegister })
}))

vi.mock('../../../utils/request', () => ({
    $request: {
        post: state.requestPost,
        get: state.requestGet
    }
}))

vi.mock('../../../utils/api', () => ({
    api: { register: '/api/register' }
}))

vi.mock('../../../utils/images', () => ({
    __LOGO__: 'logo.png',
    __PASSPORT_DEFAULT_BACKGROUND__: 'bg.png'
}))

vi.mock('../../../utils/global', () => ({
    $g: {
        site: 'site',
        powered: 'powered',
        logo: '',
        breakpoints: { md: 768 },
        regExp: { username: /^[a-zA-Z]\w{2,30}$/ },
        caches: { storages: { theme: { hex: 'hex', type: 'type' } } },
        theme: { type: 'dark', primary: '#000' }
    }
}))

const { toolsMock } = vi.hoisted(() => {
    return {
        toolsMock: {
            uid: vi.fn(() => 'uid'),
            isEmpty: vi.fn((v: any) => v === '' || v === null || v === undefined),
            isEmail: vi.fn((v: any) => String(v).includes('@')),
            getAntdvThemeProperties: vi.fn(() => ({}))
        }
    }
})

vi.mock('../../../utils/tools', async () => {
    const actual: any = await vi.importActual('../../../utils/tools')
    const patched = Object.create(actual.$tools)
    Object.assign(patched, toolsMock)
    return { $tools: patched }
})

vi.mock('../../_utils/theme', () => ({ default: () => null }))

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

    const Popover = defineComponent({
        name: 'APopover',
        props: { content: { type: null as any, default: null } },
        setup(props, { slots }) {
            return () => h('div', { 'data-testid': 'popover' }, [slots.default?.(), props.content])
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
                if (state.formForceReject) throw new Error(state.formForceReject)

                const rules = props.rules || {}
                const model = props.model || {}
                const keys = names && names.length > 0 ? names : Object.keys(rules)

                for (const key of keys) {
                    // Register：model.captcha 表示“是否开启验证码”，未开启时不校验 captcha
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

            const validate = async () => runRules()
            const validateFields = async (names: string[]) => runRules(names)
            expose({ validate, validateFields })
            return () => h('form', { 'data-testid': 'form' }, slots.default?.())
        }
    })

    const FormItem = defineComponent({
        name: 'AFormItem',
        props: { name: { type: String, default: '' } },
        setup(props, { slots }) {
            return () =>
                h('div', { 'data-testid': 'item', 'data-name': props.name }, slots.default?.())
        }
    })

    const Input = defineComponent({
        name: 'AInput',
        inheritAttrs: false,
        props: {
            value: { type: [String, Number], default: '' },
            prefix: { type: null as any, default: null }
        },
        emits: ['update:value', 'pressEnter', 'blur'],
        setup(props, { emit, attrs }) {
            const { prefix: _prefix, ...restAttrs } = attrs as any
            return () =>
                h('div', { 'data-testid': 'input-wrap' }, [
                    h('span', { 'data-testid': 'prefix' }, [props.prefix]),
                    h('input', {
                        ...restAttrs,
                        'data-testid': 'input',
                        value: props.value as any,
                        onInput: (e: any) => emit('update:value', e?.target?.value),
                        onBlur: () => emit('blur')
                    })
                ])
        }
    })

    const Button = defineComponent({
        name: 'AButton',
        inheritAttrs: false,
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
        Popover,
        Button,
        message: messageMock
    }
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

    return { UserOutlined: icon('UserOutlined'), MailOutlined: icon('MailOutlined') }
})

vi.mock('../../theme/Theme', async () => {
    const { defineComponent, h } = await import('vue')
    return {
        default: defineComponent({
            name: 'MiTheme',
            setup(_p, { slots }) {
                return () => h('div', { 'data-testid': 'theme' }, slots.default?.())
            }
        })
    }
})

vi.mock('../../layout/Footer', async () => {
    const { defineComponent, h } = await import('vue')
    return {
        default: defineComponent({
            name: 'MiLayoutFooter',
            setup() {
                return () => h('div', { 'data-testid': 'footer' }, 'footer')
            }
        })
    }
})

vi.mock('../../palette/Palette', async () => {
    const { defineComponent, h } = await import('vue')
    return {
        default: defineComponent({
            name: 'MiPalette',
            setup() {
                return () => h('div', { 'data-testid': 'palette' })
            }
        })
    }
})

vi.mock('../../link/Link', async () => {
    const { defineComponent, h } = await import('vue')
    return {
        default: defineComponent({
            name: 'MiLink',
            props: { path: { type: String, default: '' } },
            setup(props, { slots }) {
                return () =>
                    h('a', { 'data-testid': 'link', 'data-path': props.path }, slots.default?.())
            }
        })
    }
})

vi.mock('../../captcha/Captcha', async () => {
    const { defineComponent, h } = await import('vue')
    return {
        default: defineComponent({
            name: 'MiCaptcha',
            props: {
                onInit: { type: Function as any, default: undefined },
                onChecked: { type: Function as any, default: undefined },
                onSuccess: { type: Function as any, default: undefined }
            },
            setup(props) {
                return () =>
                    h(
                        'button',
                        {
                            type: 'button',
                            'data-testid': 'captcha',
                            onClick: () => {
                                const payload = { cuid: 'c1' }
                                state.lastCaptchaSuccess = payload
                                props.onSuccess?.(payload)
                            }
                        },
                        'captcha'
                    )
            }
        })
    }
})

vi.mock('../../socialite/Socialite', async () => {
    const { defineComponent, h } = await import('vue')
    return {
        default: defineComponent({
            name: 'MiSocialite',
            setup() {
                return () => h('div', { 'data-testid': 'socialite' })
            }
        })
    }
})

vi.mock('../../password/Password', async () => {
    const { defineComponent, h } = await import('vue')
    return {
        default: defineComponent({
            name: 'MiPassword',
            props: {
                value: { type: [String, Number], default: '' },
                confirmValue: { type: [String, Number], default: '' },
                confirm: { type: Boolean, default: false }
            },
            emits: ['update:value', 'update:confirmValue', 'pressEnter'],
            setup(_props, { expose, emit }) {
                const validate = async () => {
                    if (state.passwordForceReject) throw new Error(state.passwordForceReject)
                    return true
                }
                const validateFields = async (_fields: any) => validate()
                expose({ validate, validateFields })
                return () =>
                    h('div', { 'data-testid': 'password' }, [
                        h('button', {
                            type: 'button',
                            'data-testid': 'password-ok',
                            onClick: () => {
                                emit('update:value', 'p1')
                                emit('update:confirmValue', 'p1')
                            }
                        })
                    ])
            }
        })
    }
})

vi.mock('../../modal/Modal', async () => {
    const { defineComponent, h } = await import('vue')
    return {
        default: defineComponent({
            name: 'MiModal',
            props: {
                open: { type: Boolean, default: false },
                title: { type: String, default: '' },
                onOk: { type: Function as any, default: undefined },
                onCancel: { type: Function as any, default: undefined }
            },
            emits: ['update:open'],
            setup(props, { slots }) {
                return () =>
                    props.open
                        ? h('div', { 'data-testid': 'modal' }, [
                              h(
                                  'button',
                                  {
                                      type: 'button',
                                      'data-testid': 'modal-ok',
                                      onClick: () => props.onOk?.()
                                  },
                                  'ok'
                              ),
                              h(
                                  'button',
                                  {
                                      type: 'button',
                                      'data-testid': 'modal-cancel',
                                      onClick: () => props.onCancel?.()
                                  },
                                  'cancel'
                              ),
                              slots.default?.()
                          ])
                        : null
            }
        })
    }
})

describe('MiRegister', () => {
    const wrappers: VueWrapper[] = []

    beforeEach(() => {
        state.width = 1200
        state.formForceReject = null
        state.passwordForceReject = null
        state.routerPush.mockClear()
        state.authRegister.mockReset()
        state.requestPost.mockReset()
        state.requestGet.mockReset()
        messageMock.error.mockClear()
    })

    afterEach(() => {
        wrappers.splice(0).forEach((w) => w.unmount())
        vi.restoreAllMocks()
        document.body.innerHTML = ''
    })

    test('captcha=true：未通过验证码时会阻止注册；通过后会调用 auth.register 且携带 cuid', async () => {
        state.authRegister.mockResolvedValue({ ret: { code: 200 } })

        const wrapper = mount(MiRegister, {
            props: {
                action: '/api/register',
                captcha: true,
                showSendEmailSuccessModal: false,
                redirectTo: '/x'
            },
            attachTo: document.body
        })
        wrappers.push(wrapper)

        const inputs = wrapper.findAll('input[data-testid="input"]')
        await inputs[0].setValue('abc')
        await inputs[0].trigger('input')
        await inputs[1].setValue('a@b.com')
        await inputs[1].trigger('input')

        // password
        await wrapper.find('[data-testid="password-ok"]').trigger('click')
        await nextTick()

        await wrapper.find(`button.${styled.btnPrimary}`).trigger('click')
        await flushPromises()

        expect(state.authRegister).not.toHaveBeenCalled()

        // 通过 captcha
        await wrapper.find('[data-testid="captcha"]').trigger('click')
        await nextTick()

        await wrapper.find(`button.${styled.btnPrimary}`).trigger('click')
        await flushPromises()

        expect(state.authRegister).toHaveBeenCalled()
        const params = state.authRegister.mock.calls[0]?.[0]
        expect(params.cuid).toBe('c1')
        expect(state.routerPush).toHaveBeenCalledWith({ path: '/x' })
    })

    test('captcha=false：不会校验 captcha，能直接注册（且不会包含 cuid）', async () => {
        state.authRegister.mockResolvedValue({ ret: { code: 200 } })

        const wrapper = mount(MiRegister, {
            props: {
                action: '/api/register',
                captcha: false,
                showSendEmailSuccessModal: false,
                redirectTo: '/x'
            },
            attachTo: document.body
        })
        wrappers.push(wrapper)

        const inputs = wrapper.findAll('input[data-testid="input"]')
        await inputs[0].setValue('abc')
        await inputs[0].trigger('input')
        await inputs[1].setValue('a@b.com')
        await inputs[1].trigger('input')
        await wrapper.find('[data-testid="password-ok"]').trigger('click')

        await wrapper.find(`button.${styled.btnPrimary}`).trigger('click')
        await flushPromises()

        expect(state.authRegister).toHaveBeenCalled()
        const params = state.authRegister.mock.calls[0]?.[0]
        expect(params.cuid).toBeUndefined()
        expect(state.routerPush).toHaveBeenCalledWith({ path: '/x' })
    })

    test('action=function：返回 true 时按 showSendEmailSuccessModal 决定 modal/redirect；返回 string 时 message.error', async () => {
        const action = vi.fn().mockResolvedValueOnce(true).mockResolvedValueOnce('bad')

        const wrapper = mount(MiRegister, {
            props: { action, captcha: false, showSendEmailSuccessModal: true, redirectTo: '/x' },
            attachTo: document.body
        })
        wrappers.push(wrapper)

        const inputs = wrapper.findAll('input[data-testid="input"]')
        await inputs[0].setValue('abc')
        await inputs[0].trigger('input')
        await inputs[1].setValue('a@b.com')
        await inputs[1].trigger('input')
        await wrapper.find('[data-testid="password-ok"]').trigger('click')

        await wrapper.find(`button.${styled.btnPrimary}`).trigger('click')
        await flushPromises()

        expect(action).toHaveBeenCalled()
        expect(wrapper.find('[data-testid="modal"]').exists()).toBe(true)

        // 第二次返回 string
        await wrapper.find('[data-testid="modal-cancel"]').trigger('click')
        await nextTick()
        await wrapper.find(`button.${styled.btnPrimary}`).trigger('click')
        await flushPromises()
        expect(messageMock.error).toHaveBeenCalledWith('bad')
    })

    test('verify：blur 时会按配置请求；会携带 verify.params 并在成功/失败时更新 tips 触发 validateFields', async () => {
        state.requestGet.mockResolvedValueOnce({ ret: { code: 200 } })
        state.requestPost.mockResolvedValueOnce({ ret: { code: 500, message: 'dup' } })

        const wrapper = mount(MiRegister, {
            props: {
                action: '/api/register',
                captcha: false,
                verify: {
                    username: { action: '/v', method: 'get', params: { x: 1 } },
                    email: { action: '/v2', method: 'post', params: { y: 2 } }
                }
            },
            attachTo: document.body
        })
        wrappers.push(wrapper)

        const inputs = wrapper.findAll('input[data-testid="input"]')
        await inputs[0].setValue('abc')
        await inputs[0].trigger('input')
        await inputs[0].trigger('blur')
        await flushPromises()

        expect(state.requestGet).toHaveBeenCalledWith('/v', { x: 1, data: 'abc' })

        await inputs[1].setValue('a@b.com')
        await inputs[1].trigger('input')
        await inputs[1].trigger('blur')
        await flushPromises()

        expect(state.requestPost).toHaveBeenCalledWith('/v2', { y: 2, data: 'a@b.com' })
    })

    test('登录链接：移动端按钮与桌面 link 都使用 props.loginLink', async () => {
        state.width = 500
        const wrapper = mount(MiRegister, {
            props: { action: '/api/register', captcha: false, loginLink: '/login2' },
            attachTo: document.body
        })
        wrappers.push(wrapper)

        await nextTick()
        const links = wrapper.findAll('[data-testid="link"]')
        expect(links.some((a) => a.attributes('data-path') === '/login2')).toBe(true)
    })
})
