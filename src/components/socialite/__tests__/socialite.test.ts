/* eslint-disable vue/one-component-per-file */
import { mount, type VueWrapper } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import { nextTick } from 'vue'

import MiSocialite from '../Socialite'
import MiSocialiteCallback from '../Callback'

const { state } = vi.hoisted(() => {
    return {
        state: {
            routeParams: { socialite: 'github', token: 't1' } as any,
            routerPush: vi.fn(),
            requestPost: vi.fn(),
            cookieSet: vi.fn(),
            storageSet: vi.fn(),
            messageError: vi.fn(),
            replaceUrlParams: vi.fn((url: string, params: any) => {
                return `${url}?socialite=${params?.socialite}`
            })
        }
    }
})

vi.mock('../../_utils/theme', () => ({ default: () => null }))

vi.mock('../../../utils/global', () => ({
    __MI_SOCIALITE_DOMAIN__: 'https://social.test'
}))

vi.mock('vue-router', () => ({
    useRoute: () => ({ params: state.routeParams }),
    useRouter: () => ({ push: state.routerPush })
}))

vi.mock('../../../utils/request', () => ({
    $request: { post: state.requestPost }
}))

vi.mock('../../../utils/cookie', () => ({
    $cookie: { set: state.cookieSet }
}))

vi.mock('../../../utils/storage', () => ({
    $storage: { set: state.storageSet }
}))

vi.mock('ant-design-vue', async () => {
    const { defineComponent, h } = await import('vue')
    return {
        message: { error: state.messageError },
        Popover: defineComponent({
            name: 'APopover',
            setup(_props, { slots }) {
                return () => h('div', { 'data-testid': 'popover' }, slots.default?.())
            }
        })
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
    return {
        MoreOutlined: icon('MoreOutlined'),
        GithubOutlined: icon('GithubOutlined'),
        WeiboCircleOutlined: icon('WeiboCircleOutlined'),
        QqOutlined: icon('QqOutlined'),
        GoogleOutlined: icon('GoogleOutlined')
    }
})

vi.mock('../../dropdown/Dropdown', async () => {
    const { defineComponent, h } = await import('vue')
    const Item = defineComponent({
        name: 'MiDropdownItem',
        props: { item: { type: Object as any, default: () => ({}) } },
        setup(props) {
            return () =>
                h('div', { 'data-testid': 'dropdown-item' }, String(props.item?.name ?? ''))
        }
    })

    const Dropdown = defineComponent({
        name: 'MiDropdown',
        props: {
            title: { type: null as any, default: null },
            items: { type: Array as any, default: () => [] }
        },
        setup(props) {
            return () =>
                h('div', { 'data-testid': 'dropdown' }, [
                    h('span', { 'data-testid': 'dropdown-title' }, [props.title]),
                    h(
                        'div',
                        { 'data-testid': 'dropdown-items' },
                        (props.items || []).map((it: any) =>
                            h('div', { 'data-testid': 'dropdown-it' }, it.name)
                        )
                    )
                ])
        }
    })

    ;(Dropdown as any).Item = Item

    return { default: Dropdown }
})

vi.mock('../../link/Link', async () => {
    const { defineComponent, h } = await import('vue')
    return {
        default: defineComponent({
            name: 'MiLink',
            inheritAttrs: false,
            setup(_props, { slots, attrs }) {
                return () =>
                    h(
                        'a',
                        {
                            'data-testid': 'link',
                            onClick: (e: any) => {
                                const handler = (attrs as any)?.onClick
                                if (typeof handler === 'function') handler(e)
                            }
                        },
                        slots.default?.()
                    )
            }
        })
    }
})

vi.mock('../../../utils/tools', async () => {
    const actual: any = await vi.importActual('../../../utils/tools')
    const patched = Object.create(actual.$tools)
    Object.assign(patched, { replaceUrlParams: state.replaceUrlParams })
    return { $tools: patched }
})

vi.mock('../../../utils/api', () => ({
    api: { oauth: { authorize: '/oauth/authorize/{socialite}' } }
}))

describe('MiSocialite', () => {
    const wrappers: VueWrapper[] = []

    beforeEach(() => {
        state.routerPush.mockClear()
        state.requestPost.mockReset()
        state.cookieSet.mockClear()
        state.storageSet.mockClear()
        state.messageError.mockClear()
        state.replaceUrlParams.mockClear()
    })

    afterEach(() => {
        wrappers.splice(0).forEach((w) => w.unmount())
        vi.restoreAllMocks()
        document.body.innerHTML = ''
    })

    test('showMore=true：渲染 first + dropdown；点击 first 会触发 callback', async () => {
        const cb = vi.fn()
        const wrapper = mount(MiSocialite, {
            props: {
                tip: 'tip',
                showMore: true,
                items: [{ name: 'github', callback: cb }, { name: 'qq' }]
            },
            attachTo: document.body
        })
        wrappers.push(wrapper)

        await nextTick()
        expect(wrapper.find('[data-testid="dropdown"]').exists()).toBe(true)

        // 点击 first
        await wrapper.find('[data-testid="GithubOutlined"]').trigger('click')
        expect(cb).toHaveBeenCalled()
    })

    test('showMore=false：会渲染移动端图标列表（修复点：不应使用 {...icons}）', async () => {
        const wrapper = mount(MiSocialite, {
            props: {
                tip: 'tip',
                showMore: false,
                items: [{ name: 'github' }, { name: 'qq' }, { name: 'google' }]
            }
        })
        wrappers.push(wrapper)

        await nextTick()
        expect(wrapper.findAll('[data-testid="link"]').length).toBe(3)
    })

    test('items 传入对象不应被组件直接修改（修复点：parseItems 不应写入 item.callback）', async () => {
        const raw: any = { name: 'github' }
        Object.freeze(raw)

        const wrapper = mount(MiSocialite, {
            props: {
                showMore: true,
                items: [raw]
            }
        })
        wrappers.push(wrapper)

        await nextTick()
        expect((raw as any).callback).toBeUndefined()
        expect(wrapper.exists()).toBe(true)
    })
})

describe('MiSocialiteCallback', () => {
    const wrappers: VueWrapper[] = []

    beforeEach(() => {
        state.routerPush.mockClear()
        state.requestPost.mockReset()
        state.cookieSet.mockClear()
        state.storageSet.mockClear()
        state.messageError.mockClear()
        state.replaceUrlParams.mockClear()
        state.routeParams = { socialite: 'github', token: 't1' }
    })

    afterEach(() => {
        wrappers.splice(0).forEach((w) => w.unmount())
        vi.restoreAllMocks()
        document.body.innerHTML = ''
    })

    test('授权成功：会写 cookie/storage 并跳转 /', async () => {
        state.requestPost.mockResolvedValue({
            ret: { code: 200 },
            data: {
                tokens: { access_token: 'a', refresh_token: 'r', expires_in: 123 },
                user: { id: 1 }
            }
        })

        const wrapper = mount(MiSocialiteCallback)
        wrappers.push(wrapper)

        await nextTick()
        await nextTick()

        expect(state.requestPost).toHaveBeenCalledWith(
            '/oauth/authorize/{socialite}?socialite=github',
            {
                token: 't1'
            }
        )
        expect(state.cookieSet).toHaveBeenCalled()
        expect(state.storageSet).toHaveBeenCalledWith('user-info', { id: 1 })
        expect(state.routerPush).toHaveBeenCalledWith({ path: '/' })
    })

    test('授权失败（code!=200）：跳转 /login 并 message.error', async () => {
        state.requestPost.mockResolvedValue({ ret: { code: 500, message: 'no' } })

        const wrapper = mount(MiSocialiteCallback)
        wrappers.push(wrapper)

        await nextTick()
        await nextTick()

        expect(state.routerPush).toHaveBeenCalledWith({ path: '/login' })
        expect(state.messageError).toHaveBeenCalled()
    })

    test('缺少 params：直接跳转 /login（修复点）', async () => {
        state.routeParams = {}
        const wrapper = mount(MiSocialiteCallback)
        wrappers.push(wrapper)

        await nextTick()
        expect(state.routerPush).toHaveBeenCalledWith({ path: '/login' })
    })
})
