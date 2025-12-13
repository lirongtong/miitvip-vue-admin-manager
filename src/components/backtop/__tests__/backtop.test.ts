import { mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import { nextTick } from 'vue'
import { Tooltip } from 'ant-design-vue'
import MiBacktop from '../Backtop'
import styled from '../style/backtop.module.less'
import { $tools } from '../../../utils/tools'

const setWindowWidth = (width: number) => {
    Object.defineProperty(window, 'innerWidth', {
        value: width,
        writable: true,
        configurable: true
    })
}

describe('MiBacktop', () => {
    const onSpy = vi.spyOn($tools, 'on')
    const offSpy = vi.spyOn($tools, 'off')
    const isMobileSpy = vi.spyOn($tools, 'isMobile')
    const back2topSpy = vi.spyOn($tools, 'back2top')

    beforeEach(() => {
        onSpy.mockClear()
        offSpy.mockClear()
        isMobileSpy.mockReset().mockReturnValue(false)
        back2topSpy
            .mockReset()
            .mockImplementation((_container: any, _duration?: number, cb?: Function) => {
                cb && cb()
            })
    })

    afterEach(() => {
        vi.clearAllMocks()
    })

    test('默认不显示，滚动超过 offset 后显示', async () => {
        setWindowWidth(1024)
        const container = document.createElement('div')
        container.scrollTop = 0

        const wrapper = mount(MiBacktop, {
            props: {
                listenerContainer: container,
                offset: 200
            }
        })
        await nextTick()

        const elem = wrapper.find(`.${styled.container}`)
        expect(elem.exists()).toBe(true)
        expect((elem.element as HTMLElement).style.display).toBe('none')

        container.scrollTop = 300
        container.dispatchEvent(new Event('scroll'))
        await nextTick()

        expect((elem.element as HTMLElement).style.display).not.toBe('none')
    })

    test('点击触发回顶并触发 end 事件', async () => {
        setWindowWidth(1024)
        const container = document.createElement('div')
        container.scrollTop = 300

        const wrapper = mount(MiBacktop, {
            props: {
                listenerContainer: container,
                offset: 200,
                duration: 123
            }
        })
        await nextTick()

        container.dispatchEvent(new Event('scroll'))
        await nextTick()

        await wrapper.find(`.${styled.inner}`).trigger('click')

        expect(back2topSpy).toHaveBeenCalled()
        expect(back2topSpy.mock.calls[0][0]).toBe(container)
        expect(back2topSpy.mock.calls[0][1]).toBe(123)
        expect(wrapper.emitted().end).toBeTruthy()
    })

    test('桌面端显示 Tooltip，移动端（小屏）不显示 Tooltip', async () => {
        const container = document.createElement('div')

        setWindowWidth(1024)
        const desktop = mount(MiBacktop, {
            props: { listenerContainer: container }
        })
        await nextTick()
        expect(desktop.findComponent(Tooltip).exists()).toBe(true)
        desktop.unmount()

        setWindowWidth(500)
        const mobile = mount(MiBacktop, {
            props: { listenerContainer: container }
        })
        await nextTick()
        expect(mobile.findComponent(Tooltip).exists()).toBe(false)
    })

    test('会绑定 scroll 监听，并在卸载时解绑', async () => {
        setWindowWidth(1024)
        const container = document.createElement('div')

        const wrapper = mount(MiBacktop, {
            props: { listenerContainer: container }
        })
        await nextTick()

        // watch(immediate) + onMounted 都可能触发绑定，这里只验证至少绑定过一次
        expect(onSpy.mock.calls.some((c) => c[0] === container && c[1] === 'scroll')).toBe(true)

        wrapper.unmount()

        // onBeforeUnmount 里会先 back2top(0) 再 off(scroll)
        expect(offSpy.mock.calls.some((c) => c[0] === container && c[1] === 'scroll')).toBe(true)
    })
})
