import PropTypes from '../_utils/props-types'
import { tuple } from '../_utils/props-tools'
import { $g } from '../../utils/global'

export const captchaProps = () => ({
    prefixCls: PropTypes.string,
    width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).def(320),
    height: PropTypes.number,
    radius: PropTypes.number.def(48),
    themeColor: PropTypes.string,
    bgColor: PropTypes.string,
    borderColor: PropTypes.string,
    textColor: PropTypes.string,
    boxShadow: PropTypes.bool.def(true),
    boxShadowColor: PropTypes.string,
    boxShadowBlur: PropTypes.number.def(4),
    modalBgColor: PropTypes.string,
    modalBoxShadow: PropTypes.bool.def(true),
    modalBoxShadowColor: PropTypes.string,
    modalBoxShadowBlur: PropTypes.number,
    image: PropTypes.string,
    logo: PropTypes.string,
    mask: PropTypes.bool.def(true),
    maskClosable: PropTypes.bool.def(true),
    maxTries: PropTypes.number.def(5),
    initParams: PropTypes.object.def({}),
    initAction: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
    initMethod: PropTypes.oneOf(tuple(...$g.methods)).def('get'),
    verifyParams: PropTypes.object.def({}),
    verifyAction: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
    verifyMethod: PropTypes.oneOf(tuple(...$g.methods)).def('post'),
    checkParams: PropTypes.object.def({}),
    checkAction: PropTypes.string,
    checkMethod: PropTypes.oneOf(tuple(...$g.methods)).def('post'),
    actionConfig: PropTypes.object.def({})
})

export const captchaModalProps = () => ({
    prefixCls: PropTypes.string,
    show: PropTypes.bool.def(false),
    image: PropTypes.string,
    position: PropTypes.object,
    mask: PropTypes.bool.def(true),
    maskClosable: PropTypes.bool.def(true),
    themeColor: PropTypes.string,
    bgColor: PropTypes.string,
    boxShadow: PropTypes.bool.def(true),
    boxShadowColor: PropTypes.string,
    boxShadowBlur: PropTypes.number.def(6),
    maxTries: PropTypes.number.def(5),
    verifyParams: PropTypes.object.def({}),
    verifyMethod: PropTypes.string.def('post'),
    verifyAction: PropTypes.string,
    actionConfig: PropTypes.object.def({})
})
