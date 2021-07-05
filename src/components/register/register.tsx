import { defineComponent, createVNode } from 'vue'
import { Form, Row, Col, Input, Popover, Button } from 'ant-design-vue'
import { UserOutlined, MailOutlined } from '@ant-design/icons-vue'
import { RouterLink } from 'vue-router'
import MiLayout from '../layout'
import MiModal from '../modal'
import MiPassport from '../password'
import Captcha from '../captcha/captcha'
import MiLoginQuick from '../login/quick'
import PropTypes, { getSlotContent } from '../../utils/props'
import { $tools } from '../../utils/tools'

let isVerify = false
const prefixCls = $tools.getPrefixCls('passport')
const registerFormRef = `${prefixCls}-register-form`
export default defineComponent({
    name: 'MiRegister',
    props: {
        action: PropTypes.oneOfType([PropTypes.string, PropTypes.func]).isRequired,
        background: PropTypes.string,
        title: PropTypes.string,
        redirectTo: PropTypes.string,
        binding: PropTypes.bool.def(false),
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
        passwordMinLength: PropTypes.number.def(6),
        passwordMaxLength: PropTypes.number.def(32),
        passwordComplexity: PropTypes.bool.def(true),
        passwordComplexityTip: PropTypes.string,
        passwordLevel: PropTypes.object,
        passwordRepeat: PropTypes.bool.def(true),
        usernameVerifyAction: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
        emailVerifyAction: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
        socialiteLoginDomain: PropTypes.string,
        loginLink: PropTypes.string,
        rules: PropTypes.object,
        content: PropTypes.any,
        usernameTip: PropTypes.any,
        footer: PropTypes.bool.def(true),
        example: PropTypes.bool.def(false)
    },
    data() {
        const vm = this as any
        return {
            loading: false,
            captcha: null,
            form: {
                validate: {
                    username: '',
                    email: '',
                    password: '',
                    repeat: '',
                    captcha: false,
                    uuid: null
                },
                rules: {
                    username: [{required: true, validator: vm.checkUserName, trigger: vm.usernameVerifyAction ? 'blur' : 'change'}],
                    email: [{required: true, validator: vm.checkEmail, trigger: vm.emailVerifyAction ? 'blur' : 'change'}],
                    captcha: [{required: true, validator: vm.checkCaptcha}]
                }
            }
        }
    },
    mounted() {
        this.form.validate.captcha = this.openCaptcha && (this.captchaInitAction || this.captchaVerifyAction) ? true : false
        !this.form.validate.captcha && delete this.form.validate.uuid
    },
    methods: {
        async checkUserName(_rule: any, value: string, _callback: any) {
            if (this.$tools.isEmpty(value)) {
                return Promise.reject('请设置用户账号')
            } else {
                if (!this.$g.regExp.username.test(value)) {
                    return Promise.reject('仅允许字母+数字，4-16 个字符，且以字母开头')
                } else {
                    if (this.usernameVerifyAction) {
                        return await this.$http.post(this.usernameVerifyAction, {value, binding: this.binding}).then((res: any) => {
                            if (res.ret.code !== 1) return Promise.reject(res.ret.message)
                            else return Promise.resolve()
                        }).catch((err: any) => {
                            if (err.status) {
                                const content = `[ ${err.status} ] ${err.statusText}`
                                MiModal.error({content})
                                return Promise.reject(content)
                            } else return Promise.reject(err)
                        })
                    } else return Promise.resolve()
                }
            }
        },
        async checkEmail(_rule: any, value: string, _callback: any) {
            if (this.$tools.isEmpty(value)) {
                return Promise.reject('请输入邮箱地址')
            } else {
                if (!this.$tools.checkEmail(value)) {
                    return Promise.reject('请输入有效的邮箱地址')
                } else {
                    if (this.emailVerifyAction) {
                        return await this.$http.post(this.emailVerifyAction, {value, binding: this.binding}).then((res: any) => {
                            if (res.ret.code !== 1) return Promise.reject(res.ret.message)
                            else return Promise.resolve()
                        }).catch((err: any) => {
                            if (err.status) {
                                const content = `[ ${err.status} ] ${err.statusText}`
                                MiModal.error({content})
                                return Promise.reject(content)
                            } else return Promise.reject(err)
                        })
                    } else return Promise.resolve()
                }
            }
        },
        checkCaptcha(_rule: any, _value: boolean, _callback: any) {
            if (!isVerify) return Promise.reject('请点击按钮进行验证码校验')
            else return Promise.resolve()
        },
        getMaskElem() {
            let mask: any = null
            if (!this.$g.mobile) mask = (<div class={`${prefixCls}-mask`}></div>)
            return mask
        },
        getTitleElem() {
            return (
                <div class={`${prefixCls}-title`}>
                    <span innerHTML={this.title ?? this.$g.site}></span>
                    <sup><img src={this.$g.avatar} class={`${prefixCls}-logo`} alt={this.$g.powered} /></sup>
                </div>
            )
        },
        getUserNameElem() {
            const content = this.getUserNameContent()
            const defaultInput = (
                <Input
                    prefix={createVNode(UserOutlined)}
                    value={this.form.validate.username}
                    onInput={this.handleUserNameValue}
                    maxlength={16}
                    placeholder="请输入用户名 / 邮箱地址 / 手机号码">
                </Input>
            )
            let template = defaultInput
            if (content !== null) {
                template = (
                    <Popover placement="top"
                        trigger="focus"
                        content={content}>
                        { defaultInput }
                    </Popover>
                )
            }
            return (
                <Form.Item name="username" ref="username">
                    { template }
                </Form.Item>
            )
        },
        getUserNameContent() {
            let content = getSlotContent(this, 'usernameTip')
            if (content === undefined) {
                content = (
                    <div class={`${prefixCls}-register-tips${this.$g.mobile ? ` ${prefixCls}-register-tips-mobile` : ''}`}>
                        <p><span class="red">&lt; 特别提醒 &gt;</span> 登录用户名，一旦设置，则无法更改。</p>
                        <p>- 由 <span class="theme-color">字母</span>、<span class="theme-color">数字</span> 或 <span class="theme-color">下划线</span> 组成。</p>
                        <p>- 只能以 <span class="theme-color">字母开头</span>，例如：makeit。</p>
                        <p>- 用户名长度为 <span class="theme-color">4-16</span> 个字符。</p>
                    </div>
                )
            }
            return content
        },
        handleUserNameValue(e: any) {
            this.form.validate.username = e.target.value
            this.$refs.username.onFieldChange()
        },
        getEmailElem() {
            return (
                <Form.Item name="email" ref="email">
                    <Input
                        type="email"
                        prefix={createVNode(MailOutlined)}
                        value={this.form.validate.email}
                        onInput={this.handleEmailValue}
                        maxlength={256}
                        placeholder="请输入邮箱地址">
                    </Input>
                </Form.Item>
            )
        },
        handleEmailValue(e: any) {
            this.form.validate.email = e.target.value
            this.$refs.email.onFieldChange()
        },
        handlePasswordValue(value: string) {
            this.form.validate.password = value
        },
        handlePassworRepeatValue(value: string) {
            this.form.validate.repeat = value
        },
        getCaptchaElem() {
            if (this.openCaptcha) {
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
        getButtonElem() {
            const login = this.$g.mobile ? (
                <Button size="large" class={`${prefixCls}-submit ${prefixCls}-submit-register`}>
                    <RouterLink to={{path: '/login'}}>已有账号？前往登录</RouterLink>
                </Button>
            ) : null
            return (
                <>
                    <Button class={`${prefixCls}-submit`} onClick={this.handleRegister}>
                        { this.binding ? '立即绑定' : '注册' }
                    </Button>
                    { login }
                </>
            )
        },
        getQuickLoginElem() {
            const link = !this.loginLink
                ? (<RouterLink to={{path: '/login'}}>登录</RouterLink>)
                : (<a href={this.loginLink} innerHTML="登录"></a>)
            return (
                <Form.Item class={`${prefixCls}-socialite`}>
                    { !this.$g.mobile ? (
                        <div class={`${prefixCls}-socialite-link`}>
                            已有账号？{ link }
                        </div>
                    ) : null }
                    <MiLoginQuick></MiLoginQuick>
                </Form.Item>
            )
        },
        getFormElem() {
            const formPrefixCls = this.$tools.getPrefixCls('form')
            return (
                <div class={`${prefixCls}-form`}>
                    <Form
                        layout="vertical"
                        class={formPrefixCls}
                        ref={registerFormRef}
                        model={this.form.validate}
                        rules={Object.assign({}, this.form.rules, this.rules)}>
                        { this.getUserNameElem() }
                        { this.getEmailElem() }
                        <MiPassport
                            repeat={this.passwordRepeat}
                            loading={this.loading}
                            value={this.form.validate.password}
                            minLength={this.passwordMinLength}
                            maxLength={this.passwordMaxLength}
                            complexity={this.passwordComplexity}
                            complexityTip={this.passwordComplexityTip}
                            level={this.passwordLevel}
                            onRepeatChange={this.handlePassworRepeatValue}
                            onChange={this.handlePasswordValue}>
                        </MiPassport>
                        { this.getCaptchaElem() }
                        { this.getButtonElem() }
                        { this.getQuickLoginElem() }
                    </Form>
                </div>
            )
        },
        handleCaptchaVerify(data: any) {
            if (data && data.uuid) this.form.validate.uuid = data.uuid
            this.captcha = true
            isVerify = true
            this.$refs[registerFormRef].validateFields(['captcha'])
            this.$emit('captchaSuccess', data)
        },
        handleRegister() {
            if (this.loading) return 
            this.loading = true
            this.$refs[registerFormRef].validate().then(() => {
                if (
                    !this.form.validate.captcha ||
                    (this.form.validate.captcha && this.captcha)
                ) {
                    if (!this.example) {
                        if (typeof this.action === 'string') {
                            this.$store.dispatch('passport/register', this.form.validate).then((res: any) => {
                                this.loading = false
                                if (res.ret.code === 1) {
                                    this.$storage.set(this.$g.caches.storages.email, this.form.validate.email)
                                    if (this.redirectTo) {
                                        if (this.$g.regExp.url.test(this.redirectTo)) {
                                            window.location.href = this.redirectTo
                                        } else this.$router.push({path: this.redirectTo})
                                    } else this.$router.push({path: '/'})
                                } else MiModal.error({content: res.ret.message})
                            }).catch((err: any) => {
                                this.loading = false
                                MiModal.error({content: err.message})
                            })
                        } else if (typeof this.action === 'function') {
                            this.loading = false
                            this.action.call(this, this.form.validate)
                        }
                    } else {
                        MiModal.success({content: '校验通过（示例不进行提交操作）'})
                        this.loading = false
                    }
                } else this.loading = false
            }).catch(() => {
                this.loading = false
            })
        }
    },
    render() {
        const cls = prefixCls + (this.$g.mobile ? ` ${prefixCls}-mobile` : '')
        const style = {backgroundImage: `url('${this.background ?? this.$g.background.default}')`}
        let formTemplate = getSlotContent(this, 'content')
        if (!formTemplate) formTemplate = this.getFormElem()
        return (
            <div class={cls} style={style}>
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