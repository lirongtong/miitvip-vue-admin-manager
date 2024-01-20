import { defineComponent, type SlotsType } from 'vue'
import { BellOutlined } from '@ant-design/icons-vue'
import { ConfigProvider, Popover, Badge } from 'ant-design-vue'
import { $tools } from '../../utils/tools'
import { getPropSlot } from '../_utils/props'
import { NoticeProps } from './props'
import applyTheme from '../_utils/theme'
import styled from './style/notice.module.less'

const MiNotice = defineComponent({
    name: 'MiNotice',
    inheritAttrs: false,
    slots: Object as SlotsType<{
        icon: any
        extra: any
    }>,
    props: NoticeProps(),
    setup(props, { slots }) {
        applyTheme(styled)
        const renderIcon = () => {
            const icon = getPropSlot(slots, props, 'icon')
            const style = {
                fontSize: props?.iconSetting?.size
                    ? $tools.convert2rem($tools.distinguishSize(props?.iconSetting?.size))
                    : null,
                color: props?.iconSetting?.color ?? null
            }
            return (
                <div class={styled.icon}>
                    <Badge
                        count={props.amount}
                        overflowCount={props.maxAmount}
                        dot={props.dot}
                        status="success"
                        showZero={props.showZero}>
                        {icon ?? <BellOutlined style={style} />}
                    </Badge>
                </div>
            )
        }
        const renderContent = () => {}
        return () => (
            <ConfigProvider theme={{ ...$tools.getAntdvThemeProperties() }}>
                <Popover
                    overlayClassName={styled.container}
                    destroyTooltipOnHide={true}
                    content={renderContent()}>
                    {renderIcon()}
                </Popover>
            </ConfigProvider>
        )
    }
})

export default MiNotice
