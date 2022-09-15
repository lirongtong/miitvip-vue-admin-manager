import { PropType, VNodeTypes, CSSProperties } from 'vue'
import { tuple } from '../_utils/props-tools'
import PropTypes from '../_utils/props-types'

export interface ModalProps {
    prefixCls?: string
    visible?: boolean
    title?: VNodeTypes
    class?: string
    content?: VNodeTypes
    okText?: VNodeTypes
    ok?: (...args: any[]) => any
    cancelText?: VNodeTypes
    cancel?: (...args: any[]) => any
    mask?: boolean
    maskStyle?: CSSProperties
    maskClosable?: boolean
    icon?: VNodeTypes
    width?: string | number
    zIndex?: number
}

export const modalProps = () => ({
    prefixCls: PropTypes.string,
    width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).def(520),
    height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    mask: PropTypes.bool.def(true),
    maskStyle: PropTypes.object,
    maskClosable: PropTypes.bool.def(true),
    closable: PropTypes.bool.def(true),
    visible: PropTypes.bool.def(false),
    container: PropTypes.oneOfType([PropTypes.func, PropTypes.string, HTMLElement]),
    forceRender: PropTypes.bool,
    wrapClass: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
    title: PropTypes.any,
    footer: PropTypes.any,
    footerBtnPosition: PropTypes.oneOf(tuple('center', 'left', 'right')).def('right'),
    closeIcon: PropTypes.any,
    okText: PropTypes.any,
    ok: { type: Function as PropType<(e?: Event) => void> },
    cancel: { type: Function as PropType<(e?: Event) => void> },
    cancelText: PropTypes.any,
    zIndex: PropTypes.number,
    animation: PropTypes.string.def('scale'),
    placement: PropTypes.oneOf(tuple('left', 'top', 'right', 'bottom', 'center')).def('center'),
    afterClose: PropTypes.func.def(() => {})
})
