import { object } from 'vue-types'
import { tuple, placement, actions } from './../_utils/props'
import { DeviceSize, PropTypes, SizeColor } from '../../utils/types'

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
 * @param background 弹窗背景色
 * @param extra 自定义配置<Slot />
 * @param tabGap Tab 间距
 * @param tabChange Tab 变化事件
 *
 * @see SizeColor
 */
export interface NoticeProperties {
    icon: any
    iconSetting: SizeColor
    width: string | number | DeviceSize
    trigger: string
    amount: string | number
    maxAmount: number
    dot: boolean
    showZero: boolean
    placement: string
    background: string
    extra: any
    tabGap: number | string | DeviceSize
    tabChange: () => {}
}
export const NoticeProps = () => ({
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
    background: PropTypes.string,
    icon: PropTypes.any,
    extra: PropTypes.any,
    tabGap: PropTypes.oneOfType([PropTypes.string, PropTypes.number, object<DeviceSize>()]).def(16),
    tabChange: PropTypes.func
})

/**
 * 消息 Tab
 * @param key 唯一标识
 * @param name 显示名称
 */
export interface NoticeTabProperties {
    key: string
    name: any
    icon: any
}
export const NoticeTabProps = () => ({
    key: PropTypes.string.isRequired,
    name: PropTypes.any,
    icon: PropTypes.any
})

/**
 * 消息列表
 * @param title 标题<Slot />
 * @param summary 摘要<Slot />
 * @param tag 标签<Slot />
 * @param date 日期<Slot />
 * @param avatar 头像<Slot />
 */
export interface NoticeItemProperties {
    title: any
    summary: any
    tag: any
    date: any
    avatar: any
}
export const NoticeItemProps = () => ({
    title: PropTypes.any,
    summary: PropTypes.any,
    tag: PropTypes.any,
    date: PropTypes.any,
    avatar: PropTypes.any
})
