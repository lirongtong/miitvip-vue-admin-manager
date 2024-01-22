import { defineComponent, type SlotsType } from 'vue'
import { LayoutHeaderProps } from './props'
import { getPropSlot } from '../_utils/props'
import MiBreadcrumb from '../breadcrumb/Breadcrumb'
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
        extra: any
    }>,
    props: LayoutHeaderProps(),
    setup(props, { slots }) {
        applyTheme(styled)

        const renderStretch = () => {}

        return () => (
            <header class={styled.container}>
                <div class={styled.inner}>
                    <div class={styled.left}>
                        <div class={styled.trigger}>{renderStretch()}</div>
                        <div class={styled.trigger}>
                            {getPropSlot(slots, props, 'breadcrumb') ?? (
                                <MiBreadcrumb {...props.breadcrumbSetting} />
                            )}
                        </div>
                    </div>
                    <div class={styled.right}></div>
                </div>
            </header>
        )
    }
})

export default MiLayoutHeader
