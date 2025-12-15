import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, test, vi } from 'vitest'
import { nextTick } from 'vue'
import MiImage from '../Image'

const flushPromises = async () => {
    await Promise.resolve()
    await Promise.resolve()
}

describe('MiImage', () => {
    const originals = {
        Image: globalThis.Image
    }

    afterEach(() => {
        globalThis.Image = originals.Image
        vi.restoreAllMocks()
        document.body.innerHTML = ''
    })

    test('加载完成会 emit load，并传出 img element，同时支持透传 style/class', async () => {
        let onload: null | (() => void) = null

        // mock window.Image（用于预加载）
        // eslint-disable-next-line @typescript-eslint/no-extraneous-class
        class FakeImage {
            src = ''
            onload: any = null
            onerror: any = null
            constructor() {
                onload = () => this.onload?.()
            }
        }
        globalThis.Image = FakeImage as any

        const wrapper = mount(MiImage, {
            props: {
                src: 'x.png',
                width: 10,
                height: 12,
                radius: 8
            },
            attrs: {
                class: 'c1',
                style: { border: '1px solid red' }
            },
            attachTo: document.body
        })

        await nextTick()
        await flushPromises()

        expect(onload).toBeTruthy()
        onload?.()
        await nextTick()

        expect(wrapper.emitted().load).toBeTruthy()
        const payload = wrapper.emitted().load?.[0]?.[0] as HTMLImageElement
        expect(payload).toBeInstanceOf(HTMLImageElement)

        const img = wrapper.find('img')
        expect(img.classes()).toContain('c1')
        expect(img.attributes('style') || '').toContain('border: 1px solid red')
        expect(img.attributes('style') || '').toContain('width:')
        expect(img.attributes('style') || '').toContain('height:')
        expect(img.attributes('style') || '').toContain('border-radius:')

        wrapper.unmount()
    })
})
