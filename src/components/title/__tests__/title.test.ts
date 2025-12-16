import { mount, type VueWrapper } from '@vue/test-utils'
import { afterEach, describe, expect, test, vi } from 'vitest'
import { h } from 'vue'

import MiTitle from '../Title'
import styled from '../style/title.module.less'

describe('MiTitle', () => {
    const wrappers: VueWrapper[] = []

    afterEach(() => {
        wrappers.splice(0).forEach((w) => w.unmount())
        vi.restoreAllMocks()
        document.body.innerHTML = ''
    })

    test('渲染必需的标题文本', () => {
        const wrapper = mount(MiTitle, {
            props: {
                title: '主标题'
            },
            attachTo: document.body
        })
        wrappers.push(wrapper)

        const h2 = wrapper.find('h2')
        expect(h2.exists()).toBe(true)
        expect(h2.attributes('class')).toContain(styled.content)
        expect(h2.html()).toContain('主标题')
    })

    test('center=true 时容器添加居中 class', () => {
        const wrapper = mount(MiTitle, {
            props: {
                title: '居中标题',
                center: true
            },
            attachTo: document.body
        })
        wrappers.push(wrapper)

        const inner = wrapper.find(`.${styled.inner}`)
        expect(inner.exists()).toBe(true)
        expect(inner.classes()).toContain(styled.center)
    })

    test('color 和 margin 配置会透传到 style', () => {
        const wrapper = mount(MiTitle, {
            props: {
                title: '带样式标题',
                color: '#ff0000',
                margin: { top: 10, bottom: 20 }
            },
            attachTo: document.body
        })
        wrappers.push(wrapper)

        const h2 = wrapper.find('h2')
        expect(h2.attributes('style')).toContain('color: rgb(255, 0, 0)')
        expect(h2.attributes('style')).toContain('margin-top')
        expect(h2.attributes('style')).toContain('margin-bottom')
    })

    test('额外内容通过 extra 插槽渲染在 extra 区域', () => {
        const wrapper = mount(MiTitle, {
            props: {
                title: '有 extra'
            },
            slots: {
                extra: () => h('button', { class: 'extra-btn' }, '操作')
            },
            attachTo: document.body
        })
        wrappers.push(wrapper)

        const extra = wrapper.find(`.${styled.extra}`)
        expect(extra.exists()).toBe(true)
        const btn = extra.find('button.extra-btn')
        expect(btn.exists()).toBe(true)
        expect(btn.text()).toBe('操作')
    })
})
