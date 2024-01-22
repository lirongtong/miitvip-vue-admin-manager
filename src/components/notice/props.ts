import { object } from 'vue-types'
import { tuple, placement, actions } from './../_utils/props'
import { DefaultProps, DeviceSize, PropTypes, SizeColor } from '../../utils/types'

/**
 * 消息配置
 * @param icon 图表<Slot />
 * @param iconSetting ICON 配置 ( slot icon 设定时无效 )
 * @param trigger 触发方式
 * @param width 弹窗宽度
 * @param amount 数量
 * @param maxAmount 展示封顶的数字值
 * @param dot 是否显示红点 ( 默认: true )
 * @param showZero 当数值为 0 时，是否展示 Badge ( 默认: false )
 * @param placement 弹窗打开位置
 * @param extra 自定义配置<Slot />
 * @param tabChange Tab 变化事件
 *
 * @see SizeColor
 */
export interface NoticeProperties extends DefaultProps {
    icon: any
    iconSetting: SizeColor
    width: string | number | DeviceSize
    trigger: string
    amount: string | number
    maxAmount: number
    dot: boolean
    showZero: boolean
    placement: string
    extra: any
    tabChange: () => {}
}
export const NoticeProps = () => ({
    prefixCls: PropTypes.string,
    width: PropTypes.oneOfType([PropTypes.string, PropTypes.number, object<DeviceSize>()]).def(
        '100%'
    ),
    trigger: PropTypes.oneOf(tuple(...actions)).def('click'),
    amount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).def(1),
    maxAmount: PropTypes.number.def(99),
    dot: PropTypes.bool.def(true),
    showZero: PropTypes.bool.def(false),
    iconSetting: object<SizeColor>(),
    placement: PropTypes.oneOf(tuple(...placement)).def('bottom'),
    icon: PropTypes.any,
    extra: PropTypes.any,
    tabChange: PropTypes.func
})

/**
 * 消息 Tab
 * @param key 唯一标识
 * @param name 显示名称
 */
export interface NoticeTabProperties extends DefaultProps {
    key: string
    name: string
}
export const NoticeTabProps = () => ({
    prefixCls: PropTypes.string,
    key: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired.def('')
})
