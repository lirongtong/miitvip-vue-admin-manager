import { SlotsType, defineComponent } from 'vue'
import { NoticeTabProps } from './props'
import { getPropSlot } from '../_utils/props'
import { Row } from 'ant-design-vue'
import { MessageOutlined } from '@ant-design/icons-vue'
import { useI18n } from 'vue-i18n'
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
    emits: ['click'],
    setup(props, { slots, emit }) {
        applyTheme(styled)

        const { t } = useI18n()
        const icon = getPropSlot(slots, props, 'icon') ?? <MessageOutlined />
        const name = getPropSlot(slots, props, 'name') ?? t('notice.title')

        const handleClick = (key: any) => {
            emit('click', key)
        }

        return () => (
            <Row
                class={`${styled.tab}${props.active ? ` ${styled.tabActive}` : ''}`}
                key={props.key}
                onClick={() => handleClick(props.key)}>
                <Row class={styled.tabIcon}>{icon}</Row>
                <Row class={styled.tabName}>{name}</Row>
            </Row>
        )
    }
})

export default MiNoticeTab
