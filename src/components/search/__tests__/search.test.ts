import { mount, type VueWrapper } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import { nextTick } from 'vue'
import MiSearch from '../Search'
import styled from '../style/search.module.less'
import type { SearchData } from '../../../utils/types'

const flushTimers = async (ms: number) => {
    await nextTick()
    if (ms > 0) vi.advanceTimersByTime(ms)
    else vi.runOnlyPendingTimers()
    await nextTick()
}

describe('MiSearch', () => {
    let wrapper: VueWrapper<any> | null = null

    const createData = (): SearchData[] => [
        {
            id: 1,
            title: 'Vue 3 教程',
            summary: '学习 Vue 3 框架',
            icon: null,
            avatar: '',
            path: '',
            query: {}
        },
        {
            id: 2,
            title: 'React 入门',
            summary: '学习 React 库',
            icon: null,
            avatar: '',
            path: '',
            query: {}
        },
        {
            id: 3,
            title: 'Vue Router 路由',
            summary: 'Vue 路由管理',
            icon: null,
            avatar: '',
            path: '',
            query: {}
        }
    ]

    beforeEach(() => {
        vi.useFakeTimers()
    })

    afterEach(() => {
        if (wrapper) {
            wrapper.unmount()
            wrapper = null
        }
        vi.runOnlyPendingTimers()
        vi.useRealTimers()
        document.body.innerHTML = ''
    })

    describe('基础渲染', () => {
        test('应该正确渲染输入框和容器', () => {
            wrapper = mount(MiSearch, {
                props: {
                    searchKey: 'title',
                    data: createData()
                },
                attachTo: document.body
            })

            expect(wrapper.find('input').exists()).toBe(true)
            expect(wrapper.find(`.${styled.container}`).exists()).toBe(true)
        })

        test('应该显示自定义占位符', () => {
            const placeholder = '请输入搜索内容'
            wrapper = mount(MiSearch, {
                props: {
                    searchKey: 'title',
                    placeholder,
                    data: createData()
                },
                attachTo: document.body
            })

            const input = wrapper.find('input')
            expect(input.attributes('placeholder')).toBe(placeholder)
        })
    })

    describe('本地搜索与高亮', () => {
        test('输入关键字后应过滤并高亮匹配项', async () => {
            wrapper = mount(MiSearch, {
                props: {
                    searchKey: 'title',
                    data: createData(),
                    pagination: false
                },
                attachTo: document.body
            })

            const input = wrapper.find('input')
            await input.setValue('Vue')
            await flushTimers(250)

            const list = wrapper.find(`.${styled.list}`)
            expect(list.exists()).toBe(true)
            const html = list.html()
            expect(html).toContain('Vue')
            expect(html).toContain(styled.searchKey)
        })

        test('关键字包含正则特殊字符时不会抛错', async () => {
            wrapper = mount(MiSearch, {
                props: {
                    searchKey: 'title',
                    data: createData(),
                    pagination: false
                },
                attachTo: document.body
            })

            const input = wrapper.find('input')
            await input.setValue('C++')
            await flushTimers(250)

            // 组件不应崩溃
            expect(wrapper.exists()).toBe(true)
        })

        test('无匹配结果时显示空数据提示', async () => {
            const text = '没有找到数据'
            wrapper = mount(MiSearch, {
                props: {
                    searchKey: 'title',
                    data: createData(),
                    listNoDataText: text
                },
                attachTo: document.body
            })

            const input = wrapper.find('input')
            await input.setValue('Angular')
            await flushTimers(250)

            const list = wrapper.find(`.${styled.list}`)
            expect(list.text()).toContain(text)
        })
    })

    describe('searchAction 函数搜索', () => {
        test('应调用自定义搜索函数并渲染结果', async () => {
            const data = createData()
            const searchAction = vi.fn(async (keyword: string) => {
                return data.filter((item) => item.title.includes(keyword))
            })

            wrapper = mount(MiSearch, {
                props: {
                    searchKey: 'title',
                    searchAction,
                    pagination: false
                },
                attachTo: document.body
            })

            const input = wrapper.find('input')
            await input.setValue('Vue')
            await flushTimers(250)

            expect(searchAction).toHaveBeenCalledWith('Vue')
            const list = wrapper.find(`.${styled.list}`)
            expect(list.html()).toContain('Vue 3 教程')
        })
    })

    describe('事件与交互', () => {
        test('输入时触发 input/change/update:value 事件', async () => {
            wrapper = mount(MiSearch, {
                props: {
                    searchKey: 'title',
                    data: createData()
                },
                attachTo: document.body
            })

            const input = wrapper.find('input')
            await input.setValue('abc')
            await flushTimers(250)

            expect(wrapper.emitted('input')).toBeTruthy()
            expect(wrapper.emitted('change')).toBeTruthy()
            expect(wrapper.emitted('update:value')).toBeTruthy()
        })

        test('按下 Enter 键触发 pressEnter 事件', async () => {
            wrapper = mount(MiSearch, {
                props: {
                    searchKey: 'title',
                    data: createData()
                },
                attachTo: document.body
            })

            const input = wrapper.find('input')
            await input.trigger('keydown', { key: 'Enter' })
            await nextTick()

            expect(wrapper.emitted('pressEnter')).toBeTruthy()
        })

        test('点击结果项触发 itemClick 事件', async () => {
            const data = createData()
            wrapper = mount(MiSearch, {
                props: {
                    searchKey: 'title',
                    data,
                    pagination: false
                },
                attachTo: document.body
            })

            const input = wrapper.find('input')
            await input.setValue('Vue')
            await flushTimers(250)

            const items = wrapper.findAll(`.${styled.item}`)
            expect(items.length).toBeGreaterThan(0)

            await items[0].trigger('click')
            const emitted = wrapper.emitted('itemClick')
            expect(emitted).toBeTruthy()
        })

        test('点击外部区域会关闭列表并触发 close 事件', async () => {
            wrapper = mount(MiSearch, {
                props: {
                    searchKey: 'title',
                    data: createData()
                },
                attachTo: document.body
            })

            const input = wrapper.find('input')
            await input.trigger('focus')
            await nextTick()

            // 触发 window click
            const clickEvent = new MouseEvent('click', { bubbles: true })
            window.dispatchEvent(clickEvent)
            await nextTick()

            expect(wrapper.emitted('close')).toBeTruthy()
        })
    })
})
