import { array, object } from 'vue-types'
import { tuple, placement, actions } from './../_utils/props'
import { DeviceSize, PropTypes, SizeColor } from '../../utils/types'

/**
 * +=====================+
 * |       Notice        |
 * +=====================+
 * @param icon 图标<Slot />
 * @param iconSetting ICON 配置 ( slot icon 设定时无效 )
 * @param trigger 触发方式
 * @param width 弹窗宽度
 * @param amount 数量
 * @param maxAmount 封顶展示的数字值
 * @param dot 是否显示红点 ( 默认: true )
 * @param showZero 当数值为 0 时，是否展示 Badge ( 默认: false )
 * @param placement 弹窗打开位置
 * @param background 弹窗背景色
 * @param tabDefaultActive 选中 Tab ( 默认第1个 )
 * @param tabGap Tab 间距
 * @param tabCenter Tab 居中显示
 * @param tabChange Tab 切换事件
 * @param tabClick Tab 点击事件
 * @param itemClick Item Click 事件
 */
export interface NoticeProperties {
    icon: any
    iconSetting: Partial<SizeColor>
    width: string | number | DeviceSize
    trigger: string
    amount: string | number
    maxAmount: number
    dot: boolean
    showZero: boolean
    placement: string
    background: string
    items: Partial<NoticeItemProperties>[] | Partial<NoticeItemProperties>[][]
    tabs: string[] | Partial<NoticeTabProperties>[]
    tabDefaultActive: string | number
    tabGap: number | string | DeviceSize
    tabCenter: boolean
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
    iconSetting: object<Partial<SizeColor>>(),
    placement: PropTypes.oneOf(tuple(...placement)).def('bottom'),
    background: PropTypes.string,
    icon: PropTypes.any,
    items: PropTypes.oneOfType([
        array<Partial<NoticeItemProperties>>(),
        array<Partial<NoticeItemProperties>[]>()
    ]),
    tabs: PropTypes.oneOfType([array<string>(), array<Partial<NoticeTabProperties>>()]).def([]),
    tabDefaultActive: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).def(0),
    tabGap: PropTypes.oneOfType([PropTypes.string, PropTypes.number, object<DeviceSize>()]).def(16),
    tabCenter: PropTypes.bool.def(true)
})

/**
 * +=========================+
 * |       Notice Tab        |
 * +=========================+
 * @param name 唯一值 ( 对应 notice 的 tabActive )
 * @param tab 显示名称
 * @param icon 图标
 * @param items 消息列表
 */
export interface NoticeTabProperties {
    name: string
    tab: any
    icon: any
    items: Partial<NoticeItemProperties>[]
}
export const NoticeTabProps = () => ({
    name: PropTypes.string.isRequired,
    tab: PropTypes.any,
    icon: PropTypes.any,
    items: array<Partial<NoticeItemProperties>>().def([])
})

/**
 * +==========================+
 * |       Notice Item        |
 * +==========================+
 * @param title 标题<Slot />
 * @param summary 摘要<Slot />
 * @param tag 标签<Slot />
 * @param tagColor 标签颜色 ( tag 非 slot 时生效 )
 * @param tagIcon 标签图标 ( tag 非 slot 时生效 )
 * @param date 日期<Slot />
 * @param avatar 头像<Slot />
 * @param content 详情<Slot />
 * @param interceptTitle 标题截取长度
 * @param interceptSummary 摘要截取长度
 */
export interface NoticeItemProperties {
    [key: string]: any
    title: any
    summary: any
    tag: any
    tagColor: string
    tagIcon: any
    date: any
    avatar: any
    content: any
    interceptTitle: number
    interceptSummary: number
}
export const NoticeItemProps = () => ({
    title: PropTypes.any,
    summary: PropTypes.any,
    tag: PropTypes.any,
    tagColor: PropTypes.string,
    tagIcon: PropTypes.any,
    date: PropTypes.any,
    avatar: PropTypes.any,
    content: PropTypes.any,
    interceptTitle: PropTypes.number.def(12),
    interceptSummary: PropTypes.number.def(24)
})
