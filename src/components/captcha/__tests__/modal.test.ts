import { mount, type VueWrapper } from '@vue/test-utils'
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, test, vi } from 'vitest'
import { nextTick } from 'vue'
import MiCaptchaModal from '../Modal'
import styled from '../style/modal.module.less'
import { $tools } from '../../../utils/tools'

// happy-dom 默认没有完整 canvas 实现，这里做最小 mock 以覆盖绘制流程
const mockCanvasCtx = () => ({
    drawImage: vi.fn(),
    beginPath: vi.fn(),
    closePath: vi.fn(),
    fillText: vi.fn(),
    save: vi.fn(),
    restore: vi.fn(),
    arc: vi.fn(),
    lineTo: vi.fn(),
    moveTo: vi.fn(),
    stroke: vi.fn(),
    clip: vi.fn(),
    fill: vi.fn(),
    clearRect: vi.fn(),
    getImageData: vi.fn(() => ({ data: new Uint8ClampedArray(4) })),
    putImageData: vi.fn()
})

class InstantImage {
    onload: null | (() => void) = null
    crossOrigin = ''
    private _src = ''
    set src(v: string) {
        this._src = v
        // 模拟异步加载完成
        setTimeout(() => this.onload && this.onload(), 0)
    }
    get src() {
        return this._src
    }
}

describe('MiCaptchaModal', () => {
    const wrappers: VueWrapper[] = []
    let originImage: any
    let originGetContext: any
    let originToDataURL: any

    beforeAll(() => {
        originImage = (globalThis as any).Image
        ;(globalThis as any).Image = InstantImage as any

        originGetContext = HTMLCanvasElement.prototype.getContext
        originToDataURL = HTMLCanvasElement.prototype.toDataURL

        HTMLCanvasElement.prototype.getContext = vi.fn(() => mockCanvasCtx()) as any
        HTMLCanvasElement.prototype.toDataURL = vi.fn(() => 'data:image/png;base64,xxx') as any
    })

    afterAll(() => {
        ;(globalThis as any).Image = originImage
        HTMLCanvasElement.prototype.getContext = originGetContext
        HTMLCanvasElement.prototype.toDataURL = originToDataURL
    })

    beforeEach(() => {
        vi.useFakeTimers()
        vi.spyOn($tools, 'randomNumberInRange')
            .mockImplementationOnce(() => 100)
            .mockImplementationOnce(() => 80)
    })

    afterEach(() => {
        wrappers.splice(0).forEach((w) => w.unmount())
        vi.runOnlyPendingTimers()
        vi.useRealTimers()
        vi.restoreAllMocks()
    })

    test('maskClosable=false 时：点击遮罩不关闭；点击关闭按钮可以关闭（修复点）', async () => {
        const wrapper = mount(MiCaptchaModal, {
            props: {
                open: true,
                mask: true,
                maskClosable: false,
                position: { left: '50%', top: '50%' },
                captchaVisible: true
            },
            global: {
                stubs: {
                    Tooltip: { template: '<div><slot /></div>' },
                    ATooltip: { template: '<div><slot /></div>' },
                    MiLink: { template: '<a><slot /></a>' }
                }
            },
            attachTo: document.body
        })
        wrappers.push(wrapper)

        await nextTick()
        vi.runOnlyPendingTimers() // Image onload
        await nextTick()

        // 点击遮罩：不应关闭
        await wrapper.find(`.${styled.mask}`).trigger('click')
        await nextTick()
        expect(wrapper.emitted()['update:open']).toBeFalsy()

        // 点击关闭 icon：应关闭并 emit close
        await wrapper.findComponent({ name: 'CloseCircleOutlined' }).trigger('click')
        vi.advanceTimersByTime(450)
        await nextTick()

        expect(wrapper.emitted()['update:open']).toBeTruthy()
        expect(wrapper.emitted()['update:open']?.[0]).toEqual([false])
        expect(wrapper.emitted().close?.[0]?.[0]?.status).toBe('close')
    })

    test('拖动到正确位置会校验成功并 close(status=success)', async () => {
        const wrapper = mount(MiCaptchaModal, {
            props: {
                open: true,
                mask: false,
                maskClosable: true,
                position: { left: '50%', top: '50%' },
                captchaVisible: true,
                // 放宽偏差，便于稳定命中
                offset: 5
            },
            global: {
                stubs: {
                    Tooltip: { template: '<div><slot /></div>' },
                    ATooltip: { template: '<div><slot /></div>' },
                    MiLink: { template: '<a><slot /></a>' }
                }
            },
            attachTo: document.body
        })
        wrappers.push(wrapper)

        await nextTick()
        vi.runOnlyPendingTimers() // Image onload
        await nextTick()

        const slider = wrapper.find(`.${styled.slider}`).element as any
        const sliderBtn = wrapper.find(`.${styled.sliderBtn}`).element as any

        slider.getBoundingClientRect = vi.fn(() => ({ left: 0, top: 0 }))
        sliderBtn.getBoundingClientRect = vi.fn(() => ({ left: 10, top: 0 }))

        // pointerdown：clientX=20 -> offset=10
        await wrapper.find(`.${styled.sliderBtn}`).trigger('pointerdown', {
            clientX: 20,
            preventDefault: () => {},
            stopPropagation: () => {}
        })
        await nextTick()

        // pointermove：clientX=104 -> moveX=94；coordinateX=94+6=100（命中 coordinate.x=100）
        await wrapper.find(`.${styled.container}`).trigger('pointermove', { clientX: 104 })
        await nextTick()

        // pointerup 触发校验
        window.dispatchEvent(new Event('pointerup'))

        // success: 400ms 后触发 handleClose；handleClose 再 400ms emit close
        vi.advanceTimersByTime(900)
        await nextTick()

        expect(wrapper.emitted().close?.[0]?.[0]?.status).toBe('success')
    })

    test('失败次数达到 maxTries 会 close(status=frequently)', async () => {
        vi.restoreAllMocks()
        vi.useFakeTimers()
        vi.spyOn($tools, 'randomNumberInRange')
            .mockImplementationOnce(() => 100)
            .mockImplementationOnce(() => 80)

        const wrapper = mount(MiCaptchaModal, {
            props: {
                open: true,
                mask: false,
                maskClosable: true,
                maxTries: 1,
                position: { left: '50%', top: '50%' },
                captchaVisible: true,
                offset: 2
            },
            global: {
                stubs: {
                    Tooltip: { template: '<div><slot /></div>' },
                    ATooltip: { template: '<div><slot /></div>' },
                    MiLink: { template: '<a><slot /></a>' }
                }
            },
            attachTo: document.body
        })
        wrappers.push(wrapper)

        await nextTick()
        vi.runOnlyPendingTimers()
        await nextTick()

        const slider = wrapper.find(`.${styled.slider}`).element as any
        const sliderBtn = wrapper.find(`.${styled.sliderBtn}`).element as any
        slider.getBoundingClientRect = vi.fn(() => ({ left: 0, top: 0 }))
        sliderBtn.getBoundingClientRect = vi.fn(() => ({ left: 10, top: 0 }))

        await wrapper.find(`.${styled.sliderBtn}`).trigger('pointerdown', {
            clientX: 20,
            preventDefault: () => {},
            stopPropagation: () => {}
        })
        await nextTick()

        // 故意移动到错误位置：moveX=0 => coordinateX=6，不命中 100
        await wrapper.find(`.${styled.container}`).trigger('pointermove', { clientX: 10 })
        await nextTick()
        window.dispatchEvent(new Event('pointerup'))

        // 1600ms 后触发 frequently；handleClose 再 400ms emit close
        vi.advanceTimersByTime(2500)
        await nextTick()

        expect(wrapper.emitted().close?.[0]?.[0]?.status).toBe('frequently')
    })
})
