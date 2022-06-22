import PropTypes from './props-types'
import { tuple } from './props-tools'
import { $g } from '../../utils/global'

export const passportProps = () => ({
    prefixCls: PropTypes.string,
    background: PropTypes.string,
    title: PropTypes.string,
    rules: PropTypes.object,
    content: PropTypes.any,
    footer: PropTypes.any,
    openCaptcha: PropTypes.bool.def(true),
    captchaRadius: PropTypes.number.def(42),
    captchaInitParams: PropTypes.object.def({}),
    captchaInitAction: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
    captchaInitMethod: PropTypes.oneOf(tuple(...$g.methods)).def('get'),
    captchaCheckParams: PropTypes.object.def({}),
    captchaCheckAction: PropTypes.string,
    captchaCheckMethod: PropTypes.oneOf(tuple(...$g.methods)).def('post'),
    captchaVerifyParams: PropTypes.object.def({}),
    captchaVerifyAction: PropTypes.string,
    captchaVerifyMethod: PropTypes.oneOf(tuple(...$g.methods)).def('post'),
    captchaImage: PropTypes.string,
    captchaBackground: PropTypes.string.def('#fff'),
    captchaTextColor: PropTypes.string.def('#333'),
    captchaThemeColor: PropTypes.string,
    captchaMaxTries: PropTypes.number.def(5),
    onCaptchaInit: PropTypes.func,
    onCaptchaChecked: PropTypes.func,
    onCaptchaSuccess: PropTypes.func
})
