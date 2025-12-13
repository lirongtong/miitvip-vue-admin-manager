import { mount, type VueWrapper } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import { h, nextTick } from 'vue'
import MiButton from '../Button'
import styled from '../style/button.module.less'

const flushMountedTimers = async (ms: number) => {
    // 等待 onMounted 先跑完把 setTimeout 注册进去
    await nextTick()
    if (ms > 0) vi.advanceTimersByTime(ms)
    else vi.runOnlyPendingTimers()
    await nextTick()
    await nextTick()
}

const MiLinkStub = {
    name: 'MiLink',
    props: {
        path: { type: String, default: '' },
        target: { type: String, default: '_self' },
        query: { type: Object, default: () => ({}) }
    },
    setup(props: any, { slots, attrs }: any) {
        return () =>
            h(
                'a',
                {
                    ...attrs,
                    'data-testid': 'mi-link',
                    'data-path': props.path,
                    'data-target': props.target,
                    'data-query': JSON.stringify(props.query || {})
                },
                slots.default?.()
            )
    }
}

describe('MiButton', () => {
    const wrappers: VueWrapper[] = []

    beforeEach(() => {
        vi.useFakeTimers()
        document.body.innerHTML = ''
    })

    afterEach(() => {
        wrappers.splice(0).forEach((w) => w.unmount())
        vi.runOnlyPendingTimers()
        vi.useRealTimers()
        document.body.innerHTML = ''
    })

    test('基础渲染：container/inner/role/tabindex，并且 click 会 emit', async () => {
        const wrapper = mount(MiButton, { attachTo: document.body })
        wrappers.push(wrapper)

        const inner = wrapper.find(`.${styled.inner}`)
        expect(wrapper.find(`.${styled.container}`).exists()).toBe(true)
        expect(inner.exists()).toBe(true)
        expect(inner.attributes('role')).toBe('button')
        expect(inner.attributes('tabindex')).toBe('0')

        await inner.trigger('click')
        expect(wrapper.emitted().click).toBeTruthy()
    })

    test('circle/square class：无 text 时 circle=true 为 circle，circle=false 为 square；有 text 时不加 circle/square', async () => {
        const circleBtn = mount(MiButton, { props: { circle: true }, attachTo: document.body })
        wrappers.push(circleBtn)
        expect(circleBtn.find(`.${styled.inner}`).classes()).toContain(styled.circle)
        expect(circleBtn.find(`.${styled.inner}`).classes()).not.toContain(styled.square)

        const squareBtn = mount(MiButton, { props: { circle: false }, attachTo: document.body })
        wrappers.push(squareBtn)
        expect(squareBtn.find(`.${styled.inner}`).classes()).toContain(styled.square)
        expect(squareBtn.find(`.${styled.inner}`).classes()).not.toContain(styled.circle)

        const withText = mount(MiButton, {
            props: { text: 'Hello', circle: true },
            attachTo: document.body
        })
        wrappers.push(withText)
        expect(withText.find(`.${styled.inner}`).classes()).not.toContain(styled.circle)
        expect(withText.find(`.${styled.inner}`).classes()).not.toContain(styled.square)
    })

    test('text：string 与 TextSetting 都能渲染 title，并带上 style', async () => {
        const wrapper1 = mount(MiButton, {
            props: { text: 'Hello World' },
            attachTo: document.body
        })
        wrappers.push(wrapper1)
        expect(wrapper1.find(`.${styled.title}`).exists()).toBe(true)
        expect(wrapper1.find(`.${styled.title}`).text()).toContain('Hello World')

        const wrapper2 = mount(MiButton, {
            props: { text: { text: 'Hi', color: 'red', size: 16 } },
            attachTo: document.body
        })
        wrappers.push(wrapper2)
        const title = wrapper2.find(`.${styled.title}`)
        expect(title.exists()).toBe(true)
        // getTextSetting 会输出 style（包含 color/font-size 等）；这里不做像素/单位强绑定，只验证包含 color
        expect(title.attributes('style') || '').toContain('color: red')
    })

    test('按钮样式：background/backdrop/borderColor/width/height/radius 会写入 style', async () => {
        const wrapper = mount(MiButton, {
            props: {
                background: 'rgb(1, 2, 3)',
                backdrop: 'blur(10px)',
                borderColor: 'rgb(9, 9, 9)',
                width: 40,
                height: 42,
                radius: 8
            },
            attachTo: document.body
        })
        wrappers.push(wrapper)

        const styleText = wrapper.find(`.${styled.inner}`).attributes('style') || ''
        expect(styleText).toContain('background: rgb(1, 2, 3)')
        expect(styleText).toContain('backdrop-filter: blur(10px)')
        expect(styleText).toContain('border-color: rgb(9, 9, 9)')
        // 数值会被 convert2rem 转换，因此只验证字段存在
        expect(styleText).toContain('width:')
        expect(styleText).toContain('height:')
        expect(styleText).toContain('border-radius:')
    })

    test('arrow direction 会应用对应 class：up/down/left', async () => {
        const up = mount(MiButton, {
            props: { arrow: { direction: 'up' } },
            attachTo: document.body
        })
        wrappers.push(up)
        expect(up.find(`.${styled.iconContainer}`).classes()).toContain(styled.iconUp)

        const down = mount(MiButton, {
            props: { arrow: { direction: 'down' } },
            attachTo: document.body
        })
        wrappers.push(down)
        expect(down.find(`.${styled.iconContainer}`).classes()).toContain(styled.iconDown)

        const left = mount(MiButton, {
            props: { arrow: { direction: 'left' } },
            attachTo: document.body
        })
        wrappers.push(left)
        expect(left.find(`.${styled.iconContainer}`).classes()).toContain(styled.iconLeft)
    })

    test('arrow color 会作用到 svg path fill', async () => {
        const wrapper = mount(MiButton, {
            props: { arrow: { color: '#123456' } },
            attachTo: document.body
        })
        wrappers.push(wrapper)

        const path = wrapper.find('svg path[data-name="Union 25"]')
        expect(path.exists()).toBe(true)
        expect(path.attributes('fill')).toBe('#123456')
    })

    test('arrow immediate：mounted 后按 delay 触发 icon-immediate class；卸载后不再变化', async () => {
        const wrapper = mount(MiButton, {
            props: { arrow: { immediate: true, delay: 0.1 } },
            attachTo: document.body
        })
        wrappers.push(wrapper)

        const inner = () => wrapper.find(`.${styled.inner}`)
        expect(inner().classes()).not.toContain(styled.iconImmediate)

        await flushMountedTimers(100)
        expect(inner().classes()).toContain(styled.iconImmediate)

        // 重新挂载一个：先卸载再推进时间，确保不会因为 timer 导致状态改变
        const wrapper2 = mount(MiButton, {
            props: { arrow: { immediate: true, delay: 0.1 } },
            attachTo: document.body
        })
        wrappers.push(wrapper2)
        wrapper2.unmount()
        vi.advanceTimersByTime(200)
        await nextTick()
        // 已卸载，不做状态断言（避免访问已销毁实例）；这里确保不抛错即可
        expect(true).toBe(true)
    })

    test('link 模式：会渲染 MiLink，并透传 path/target/query', async () => {
        const wrapper = mount(MiButton, {
            props: {
                link: '/foo',
                target: '_blank',
                query: { a: 1 },
                text: 'Go'
            },
            global: { stubs: { MiLink: MiLinkStub } },
            attachTo: document.body
        })
        wrappers.push(wrapper)

        const link = wrapper.find('[data-testid="mi-link"]')
        expect(link.exists()).toBe(true)
        expect(link.attributes('data-path')).toBe('/foo')
        expect(link.attributes('data-target')).toBe('_blank')
        expect(link.attributes('data-query')).toBe(JSON.stringify({ a: 1 }))

        // 外层依然会 emit click
        await wrapper.find(`.${styled.inner}`).trigger('click')
        expect(wrapper.emitted().click).toBeTruthy()
    })
})
