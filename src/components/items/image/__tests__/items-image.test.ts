import { mount, type VueWrapper } from '@vue/test-utils'
import { afterEach, describe, expect, test, vi } from 'vitest'
import { defineComponent, h, nextTick } from 'vue'
import MiItemsImage from '../Image'
import styled from '../style/image.module.less'

/* eslint-disable vue/one-component-per-file */
const MiImageStub = defineComponent({
    name: 'MiImage',
    props: { src: { type: String, default: '' } },
    setup(_props, { attrs }) {
        // 触发 onLoad 回调
        const onLoad = (attrs as any)?.onLoad
        if (typeof onLoad === 'function') {
            const parent = document.createElement('div')
            const img = document.createElement('img')
            Object.defineProperty(img, 'parentNode', { value: parent })
            Object.defineProperty(img, 'clientHeight', { value: 0 })
            onLoad(img)
        }
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

const TransitionStub = defineComponent({
    name: 'Transition',
    props: {
        name: { type: String, default: '' },
        appear: { type: Boolean, default: false }
    },
    setup(_props, { slots }) {
        return () => slots.default?.()
    }
})
/* eslint-enable vue/one-component-per-file */

describe('MiItemsImage', () => {
    const wrappers: VueWrapper[] = []

    afterEach(() => {
        wrappers.splice(0).forEach((w) => w.unmount())
        vi.restoreAllMocks()
        document.body.innerHTML = ''
    })

    test('hover.open=true 且 item 有 link 时，mouseenter 会显示按钮', async () => {
        const wrapper = mount(MiItemsImage, {
            props: {
                data: [
                    {
                        title: 't1',
                        subtitle: 's1',
                        intro: 'i1',
                        thumb: 'x.png',
                        link: '/go'
                    }
                ],
                hover: { open: true }
            },
            global: {
                stubs: {
                    MiImage: MiImageStub,
                    MiLink: MiLinkStub,
                    MiButton: MiButtonStub,
                    Transition: TransitionStub
                }
            },
            attachTo: document.body
        })
        wrappers.push(wrapper)

        await nextTick()
        expect(wrapper.find('[data-testid="mi-button"]').exists()).toBe(false)

        await wrapper.find(`.${styled.item}`).trigger('mouseenter')
        await nextTick()
        expect(wrapper.find('[data-testid="mi-button"]').exists()).toBe(true)

        await wrapper.find(`.${styled.item}`).trigger('mouseleave')
        await nextTick()
        expect(wrapper.find('[data-testid="mi-button"]').exists()).toBe(false)

        const link = wrapper.find('[data-testid="mi-link"]')
        expect(link.exists()).toBe(true)
        expect(link.attributes('data-path')).toBe('/go')
    })
})
