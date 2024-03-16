import { SlotsType, defineComponent, Transition, ref } from 'vue'
import { getPrefixCls, getPropSlot } from '../_utils/props'
import { NoticeItemProps } from './props'
import { __LOGO__ } from '../../utils/images'
import { Row, Tag, Flex } from 'ant-design-vue'
import { ArrowLeftOutlined } from '@ant-design/icons-vue'
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
        content: any
    }>,
    props: NoticeItemProps(),
    emits: ['click'],
    setup(props, { slots, emit }) {
        const { t } = useI18n()
        const anim = getPrefixCls('anim-slide')
        const showContent = ref<boolean>(false)

        applyTheme(styled)

        const handleClick = () => {
            if (props.content) showContent.value = !showContent.value
            emit('click')
        }

        const handleContentBack = () => {
            showContent.value = !showContent.value
        }

        const renderAvatar = () => {
            return (
                getPropSlot(slots, props, 'avatar') ?? (
                    <div class={styled.avatar}>
                        <img src={__LOGO__} />
                    </div>
                )
            )
        }

        const renderDate = () => {
            return <div class={styled.date}>{$tools.formatDateNow('Y-M-D')}</div>
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
                <>
                    <div
                        class={`${styled.container}${
                            props?.onClick || props?.content ? ` ${styled.cursor}` : ''
                        }`}
                        onClick={() => handleClick()}>
                        <div class={styled.inner}>
                            {renderAvatar()}
                            <div class={styled.info}>
                                <div class={styled.infoTitle}>
                                    <Row>
                                        {renderDynamic('title', 12)}
                                        {renderTag()}
                                    </Row>
                                    <Row>{renderDynamic('date') ?? renderDate()}</Row>
                                </div>
                                {renderDynamic('summary', 24) || renderDynamic('content', 24)}
                            </div>
                        </div>
                    </div>
                    <Transition name={anim} appear={true}>
                        {showContent.value ? (
                            <Row class={styled.detail}>
                                <Flex vertical={true} class={styled.detailInner}>
                                    <Row
                                        class={styled.detailBack}
                                        onClick={() => handleContentBack()}>
                                        <ArrowLeftOutlined />
                                        <span innerHTML={t('global.back')}></span>
                                    </Row>
                                    <Flex>
                                        {renderAvatar()}
                                        <Flex vertical={true} class={styled.detailTitle}>
                                            <Row>
                                                {renderDynamic('title', 12)}
                                                {renderTag()}
                                            </Row>
                                            {renderDynamic('date') ?? renderDate()}
                                        </Flex>
                                    </Flex>
                                    <Row class={styled.detailInfo} innerHTML={props?.content}></Row>
                                </Flex>
                            </Row>
                        ) : null}
                    </Transition>
                </>
            )
    }
})

export default MiNoticeItem
