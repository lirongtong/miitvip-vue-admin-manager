/* eslint-disable vue/one-component-per-file */
import { mount, type VueWrapper } from '@vue/test-utils'
import { afterEach, describe, expect, test, vi } from 'vitest'

import MiQuote from '../Quote'

vi.mock('../../_utils/theme', () => ({ default: () => null }))

describe('MiQuote', () => {
    const wrappers: VueWrapper[] = []

    afterEach(() => {
        wrappers.splice(0).forEach((w) => w.unmount())
        vi.restoreAllMocks()
        document.body.innerHTML = ''
    })

    test('渲染默认插槽内容', () => {
        const wrapper = mount(MiQuote, {
            slots: {
                default: () => 'hello'
            }
        })
        wrappers.push(wrapper)

        expect(wrapper.text()).toContain('hello')
    })

    test('background / color 会体现在根节点 style 上', () => {
        const wrapper = mount(MiQuote, {
            props: {
                background: 'rgb(1, 2, 3)',
                color: '#fff'
            },
            slots: {
                default: () => 'x'
            }
        })
        wrappers.push(wrapper)

        const style = wrapper.attributes('style')
        expect(style).toContain('background: rgb(1, 2, 3)')
        expect(style).toContain('color: #fff')
    })
})
