import { SlotsType, defineComponent } from 'vue'
import { getPropSlot } from '../_utils/props'
import { NoticeItemProps } from './props'
import { logo } from '../../utils/images'
import applyTheme from '../_utils/theme'
import styled from './style/item.module.less'

const MiNoticeItem = defineComponent({
    name: 'MiNoticeItem',
    inheritAttrs: false,
    slots: Object as SlotsType<{
        default: any
        title: any
        summary: any
        date: any
        tag: any
        avatar: any
    }>,
    props: NoticeItemProps(),
    setup(props, { slots }) {
        applyTheme(styled)

        const renderAvatar = () => {
            return (
                getPropSlot(slots, props, 'avatar') ?? (
                    <div class={styled.avatar}>
                        <img src={logo} />
                    </div>
                )
            )
        }

        const renderDynamic = (name: string) => {
            const dynamic = getPropSlot(slots, props, name)
            return dynamic ? <div class={styled[name]}>{dynamic}</div> : null
        }

        return () =>
            getPropSlot(slots, props) ?? (
                <div class={styled.container}>
                    <div class={styled.default}>
                        {renderAvatar()}
                        <div class={styled.info}>
                            {renderDynamic('title')}
                            {renderDynamic('summary')}
                            {renderDynamic('date')}
                        </div>
                    </div>
                </div>
            )
    }
})

export default MiNoticeItem
