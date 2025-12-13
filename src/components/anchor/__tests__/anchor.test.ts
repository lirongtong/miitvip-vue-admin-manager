import { mount, type VueWrapper } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import { nextTick } from 'vue'
import MiAnchor from '../Anchor'
import MiAnchorLink from '../Link'
import styled from '../style/anchor.module.less'
import { $tools } from '../../../utils/tools'

const createHeading = (tag: string, id: string, text: string, offset: number) => {
    const el = document.createElement(tag)
    el.id = id
    el.textContent = text
    el.setAttribute('data-offset', String(offset))
    return el
}

const flushDelayInit = async (ms: number) => {
    // 等待 onMounted 执行，确保 delayInit 的 setTimeout 已经被注册
    await nextTick()
    if (ms > 0) vi.advanceTimersByTime(ms)
    else vi.runOnlyPendingTimers()
    await nextTick()
    await nextTick()
}

describe('MiAnchor', () => {
    let container: HTMLDivElement
    let offsetSpy: any
    let scrollSpy: any
    let isMobileSpy: any
    const wrappers: VueWrapper[] = []

    beforeEach(() => {
        vi.useFakeTimers()
        document.body.innerHTML = ''

        container = document.createElement('div')
        container.scrollTop = 0

        offsetSpy = vi
            .spyOn($tools, 'getElementActualOffsetTopOrLeft')
            .mockImplementation((el: any) => {
                const v = el?.getAttribute?.('data-offset')
                return v ? parseInt(v, 10) : 0
            })

        scrollSpy = vi.spyOn($tools, 'scrollToPos').mockImplementation(() => {})
        isMobileSpy = vi.spyOn($tools, 'isMobile').mockReturnValue(false)
    })

    afterEach(() => {
        wrappers.splice(0).forEach((w) => w.unmount())
        vi.runOnlyPendingTimers()
        vi.useRealTimers()

        offsetSpy.mockRestore()
        scrollSpy.mockRestore()
        isMobileSpy.mockRestore()

        document.body.innerHTML = ''
    })

    test('delayInit 前不会初始化，delayInit 后生成列表并设置初始 open/sticky', async () => {
        const collect = document.createElement('div')
        collect.id = 'collect'
        collect.appendChild(createHeading('h1', 'h1', 'H1', 0))
        collect.appendChild(createHeading('h2', 'h2', 'H2', 300))
        document.body.appendChild(collect)

        const wrapper = mount(MiAnchor, {
            props: {
                collectContainer: '#collect',
                listenerContainer: container,
                delayInit: 500,
                affix: false,
                affixText: 'A B'
            },
            attachTo: document.body
        })
        wrappers.push(wrapper)

        // 未到 delayInit：列表尚未收集，组件不渲染（条件依赖 list.length）
        expect(wrapper.find(`.${styled.container}`).exists()).toBe(false)

        await flushDelayInit(500)

        expect(wrapper.find(`.${styled.container}`).exists()).toBe(true)
        expect(wrapper.findAllComponents(MiAnchorLink).length).toBe(2)

        // affix=false：默认 sticky 显示、anchor 收起
        expect((wrapper.find(`.${styled.anchor}`).element as HTMLElement).style.display).toBe(
            'none'
        )
        expect((wrapper.find(`.${styled.sticky}`).element as HTMLElement).style.display).not.toBe(
            'none'
        )

        // affixText 会拆分成字符，空格用 stickyTextEmpty 标记
        const texts = wrapper.findAll(`.${styled.stickyText} > span`)
        expect(texts.length).toBe(3)
        expect(texts.some((n) => n.classes().includes(styled.stickyTextEmpty))).toBe(true)
    })

    test('mouseenter sticky 展开，mouseleave anchor 收起（非 affix）', async () => {
        const collect = document.createElement('div')
        collect.id = 'collect'
        collect.appendChild(createHeading('h1', 'h1', 'H1', 0))
        document.body.appendChild(collect)

        const wrapper = mount(MiAnchor, {
            props: {
                collectContainer: '#collect',
                listenerContainer: container,
                delayInit: 0,
                affix: false
            },
            attachTo: document.body
        })
        wrappers.push(wrapper)
        await flushDelayInit(0)

        await wrapper.find(`.${styled.sticky}`).trigger('mouseenter')
        await nextTick()
        expect((wrapper.find(`.${styled.anchor}`).element as HTMLElement).style.display).not.toBe(
            'none'
        )

        await wrapper.find(`.${styled.anchor}`).trigger('mouseleave')
        await nextTick()
        // v-show + Transition：等待离场动画结束后 display 才会变为 none
        vi.advanceTimersByTime(450)
        await nextTick()
        expect((wrapper.find(`.${styled.anchor}`).element as HTMLElement).style.display).toBe(
            'none'
        )
        expect((wrapper.find(`.${styled.sticky}`).element as HTMLElement).style.display).not.toBe(
            'none'
        )
    })

    test('点击 PushpinOutlined 切换 affix：affix=true 时 mouseleave 不会收起', async () => {
        const collect = document.createElement('div')
        collect.id = 'collect'
        collect.appendChild(createHeading('h1', 'h1', 'H1', 0))
        document.body.appendChild(collect)

        const wrapper = mount(MiAnchor, {
            props: {
                collectContainer: '#collect',
                listenerContainer: container,
                delayInit: 0,
                affix: false
            },
            attachTo: document.body
        })
        wrappers.push(wrapper)
        await flushDelayInit(0)

        await wrapper.find(`.${styled.sticky}`).trigger('mouseenter')
        await nextTick()

        const pushpin = wrapper.findComponent({ name: 'PushpinOutlined' })
        await pushpin.trigger('click')
        await nextTick()

        await wrapper.find(`.${styled.anchor}`).trigger('mouseleave')
        await nextTick()
        expect((wrapper.find(`.${styled.anchor}`).element as HTMLElement).style.display).not.toBe(
            'none'
        )
    })

    test('移动端下从 affix=true 切换为 affix=false 会自动收起', async () => {
        isMobileSpy.mockReturnValue(true)

        const collect = document.createElement('div')
        collect.id = 'collect'
        collect.appendChild(createHeading('h1', 'h1', 'H1', 0))
        document.body.appendChild(collect)

        const wrapper = mount(MiAnchor, {
            props: {
                collectContainer: '#collect',
                listenerContainer: container,
                delayInit: 0,
                affix: true
            },
            attachTo: document.body
        })
        wrappers.push(wrapper)
        await flushDelayInit(0)

        // affix=true：默认 open=true sticky=false
        expect((wrapper.find(`.${styled.anchor}`).element as HTMLElement).style.display).not.toBe(
            'none'
        )
        expect((wrapper.find(`.${styled.sticky}`).element as HTMLElement).style.display).toBe(
            'none'
        )

        const pushpin = wrapper.findComponent({ name: 'PushpinOutlined' })
        await pushpin.trigger('click') // true -> false
        await nextTick()
        vi.advanceTimersByTime(450)
        await nextTick()

        expect((wrapper.find(`.${styled.anchor}`).element as HTMLElement).style.display).toBe(
            'none'
        )
        expect((wrapper.find(`.${styled.sticky}`).element as HTMLElement).style.display).not.toBe(
            'none'
        )
    })

    test('点击 CloseCircleOutlined 关闭，并在 400ms 后移除 DOM 节点', async () => {
        const collect = document.createElement('div')
        collect.id = 'collect'
        collect.appendChild(createHeading('h1', 'h1', 'H1', 0))
        document.body.appendChild(collect)

        const wrapper = mount(MiAnchor, {
            props: {
                collectContainer: '#collect',
                listenerContainer: container,
                delayInit: 0,
                affix: true
            },
            attachTo: document.body
        })
        wrappers.push(wrapper)
        await flushDelayInit(0)

        expect(wrapper.find(`.${styled.anchor}`).exists()).toBe(true)
        expect(wrapper.find(`.${styled.sticky}`).exists()).toBe(true)

        const close = wrapper.findComponent({ name: 'CloseCircleOutlined' })
        await close.trigger('click')
        await nextTick()

        // sticky 立即移除
        expect(wrapper.find(`.${styled.sticky}`).exists()).toBe(false)

        vi.advanceTimersByTime(400)
        await nextTick()
        expect(wrapper.find(`.${styled.anchor}`).exists()).toBe(false)
    })

    test('滚动会更新激活态：active link 随 scrollTop + scrollOffset 变化', async () => {
        const collect = document.createElement('div')
        collect.id = 'collect'
        collect.appendChild(createHeading('h1', 'h1', 'H1', 0))
        collect.appendChild(createHeading('h2', 'h2', 'H2', 500))
        collect.appendChild(createHeading('h3', 'h3', 'H3', 900))
        document.body.appendChild(collect)

        const wrapper = mount(MiAnchor, {
            props: {
                collectContainer: '#collect',
                listenerContainer: container,
                delayInit: 0,
                affix: true,
                scrollOffset: 80
            },
            attachTo: document.body
        })
        wrappers.push(wrapper)
        await flushDelayInit(0)

        const links = () => wrapper.findAllComponents(MiAnchorLink)

        // init() 会调用一次 handleContainerScroll，初始 top=0+80 => 第一个 active
        expect(links()[0].props('active')).toBe(true)
        expect(links()[1].props('active')).toBe(false)

        container.scrollTop = 600 // top=680，落在第二段
        container.dispatchEvent(new Event('scroll'))
        await nextTick()

        expect(links()[0].props('active')).toBe(false)
        expect(links()[1].props('active')).toBe(true)
    })

    test('点击链接会触发滚动、更新激活态、emit click，并在 manual 期间忽略滚动更新', async () => {
        const collect = document.createElement('div')
        collect.id = 'collect'
        collect.appendChild(createHeading('h1', 'h1', 'H1', 0))
        collect.appendChild(createHeading('h2', 'h2', 'H2', 500))
        document.body.appendChild(collect)

        const wrapper = mount(MiAnchor, {
            props: {
                collectContainer: '#collect',
                listenerContainer: container,
                delayInit: 0,
                affix: true,
                duration: 300,
                scrollOffset: 80,
                reserveOffset: 10
            },
            attachTo: document.body
        })
        wrappers.push(wrapper)
        await flushDelayInit(0)

        const links = wrapper.findAllComponents(MiAnchorLink)
        await links[1].trigger('click')
        await nextTick()

        expect(scrollSpy).toHaveBeenCalled()
        expect(scrollSpy.mock.calls[0][0]).toBe(container)
        expect(scrollSpy.mock.calls[0][1]).toBe(container.scrollTop)
        // to = offset(500) - scrollOffset(80) - reserveOffset(10) = 410
        expect(scrollSpy.mock.calls[0][2]).toBe(410)
        expect(scrollSpy.mock.calls[0][3]).toBe(300)

        expect(wrapper.emitted().click).toBeTruthy()

        // 点击后应立即把第二项置为 active
        expect(wrapper.findAllComponents(MiAnchorLink)[1].props('active')).toBe(true)

        // manual.status=true 期间触发滚动不应改变 active
        container.scrollTop = 0
        container.dispatchEvent(new Event('scroll'))
        await nextTick()
        expect(wrapper.findAllComponents(MiAnchorLink)[1].props('active')).toBe(true)

        // manual 结束后再滚动，active 会跟随更新
        vi.advanceTimersByTime(300)
        container.dispatchEvent(new Event('scroll'))
        await nextTick()
        expect(wrapper.findAllComponents(MiAnchorLink)[0].props('active')).toBe(true)
    })

    test('点击 body（mask）会在 open 且非 affix 时自动收起', async () => {
        // 捕获 window click 监听回调，避免依赖 happy-dom 的冒泡实现
        const originalAdd = window.addEventListener
        let windowClickHandler: any
        const addSpy = vi
            .spyOn(window, 'addEventListener')
            .mockImplementation((type: any, listener: any, options: any) => {
                if (type === 'click') windowClickHandler = listener
                return originalAdd.call(window, type, listener, options)
            })

        const collect = document.createElement('div')
        collect.id = 'collect'
        collect.appendChild(createHeading('h1', 'h1', 'H1', 0))
        document.body.appendChild(collect)

        const wrapper = mount(MiAnchor, {
            props: {
                collectContainer: '#collect',
                listenerContainer: container,
                delayInit: 0,
                affix: false
            },
            attachTo: document.body
        })
        wrappers.push(wrapper)
        await flushDelayInit(0)

        await wrapper.find(`.${styled.sticky}`).trigger('mouseenter')
        await nextTick()
        expect((wrapper.find(`.${styled.anchor}`).element as HTMLElement).style.display).not.toBe(
            'none'
        )

        expect(windowClickHandler).toBeTruthy()
        await windowClickHandler({ target: document.body, preventDefault: vi.fn() })
        await nextTick()
        vi.advanceTimersByTime(450)
        await nextTick()

        expect((wrapper.find(`.${styled.anchor}`).element as HTMLElement).style.display).toBe(
            'none'
        )
        expect((wrapper.find(`.${styled.sticky}`).element as HTMLElement).style.display).not.toBe(
            'none'
        )

        addSpy.mockRestore()
    })
})
