import { defineComponent, type SlotsType } from 'vue'
import { LayoutHeaderProps } from './props'
import applyTheme from '../_utils/theme'
import styled from './style/header.module.less'

const MiLayoutHeader = defineComponent({
    name: 'MiLayoutHeader',
    inheritAttrs: false,
    slots: Object as SlotsType<{
        stretch: any
        notice: any
        dropdown: any
        breadcrumb: any
        custom: any
    }>,
    props: LayoutHeaderProps(),
    setup() {
        applyTheme(styled)
        return () => (
            <header class={styled.container}>
                <div class={styled.inner}>
                    <div class={styled.left}></div>
                    <div class={styled.right}></div>
                </div>
            </header>
        )
    }
})

export default MiLayoutHeader
