import { mount } from '@vue/test-utils'
import { describe, expect, test } from 'vitest'
import MiAnchor from '../Anchor'
import { nextTick } from 'vue'

describe('MiAnchor', () => {
    test('正确渲染组件 ( renders correctly )', async () => {
        const wrapper = mount(MiAnchor, {
            props: {
                affixText: '自定义悬浮按钮名称',
                affix: false,
                delayInit: 0
            },
            slots: { default: '<h1>Title</h1><h2>Subtitle</h2>' }
        })
        await nextTick()
        setTimeout(() => {
            expect(wrapper.html()).toContain(
                '<span>自</span><span>定</span><span>义</span><span>悬</span><span>浮</span><span>按</span><span>钮</span><span>名</span><span>称</span>'
            )
        }, 410)
    })

    test('切换 affix 状态 (toggles affix state)', async () => {
        const wrapper = mount(MiAnchor, {
            props: {
                affix: false,
                delayInit: 0
            }
        }) as any
        await nextTick()
        setTimeout(async () => {
            const anchor = wrapper.find(`div[key="${wrapper.vm.params.key}"]`)
            await anchor.trigger('mouseenter')
            setTimeout(async () => {
                const pushpinIcon = wrapper.findComponent({ name: 'PushpinOutlined' })
                await pushpinIcon.trigger('click')
                expect(wrapper.vm.params.affix).toBe(true)
            }, 410)
        }, 410)
    })

    test('处理锚点链接点击事件 (handles anchor link click)', async () => {
        const wrapper = mount(MiAnchor, {
            props: {
                affix: false,
                delayInit: 0
            },
            slots: { default: '<h1 id="test">Title</h1>' }
        })
        await nextTick()
        setTimeout(async () => {
            const anchorLink = wrapper.findComponent({ name: 'MiAnchorLink' })
            await anchorLink.trigger('click')
            expect(wrapper.emitted().click).toBeTruthy()
        }, 410)
    })
})
