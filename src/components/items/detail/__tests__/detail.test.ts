import { mount, type VueWrapper } from '@vue/test-utils'
import { afterEach, describe, expect, test, vi } from 'vitest'
import { h, nextTick } from 'vue'
import MiItemsDetail from '../Detail'
import styled from '../style/detail.module.less'
import { $tools } from '../../../../utils/tools'

describe('MiItemsDetail', () => {
    const wrappers: VueWrapper[] = []

    afterEach(() => {
        wrappers.splice(0).forEach((w) => w.unmount())
        vi.restoreAllMocks()
        document.body.innerHTML = ''
    })

    test('subtitle slot 会正确渲染（修复 slot 名称错误）', async () => {
        vi.spyOn($tools, 'getParents').mockReturnValue(document.createElement('div') as any)
        const wrapper = mount(MiItemsDetail, {
            props: {
                data: [
                    { title: 't1', subtitle: 's1', thumb: 'x.png' },
                    { title: 't2', subtitle: 's2', thumb: 'y.png' }
                ],
                scrollToPosition: false
            },
            slots: {
                subtitle: ({ subtitle }: any) =>
                    h('div', { 'data-testid': 'subtitle-slot' }, subtitle?.text || '')
            },
            global: {
                stubs: {
                    MiImage: { name: 'MiImage', props: ['src'], template: '<img />' }
                }
            },
            attachTo: document.body
        })
        wrappers.push(wrapper)

        await nextTick()
        expect(wrapper.findAll('[data-testid="subtitle-slot"]').length).toBe(2)
        expect(wrapper.text()).toContain('s1')
        expect(wrapper.text()).toContain('s2')
    })

    test('scrollToPosition=false 时点击不会调用 back2pos', async () => {
        const getParentsSpy = vi
            .spyOn($tools, 'getParents')
            .mockReturnValue(document.createElement('div') as any)
        const back2posSpy = vi.spyOn($tools, 'back2pos')

        const wrapper = mount(MiItemsDetail, {
            props: {
                data: [{ title: 't1', subtitle: 's1', thumb: 'x.png' }],
                scrollToPosition: false
            },
            global: {
                stubs: {
                    MiImage: { name: 'MiImage', props: ['src'], template: '<img />' }
                }
            },
            attachTo: document.body
        })
        wrappers.push(wrapper)

        await nextTick()
        await wrapper.find(`.${styled.item}`).trigger('click')
        await nextTick()

        expect(getParentsSpy).toHaveBeenCalled()
        expect(back2posSpy).not.toHaveBeenCalled()
    })
})
