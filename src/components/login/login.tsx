import { defineComponent, createVNode } from 'vue'
import { RouterLink } from 'vue-router'
import { Form, Row, Col, Input, Checkbox, Button } from 'ant-design-vue'
import {
    UserOutlined, LockOutlined, UnlockOutlined,
    EyeOutlined, EyeInvisibleOutlined, QuestionCircleOutlined
} from '@ant-design/icons-vue'
import PropTypes, { getSlotContent } from '../../utils/props'
import MiLoginQuick from './quick'
import MiLayout from '../layout'
import Captcha from '../captcha/captcha'
import MiModal from '../modal'

let isVerify = false
const Login = defineComponent({
    name: 'MiLogin',
    props: {
        action: PropTypes.oneOfType([PropTypes.string, PropTypes.func]).isRequired,
        className: PropTypes.string,
        background: PropTypes.string,
        title: PropTypes.string,
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
        onAfterLogin: PropTypes.func,
        socialiteLoginDomain: PropTypes.string,
        registerLink: PropTypes.string,
        forgetPasswordLink: PropTypes.string,
        rules: PropTypes.object,
        content: PropTypes.any,
        example: PropTypes.bool.def(false)
    },
    data() {
        const validateCaptcha = (_rule: any, _value: boolean, _callback: any) => {
            if (!isVerify) return Promise.reject('请点击按钮进行验证码校验')
            else return Promise.resolve()
        }
        return {
            loading: false,
            captcha: false,
            password: true,
            form: {
                validate: {
                    username: '',
                    password: '',
                    remember: false,
                    captcha: false,
                    uuid: null,
                    url: null
                },
                rules: {
                    username: [{required: true, message: '请输入用户名 / 邮箱地址 / 手机号码', trigger: 'blur'}],
                    password: [{required: true, message: '请输入登录密码', trigger: 'blur'}],
                    captcha: [{required: true, validator: validateCaptcha}]
                }
            }
        }
    },
    beforeCreate() {
        if (!this.example) {
            const token = this.$cookie.get(this.$g.caches.cookies.token.access)
            if (token) this.$router.push({path: '/'})
        }
    },
    mounted() {
        this.form.validate.captcha = this.openCaptcha && (this.captchaInitAction || this.captchaVerifyAction) ? true : false
        !this.form.validate.captcha && delete this.form.validate.uuid
    },
    methods: {
        getPrefixCls() {
            return this.$tools.getPrefixCls('passport')
        },
        getMaskElem() {
            const prefixCls = this.getPrefixCls()
            let mask: any = null
            if (!this.$g.mobile) mask = (<div class={`${prefixCls}-mask`}></div>)
            return mask
        },
        getTitleElem() {
            const prefixCls = this.getPrefixCls()
            return (
                <div class={`${prefixCls}-title`}>
                    <span innerHTML={this.title ?? this.$g.site}></span>
                    <sup><img src={this.$g.avatar} class={`${prefixCls}-logo`} alt={this.$g.powered} /></sup>
                </div>
            )
        },
        getFormElem() {
            const prefixCls = this.getPrefixCls()
            const formPrefixCls = this.$tools.getPrefixCls('form')
            return (
                <div class={`${prefixCls}-form`}>
                    <Form
                        layout="vertical"
                        class={formPrefixCls}
                        ref={`${prefixCls}-login-form`}
                        model={this.form.validate}
                        rules={Object.assign({}, this.form.rules, this.rules)}>
                        <>
                            { this.getUserNameElem() }
                            { this.getPasswordElem() }
                            { this.getCaptchaElem() }
                            { this.getRememberBtnElem() }
                            { this.getButtonElem() }
                            { this.getQuickLoginElem() }
                        </>
                    </Form>
                </div>
            )
        },
        getUserNameElem() {
            return (
                <Form.Item name="username">
                    <Input
                        prefix={createVNode(UserOutlined)}
                        value={this.form.validate.username}
                        onInput={this.handleUserNameValue}
                        maxlength={64}
                        placeholder="请输入用户名 / 邮箱地址 / 手机号码">
                    </Input>
                </Form.Item>
            )
        },
        getPasswordElem() {
            let password: any = null
            if (this.password) {
                const suffix = (<EyeInvisibleOutlined onClick={this.handlePasswordVisible} />)
                password = (
                    <Input
                        type="password"
                        maxlength={32}
                        prefix={createVNode(LockOutlined)}
                        suffix={suffix}
                        value={this.form.validate.password}
                        onInput={this.handlePasswordValue}
                        placeholder="请输入登录密码" />
                )
            } else {
                const suffix = (<EyeOutlined onClick={this.handlePasswordVisible} />)
                password = (
                    <Input
                        type="text"
                        maxlength={32}
                        prefix={createVNode(UnlockOutlined)}
                        suffix={suffix}
                        value={this.form.validate.password}
                        onInput={this.handlePasswordValue}
                        placeholder="请输入登录密码" />
                )
            }
            return (
                <Form.Item name="password">
                    { password }
                </Form.Item>
            )
        },
        getCaptchaElem() {
            if (this.openCaptcha) {
                const prefixCls = this.getPrefixCls()
                return (
                    <Form.Item name="captcha" class={`${prefixCls}-captcha`}>
                        <Captcha
                            width="100%"
                            radius={this.captchaRadius}
                            maxTries={this.captchaMaxTries}
                            themeColor={this.captchaThemeColor}
                            image={this.captchaBackground}
                            initParams={this.captchaInitParams}
                            initAction={this.captchaInitAction}
                            checkParams={this.captchaCheckParams}
                            checkAction={this.captchaCheckAction}
                            verifyParams={this.captchaVerifyParams}
                            verifyAction={this.captchaVerifyAction}
                            onInit={this.onCaptchaInit}
                            onChecked={this.onCaptchaChecked}
                            onSuccess={this.handleCaptchaVerify}>
                        </Captcha>
                    </Form.Item>
                )
            }
            return null
        },
        getRememberBtnElem() {
            const prefixCls = this.getPrefixCls()
            const cls = `${prefixCls}-forget`
            const link = !this.forgetPasswordLink
                ? <RouterLink to={{path: '/password/forget'}} class={cls}>
                    <QuestionCircleOutlined />忘记密码
                </RouterLink>
                : <a href={this.forgetPasswordLink} class={cls}>
                    <QuestionCircleOutlined />忘记密码
                </a>
            return (
                <Form.Item class={`${prefixCls}-remember`}>
                    <Checkbox
                        checked={this.form.validate.remember}
                        onChange={this.handleRememberValue}>
                        保持登录
                    </Checkbox>
                    { link }
                </Form.Item>
            )
        },
        getButtonElem() {
            const prefixCls = this.getPrefixCls()
            const register = this.$g.mobile ? (
                <Button size="large" class={`${prefixCls}-submit ${prefixCls}-submit-register`}>
                    <RouterLink to={{path: '/register'}}>没有账号？立即注册</RouterLink>
                </Button>
            ) : null
            return (
                <>
                    <Button class={`${prefixCls}-submit`} onClick={this.handleLogin}>登录</Button>
                    { register }
                </>
            )
        },
        getQuickLoginElem() {
            const prefixCls = this.getPrefixCls()
            const link = !this.registerLink
                ? <RouterLink to={{path: '/register'}}>注册</RouterLink>
                : <a href={this.registerLink} innerHTML="注册"></a>
            return (
                <Form.Item class={`${prefixCls}-socialite`}>
                    <>
                        { !this.$g.mobile ? (
                            <div class={`${prefixCls}-socialite-link`}>
                                没有账号？{ link }
                            </div>
                        ) : null }
                        <MiLoginQuick></MiLoginQuick>
                    </>
                </Form.Item>
            )
        },
        handlePasswordVisible() {
            this.password = !this.password
        },
        handleUserNameValue(e: any) {
            this.form.validate.username = e.target.value
        },
        handlePasswordValue(e: any) {
            this.form.validate.password = e.target.value
        },
        handleRememberValue(e: any) {
            this.form.validate.remember = e.target.checked
        },
        handleLogin() {
            if (this.loading) return 
            this.loading = true
            const prefixCls = this.getPrefixCls()
            this.$refs[`${prefixCls}-login-form`].validate().then(() => {
                if (
                    !this.form.validate.captcha ||
                    (this.form.validate.captcha && this.captcha)
                ) {
                    this.api.login = this.action
                    this.form.validate.url = this.api.login
                    if (this.example) {
                        MiModal.success({content: '校验通过（示例不进行提交操作）'})
                        this.loading = false
                    } else {
                        if (typeof this.action === 'string') {
                            this.$store.dispatch('passport/login', this.form.validate).then((res: any) => {
                                this.loading = false
                                if (
                                    this.onAfterLogin &&
                                    typeof this.onAfterLogin === 'function'
                                ) {
                                    this.onAfterLogin.call(this, res)
                                } else {
                                    if (res.ret.code === 1) {
                                        let redirect = this.$route.query.redirect
                                        if (redirect) {
                                            redirect = redirect.toString()
                                            if (this.$g.regExp.url.test(redirect)) window.location.href = redirect
                                            else this.$router.push({path: redirect})
                                        } else this.$router.push({path: '/'})
                                    } else MiModal.error({content: res.ret.message})
                                }
                            }).catch((err: any) => {
                                this.loading = false
                                MiModal.error({content: err.message})
                            })
                        } else if (typeof this.action === 'function') {
                            this.loading = false
                            this.action.call(this, this.form.validate)
                        }
                    }
                } else this.loading = false
            }).catch(() => {
                this.loading = false
            })
        },
        handleCaptchaVerify(data: any) {
            if (data && data.uuid) this.form.validate.uuid = data.uuid
            this.captcha = true
            isVerify = true
            this.$refs[`${this.getPrefixCls()}-login-form`].validateFields(['captcha'])
            this.$emit('captchaSuccess', data)
        }
    },
    render() {
        const prefixCls = this.getPrefixCls()
        let className = prefixCls + (this.$g.mobile ? ` ${prefixCls}-mobile` : '')
        className += this.className ? ` ${this.className}` : ''
        const style = {backgroundImage: `url('${this.background ?? this.$g.background.default}')`}
        let formTemplate = getSlotContent(this, 'content')
        if (!formTemplate) formTemplate = this.getFormElem()
        return (
            <div class={className} style={style}>
                <Row class={`${prefixCls}-content`} align={this.$g.mobile ? 'top' : 'middle'}>
                    <Col class={`${prefixCls}-box`} xs={24} sm={18} md={12} lg={12}>
                        { this.getMaskElem() }
                        { this.getTitleElem() }
                        { formTemplate }
                    </Col>
                </Row>
                { this.footer ? <MiLayout.Footer></MiLayout.Footer> : null }
            </div>
        )
    }
})

Login.Quick = MiLoginQuick
export default Login as typeof Login & {
    readonly Quick: typeof MiLoginQuick
}
