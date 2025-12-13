import { mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import MiClock from '../Clock'
import styled from '../style/clock.module.less'
import { $tools } from '../../../utils/tools'

describe('MiClock', () => {
    let rafSpy: any
    let cafSpy: any

    beforeEach(() => {
        vi.useFakeTimers()
        rafSpy = vi.spyOn($tools, 'raf').mockImplementation(() => 123)
        cafSpy = vi.spyOn($tools, 'caf').mockImplementation(() => {})
    })

    afterEach(() => {
        vi.useRealTimers()
        rafSpy.mockRestore()
        cafSpy.mockRestore()
    })

    test('渲染刻度与指针结构（60 分刻度 + 12 小时刻度）', () => {
        const wrapper = mount(MiClock)

        expect(wrapper.find(`.${styled.container}`).exists()).toBe(true)
        expect(wrapper.findAll(`.${styled.anchor}`).length).toBe(48) // 60 - 12 个文字刻度
        expect(wrapper.findAll(`.${styled.minsText}`).length).toBe(12)
        expect(wrapper.findAll(`.${styled.hourText}`).length).toBe(12)

        // 三个旋转点（时/分/秒）
        expect(wrapper.findAll(`.${styled.point}`).length).toBe(3)
    })

    test('会调用 raf 启动动画，并在卸载时 caf 取消', () => {
        const wrapper = mount(MiClock)
        expect(rafSpy).toHaveBeenCalled()

        wrapper.unmount()
        expect(cafSpy).toHaveBeenCalledWith(123)
    })

    test('size 为字符串（如 240px）时不应产生 NaN 样式', () => {
        const wrapper = mount(MiClock, { props: { size: '240px' } })

        const containerStyle = wrapper.find(`.${styled.container}`).attributes('style') || ''
        expect(containerStyle).not.toContain('NaN')

        // 指针高度也不应是 NaN
        const hands = wrapper.findAll(`.${styled.hand}`)
        hands.forEach((h) => {
            const s = h.attributes('style') || ''
            expect(s).not.toContain('NaN')
        })
    })
})
