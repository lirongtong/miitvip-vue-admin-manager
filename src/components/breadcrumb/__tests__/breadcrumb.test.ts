import { mount } from '@vue/test-utils'
import { describe, expect, test } from 'vitest'
import { h, nextTick } from 'vue'
import { createMemoryHistory, createRouter } from 'vue-router'
import { useBreadcrumbsStore } from '../../../stores/breadcrumbs'
import MiBreadcrumb from '../Breadcrumb'
import styled from '../style/breadcrumb.module.less'

const MiLinkStub = {
    name: 'MiLink',
    props: {
        path: { type: String, default: '' }
    },
    setup(props, { slots }) {
        return () =>
            h(
                'a',
                {
                    'data-testid': 'mi-link',
                    'data-has-path': props.path ? '1' : '0',
                    'data-path': props.path
                },
                slots.default?.()
            )
    }
}

const createTestRouter = async (initialPath: string) => {
    const Dummy = { render: () => null }
    const router = createRouter({
        history: createMemoryHistory(),
        routes: [
            {
                path: '/',
                name: 'home',
                meta: { title: '首页' },
                component: Dummy,
                children: [
                    {
                        path: 'dashboard',
                        name: 'dashboard',
                        meta: { title: '仪表盘' },
                        component: Dummy,
                        children: [
                            {
                                path: 'analysis',
                                name: 'analysis',
                                meta: { title: '分析' },
                                component: Dummy
                            }
                        ]
                    }
                ]
            }
        ]
    })
    await router.push(initialPath)
    await router.isReady()
    return router
}

describe('MiBreadcrumb', () => {
    test('根据 route 自动生成面包屑并渲染', async () => {
        const router = await createTestRouter('/dashboard/analysis')

        const wrapper = mount(MiBreadcrumb, {
            global: {
                plugins: [router],
                stubs: { MiLink: MiLinkStub }
            }
        })
        await nextTick()

        const store = useBreadcrumbsStore()
        expect(store.breadcrumbs.length).toBe(3)
        expect(store.breadcrumbs[0].title).toBe('首页')
        expect(store.breadcrumbs[0].path).toBe('/')
        expect(store.breadcrumbs[2].title).toBe('分析')
        expect(store.breadcrumbs[2].path).toBeUndefined()

        const items = wrapper.findAll(`.${styled.item}`)
        expect(items.length).toBe(3)
        expect(wrapper.findComponent({ name: 'HomeOutlined' }).exists()).toBe(true)

        const links = wrapper.findAll('[data-testid="mi-link"]')
        expect(links[0].attributes('data-path')).toBe('/')
        expect(links[1].attributes('data-path')).toBe('/dashboard')
        expect(links[2].attributes('data-has-path')).toBe('0')
    })

    test('支持自定义分隔符 separator', async () => {
        const router = await createTestRouter('/dashboard/analysis')

        const wrapper = mount(MiBreadcrumb, {
            props: { separator: '~' },
            global: {
                plugins: [router],
                stubs: { MiLink: MiLinkStub }
            }
        })
        await nextTick()

        const separators = wrapper.findAll(`.${styled.separator}`)
        expect(separators.length).toBe(3)
        separators.forEach((s) => expect(s.text()).toBe('~'))
    })

    test('路由变化会更新面包屑内容', async () => {
        const router = await createTestRouter('/dashboard/analysis')

        const wrapper = mount(MiBreadcrumb, {
            global: {
                plugins: [router],
                stubs: { MiLink: MiLinkStub }
            }
        })
        await nextTick()

        await router.push('/dashboard')
        await router.isReady()
        await nextTick()

        const store = useBreadcrumbsStore()
        expect(store.breadcrumbs.length).toBe(2)
        expect(store.breadcrumbs[1].title).toBe('仪表盘')
        expect(store.breadcrumbs[1].path).toBeUndefined()

        const items = wrapper.findAll(`.${styled.item}`)
        expect(items.length).toBe(2)
        expect(wrapper.text()).toContain('首页')
        expect(wrapper.text()).toContain('仪表盘')
        expect(wrapper.text()).not.toContain('分析')
    })
})
