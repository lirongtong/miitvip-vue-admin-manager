import { SlotsType, defineComponent } from 'vue'
import { NoticeTabProps } from './props'
import { getPropSlot } from '../_utils/props'
import applyTheme from '../_utils/theme'
import styled from './style/tab.module.less'

const MiNoticeTab = defineComponent({
    name: 'MiNoticeTab',
    inheritAttrs: false,
    slots: Object as SlotsType<{
        name: any
        icon: any
    }>,
    props: NoticeTabProps(),
    setup(props, { slots }) {
        applyTheme(styled)
        return () => (
            <div class={styled.container}>
                <div class={styled.items}>{getPropSlot(slots, props)}</div>
            </div>
        )
    }
})

export default MiNoticeTab
