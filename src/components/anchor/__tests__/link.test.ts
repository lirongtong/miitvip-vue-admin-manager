import { mount } from '@vue/test-utils'
import { describe, expect, test } from 'vitest'
import MiAnchorLink from '../Link'

describe('MiAnchorLink', () => {
    test('正确渲染链接 (renders link correctly)', () => {
        const wrapper = mount(MiAnchorLink, {
            props: {
                id: 'test-link',
                title: 'Test Link',
                active: false
            }
        })
        expect(wrapper.html()).toContain('Test Link')
    })

    test('触发点击事件 (emits click event)', async () => {
        const wrapper = mount(MiAnchorLink, {
            props: {
                id: 'test-link',
                title: 'Test Link',
                active: false
            }
        })
        await wrapper.trigger('click')
        expect(wrapper.emitted().click).toBeTruthy()
    })
})
