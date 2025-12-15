import { mount, type VueWrapper } from '@vue/test-utils'
import { afterEach, describe, expect, test } from 'vitest'
import { h, nextTick } from 'vue'
import MiItemsText from '../Text'

describe('MiItemsText', () => {
    const wrappers: VueWrapper[] = []

    afterEach(() => {
        wrappers.splice(0).forEach((w) => w.unmount())
        document.body.innerHTML = ''
    })

    test('string items 会渲染 marker 与文本，并支持 item slot', async () => {
        const wrapper = mount(MiItemsText, {
            props: {
                items: ['a', 'b'],
                marker: { type: 'number' },
                indent: 10
            },
            slots: {
                item: ({ index }: any) => h('div', { 'data-testid': 'slot', 'data-index': index })
            },
            attachTo: document.body
        })
        wrappers.push(wrapper)

        await nextTick()
        expect(wrapper.text()).toContain('a')
        expect(wrapper.text()).toContain('b')
        expect(wrapper.findAll('[data-testid="slot"]').length).toBe(2)
    })
})
