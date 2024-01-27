import { array, object } from 'vue-types'
import { tuple, placement, actions } from './../_utils/props'
import { DeviceSize, PropTypes, SizeColor } from '../../utils/types'

/**
 * +=====================+
 * |       Notice        |
 * +=====================+
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
 * @param tabActive 选中 Tab ( 默认第1个 )
 * @param tabGap Tab 间距
 * @param tabChange Tab 变化事件
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
    items: NoticeTabProperties[] | NoticeTabProperties[][]
    tabs: string[] | NoticeTabProperties[]
    tabActive: number | string
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
    items: PropTypes.array.def([]),
    tabs: PropTypes.oneOfType([array<string>(), array<NoticeTabProperties>()]).def([]),
    tabActive: PropTypes.string.def('0'),
    tabGap: PropTypes.oneOfType([PropTypes.string, PropTypes.number, object<DeviceSize>()]).def(16),
    tabChange: PropTypes.func
})

/**
 * +=========================+
 * |       Notice Tab        |
 * +=========================+
 * @param key 唯一值 ( 对应 notice 的 tabActive )
 * @param name 显示名称
 * @param icon 图标
 * @param items 消息列表
 */
export interface NoticeTabProperties {
    key: string
    name: any
    icon: any
    items: Partial<NoticeItemProperties>[]
}
export const NoticeTabProps = () => ({
    key: PropTypes.string.isRequired,
    name: PropTypes.any,
    icon: PropTypes.any,
    items: PropTypes.array.def([])
})

/**
 * +==========================+
 * |       Notice Item        |
 * +==========================+
 * @param key 标识符
 * @param title 标题<Slot />
 * @param summary 摘要<Slot />
 * @param tag 标签<Slot />
 * @param date 日期<Slot />
 * @param avatar 头像<Slot />
 */
export interface NoticeItemProperties {
    [key: string]: any
    key: string | number
    title: any
    summary: any
    tag: any
    date: any
    avatar: any
}
export const NoticeItemProps = () => ({
    key: PropTypes.string,
    title: PropTypes.any,
    summary: PropTypes.any,
    tag: PropTypes.any,
    date: PropTypes.any,
    avatar: PropTypes.any
})