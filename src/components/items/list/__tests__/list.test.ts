import { mount, type VueWrapper } from '@vue/test-utils'
import { afterEach, describe, expect, test, vi } from 'vitest'
import { defineComponent, h, nextTick } from 'vue'
import MiItemsList from '../List'
import styled from '../style/list.module.less'

/* eslint-disable vue/one-component-per-file */
const MiImageStub = defineComponent({
    name: 'MiImage',
    setup() {
        return () => h('img', { 'data-testid': 'thumb' })
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

const MiButtonStub = defineComponent({
    name: 'MiButton',
    setup() {
        return () => h('button', { 'data-testid': 'mi-button' }, 'btn')
    }
})
/* eslint-enable vue/one-component-per-file */

describe('MiItemsList', () => {
    const wrappers: VueWrapper[] = []

    afterEach(() => {
        wrappers.splice(0).forEach((w) => w.unmount())
        vi.restoreAllMocks()
        document.body.innerHTML = ''
    })

    test('item.link 存在时渲染 MiLink，hover 时显示按钮', async () => {
        const wrapper = mount(MiItemsList, {
            props: {
                data: [
                    {
                        thumb: 'x.png',
                        title: 't',
                        intro: 'i',
                        date: 'd',
                        link: '/a'
                    }
                ]
            },
            global: {
                stubs: { MiImage: MiImageStub, MiLink: MiLinkStub, MiButton: MiButtonStub }
            },
            attachTo: document.body
        })
        wrappers.push(wrapper)

        await nextTick()
        const link = wrapper.find('[data-testid="mi-link"]')
        expect(link.exists()).toBe(true)
        expect(link.attributes('data-path')).toBe('/a')

        expect(wrapper.find('[data-testid="mi-button"]').exists()).toBe(false)
        await wrapper.find(`.${styled.item}`).trigger('mouseenter')
        await nextTick()
        expect(wrapper.find('[data-testid="mi-button"]').exists()).toBe(true)
    })

    test('dividing.display=false 时分割线为透明样式', async () => {
        const wrapper = mount(MiItemsList, {
            props: {
                data: [
                    { title: 't1', intro: 'i1', date: 'd1' },
                    { title: 't2', intro: 'i2', date: 'd2' }
                ],
                dividing: { display: false }
            },
            global: {
                stubs: { MiImage: MiImageStub, MiLink: MiLinkStub, MiButton: MiButtonStub }
            },
            attachTo: document.body
        })
        wrappers.push(wrapper)

        await nextTick()
        const lines = wrapper.findAll(`.${styled.line}`)
        expect(lines.length).toBeGreaterThan(0)
        expect(lines[0].classes()).toContain(styled.lineTransparent)
    })
})
