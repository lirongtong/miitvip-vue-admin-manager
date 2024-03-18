import { tuple, animations } from './../_utils/props'
import { type DeviceSize, PropTypes } from '../../utils/types'
import type { VNodeTypes, CSSProperties } from 'vue'
import { object } from 'vue-types'
import type { ModalFuncProps } from 'ant-design-vue'

/**
 * +====================+
 * |       Modal        |
 * +====================+
 * @param title 标题<Slot />
 * @param content 内容<Slot />
 * @param cancelText 取消按钮文案<Slot />
 * @param okText 确定按钮文案<Slot />
 * @param open 弹窗开启状态
 * @param ok 确定回调
 * @param cancel 取消回调
 * @param mask 是否显示遮罩
 * @param maskStyle 遮罩样式
 * @param maskClosable 遮罩是否可以点击关闭弹窗
 * @param width 宽度
 * @param zIndex 层级
 * @param closable 可关闭
 * @param container 渲染容器
 * @param forceRender 强制渲染
 * @param destroyOnClose 关闭 Modal 时, 销毁弹窗内的子元素
 * @param wrapClass Modal 容器的自定义样式名
 * @param footer Modal Footer 配置<Slot />
 * @param footerBtnPosition Modal Footer 按钮位置
 * @param closeIcon 关闭按钮<Slot />
 * @param animation 弹窗动画
 * @param placement 弹窗弹出位置
 * @param afterClose 关闭成功后的事件处理
 */
export interface ModalProperties {
    title: VNodeTypes
    content: VNodeTypes
    cancelText: VNodeTypes
    okText: VNodeTypes
    open: boolean
    ok: Function
    cancel: Function
    mask: boolean
    maskStyle: CSSProperties
    maskClosable: boolean
    width: string | number | DeviceSize
    height: string | number | DeviceSize
    zIndex: number
    closable: boolean
    container: string | Function | boolean | HTMLElement
    forceRender: boolean
    destroyOnClose: boolean
    wrapClass: string[] | string
    footer: VNodeTypes
    footerBtnPosition: 'center' | 'left' | 'right'
    closeIcon: VNodeTypes
    animation: string
    placement: 'left' | 'top' | 'right' | 'bottom' | 'center'
    afterClose: Function
}
export const ModalProps = () => ({
    width: PropTypes.oneOfType([PropTypes.number, PropTypes.string, object<DeviceSize>()]).def(520),
    height: PropTypes.oneOfType([PropTypes.number, PropTypes.string, object<DeviceSize>()]),
    mask: PropTypes.bool.def(true),
    maskStyle: object<CSSProperties>(),
    maskClosable: PropTypes.bool.def(true),
    closable: PropTypes.bool.def(true),
    open: PropTypes.bool.def(false),
    container: PropTypes.oneOfType([
        PropTypes.func,
        PropTypes.string,
        PropTypes.bool,
        HTMLElement
    ]).def(undefined),
    forceRender: PropTypes.bool.def(false),
    destroyOnClose: PropTypes.bool.def(false),
    wrapClass: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
    title: PropTypes.any,
    footer: PropTypes.any,
    footerBtnPosition: PropTypes.oneOf(tuple('center', 'left', 'right')).def('right'),
    closeIcon: PropTypes.any,
    okText: PropTypes.any,
    cancelText: PropTypes.any,
    ok: PropTypes.func,
    cancel: PropTypes.func,
    zIndex: PropTypes.number.def(Date.now()),
    animation: PropTypes.oneOf(tuple(...animations)).def('scale'),
    placement: PropTypes.oneOf(tuple('left', 'top', 'right', 'bottom', 'center')).def('center'),
    afterClose: PropTypes.func
})

/**
 * +============================+
 * |       Modal Teleport       |
 * +============================+
 * @param open 打开状态
 * @param container 渲染容器
 * @param children 节点
 * @param forceRender 强制渲染
 */
export interface TeleportProperties {
    open: boolean
    container: string | Function | HTMLElement
    children: Function
    forceRender: boolean
}
export const TeleportProps = () => ({
    open: PropTypes.bool,
    container: PropTypes.oneOfType([PropTypes.func, PropTypes.string, HTMLElement]),
    children: PropTypes.func,
    forceRender: PropTypes.bool
})

export type ModalFunc = (props: ModalFuncProps) => {
    destroy: () => void
    update: (newConfig: ModalFuncProps) => void
}
