import PropTypes from './props-types'

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
    captchaInitAction: PropTypes.string,
    captchaCheckParams: PropTypes.object.def({}),
    captchaCheckAction: PropTypes.string,
    captchaVerifyParams: PropTypes.object.def({}),
    captchaVerifyAction: PropTypes.string,
    captchaImage: PropTypes.string,
    captchaBackground: PropTypes.string.def('#fff'),
    captchaTextColor: PropTypes.string.def('#333'),
    captchaThemeColor: PropTypes.string,
    captchaMaxTries: PropTypes.number.def(5),
    onCaptchaInit: PropTypes.func,
    onCaptchaChecked: PropTypes.func,
    onCaptchaSuccess: PropTypes.func
})
