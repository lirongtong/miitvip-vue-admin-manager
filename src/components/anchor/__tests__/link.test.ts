import { mount } from '@vue/test-utils'
import { describe, expect, test } from 'vitest'
import MiAnchorLink from '../Link'
import styled from '../style/link.module.less'

describe('MiAnchorLink', () => {
    test('渲染 title & 默认 icon', () => {
        const wrapper = mount(MiAnchorLink, {
            props: {
                id: 'test-id',
                title: 'Test Title',
                active: false
            }
        })

        expect(wrapper.text()).toContain('Test Title')
        expect(wrapper.classes()).toContain(styled.container)
        expect(wrapper.classes()).not.toContain(styled.active)
        expect(wrapper.findComponent({ name: 'TagOutlined' }).exists()).toBe(true)
        expect(wrapper.findComponent({ name: 'StarOutlined' }).exists()).toBe(false)
    })

    test('active=true 时显示 active class 与 StarOutlined', () => {
        const wrapper = mount(MiAnchorLink, {
            props: {
                id: 'test-id',
                title: 'Test Title',
                active: true
            }
        })

        expect(wrapper.classes()).toContain(styled.active)
        expect(wrapper.findComponent({ name: 'StarOutlined' }).exists()).toBe(true)
        expect(wrapper.findComponent({ name: 'TagOutlined' }).exists()).toBe(false)
    })

    test('点击会 emit click 并携带 payload', async () => {
        const wrapper = mount(MiAnchorLink, {
            props: {
                id: 'test-id',
                title: 'Test Title',
                active: false
            }
        })

        await wrapper.trigger('click')

        const emitted = wrapper.emitted().click
        expect(emitted).toBeTruthy()
        expect(emitted?.[0]?.[0]).toEqual({ id: 'test-id', title: 'Test Title' })
        expect(emitted?.[0]?.[1]).toBeInstanceOf(Event)
    })
})
