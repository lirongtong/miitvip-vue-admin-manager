import { defineComponent } from 'vue'
import { NoticeTabProps } from './props'
import { getPropSlot } from '../_utils/props'
import applyTheme from '../_utils/theme'
import styled from './style/tab.module.less'

const MiNoticeTab = defineComponent({
    name: 'MiNoticeTab',
    inheritAttrs: false,
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
