import { PropType } from 'vue'
import PropTypes from '../../utils/props'

function getModalPropTypes() {
    return {
        prefixCls: PropTypes.string.def('mi-modal'),
        width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).def(520),
        height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
        mask: PropTypes.bool.def(true),
        maskStyle: PropTypes.style,
        maskClosable: PropTypes.bool.def(true),
        closable: PropTypes.bool.def(true),
        visible: PropTypes.bool.def(false),
        container: PropTypes.func,
        forceRender: PropTypes.bool,
        wrapClass: PropTypes.string,
        title: PropTypes.any,
        footer: PropTypes.any,
        closeIcon: PropTypes.any,
        okText: PropTypes.any,
        ok: {type: Function as PropType<(e: MouseEvent) => void>},
        cancel: {type: Function as PropType<(e: MouseEvent) => void>},
        cancelText: PropTypes.any,
        zIndex: PropTypes.number,
        animation: PropTypes.string.def('scale'),
        position: PropTypes.string.def('center')
    }
}

export default getModalPropTypes