import PropTypes from './props-types'

export const passportProps = () => ({
    action: PropTypes.oneOfType([PropTypes.string, PropTypes.func]).isRequired,
    background: PropTypes.string,
    title: PropTypes.string,
    rules: PropTypes.object,
    content: PropTypes.any,
    footer: PropTypes.bool.def(true),
    openCaptcha: PropTypes.bool.def(true),
    captchaRadius: PropTypes.number.def(42),
    captchaInitParams: PropTypes.object.def({}),
    captchaInitAction: PropTypes.string,
    captchaCheckParams: PropTypes.object.def({}),
    captchaCheckAction: PropTypes.string,
    captchaVerifyParams: PropTypes.object.def({}),
    captchaVerifyAction: PropTypes.string,
    captchaBackground: PropTypes.string,
    captchaThemeColor: PropTypes.string,
    captchaMaxTries: PropTypes.number.def(5),
    onCaptchaSuccess: PropTypes.func,
    onCaptchaInit: PropTypes.func,
    onCaptchaChecked: PropTypes.func,
    socialiteLoginDomain: PropTypes.string
})
