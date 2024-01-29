import { SlotsType, defineComponent } from 'vue'
import { getPropSlot } from '../_utils/props'
import { NoticeItemProps } from './props'
import { logo } from '../../utils/images'
import { Row, Tag } from 'ant-design-vue'
import { useI18n } from 'vue-i18n'
import { $tools } from '../../utils/tools'
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
        const { t } = useI18n()
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

        const renderDate = () => {
            let date = new Date()
            const y = date.getFullYear()
            const m = date.getMonth() + 1
            const d = date.getDate()
            const times = `${y}-${m > 9 ? m : `0` + m}-${d > 9 ? d : `0` + d}`
            return <div class={styled.date}>{times}</div>
        }

        const renderTag = () => {
            return typeof props.tag === 'string' ? (
                <Tag
                    class={props.tagColor ? '' : styled.tag}
                    color={props.tagColor}
                    icon={props.tagIcon}>
                    <span innerHTML={props.tag}></span>
                </Tag>
            ) : (
                getPropSlot(slots, props, 'tag') ?? (
                    <Tag
                        class={props.tagColor ? '' : styled.tag}
                        color={props.tagColor}
                        icon={props.tagIcon}>
                        <span innerHTML={t('notice.official')}></span>
                    </Tag>
                )
            )
        }

        const renderDynamic = (name: string, truncateLen = 0) => {
            const dynamic = getPropSlot(slots, props, name)
            return dynamic ? (
                <div class={styled[name]}>
                    {truncateLen && typeof dynamic === 'string'
                        ? $tools.beautySub(dynamic, truncateLen)
                        : dynamic}
                </div>
            ) : null
        }

        return () =>
            getPropSlot(slots, props) ?? (
                <div class={styled.container}>
                    <div class={styled.default}>
                        {renderAvatar()}
                        <div class={styled.info}>
                            <div class={styled.infoTitle}>
                                <Row>
                                    {renderDynamic('title', 12)}
                                    {renderTag()}
                                </Row>
                                <Row>{renderDynamic('date') ?? renderDate()}</Row>
                            </div>
                            {renderDynamic('summary', 24)}
                        </div>
                    </div>
                </div>
            )
    }
})

export default MiNoticeItem
