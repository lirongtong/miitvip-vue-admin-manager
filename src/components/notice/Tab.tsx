import { SlotsType, defineComponent } from 'vue'
import { NoticeTabProps } from './props'

const MiNoticeTab = defineComponent({
    name: 'MiNoticeTab',
    inheritAttrs: false,
    slots: Object as SlotsType<{
        default: any
        name: any
        icon: any
    }>,
    props: NoticeTabProps(),
    setup(_props, { slots }) {
        return () => slots?.default()
    }
})

export default MiNoticeTab
