import { defineComponent, createVNode } from 'vue'
import { RouterLink } from 'vue-router'
import { Form, Row, Col, Input, Checkbox, Button } from 'ant-design-vue'
import {
    UserOutlined, LockOutlined, UnlockOutlined,
    EyeOutlined, EyeInvisibleOutlined, QuestionCircleOutlined
} from '@ant-design/icons-vue'
import PropTypes from '../../utils/props'
import MiLoginQuick from './quick'
import MiLayout from '../layout'

const Login = defineComponent({
    name: 'MiLogin',
    props: {
        className: PropTypes.string,
        background: PropTypes.string,
        title: PropTypes.string,
        captchaInitAction: PropTypes.string,
        captchaVerifyAction: PropTypes.string,
        socialiteLoginDomain: PropTypes.string,
        registerLink: PropTypes.string
    },
    data() {
        return {
            loading: false,
            captcha: false,
            password: true,
            form: {
                validate: {
                    username: '',
                    password: null,
                    remember: false,
                    captcha: false,
                    uuid: null,
                    url: null
                },
                rules: {
                    username: [{required: true, message: '请输入用户名 / 邮箱地址 / 手机号码', trigger: 'blur'}],
                    password: [{required: true, message: '请输入登录密码', trigger: 'blur'}]
                }
            }
        }
    },
    beforeCreate() {
        const token = this.$cookie.get(this.$g.caches.cookies.token.access)
        if (token) this.$router.push({path: '/'})
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
                        ref="form"
                        model={this.form.validate}
                        rules={this.form.rules}>
                        { () => (
                            <>
                                { this.getUserNameElem() }
                                { this.getPasswordElem() }
                                { this.getCaptchaElem() }
                                { this.getRememberBtnElem() }
                                { this.getButtonElem() }
                                { this.getQuickLoginElem() }
                            </>
                        ) }
                    </Form>
                </div>
            )
        },
        getUserNameElem() {
            return (
                <Form.Item name="username">
                    { () => <Input
                        prefix={createVNode(UserOutlined)}
                        value={this.form.validate.username}
                        onInput={this.handleUserNameValue}
                        maxlength={64}
                        placeholder="请输入用户名 / 邮箱地址 / 手机号码">
                    </Input> }
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
                    { () => password }
                </Form.Item>
            )
        },
        getCaptchaElem() {
            if (
                this.captchaInitAction &&
                this.captchaVerifyAction
            ) {
                const prefixCls = this.getPrefixCls()
                return (
                    <Form.Item class={`${prefixCls}-captcha`}></Form.Item>
                )
            }
            return null
        },
        getRememberBtnElem() {
            const prefixCls = this.getPrefixCls()
            return (
                <Form.Item class={`${prefixCls}-remember`}>
                    { () => (
                        <>
                            <Checkbox checked={this.form.validate.remember}>{ () => '保持登录' }</Checkbox>
                            <RouterLink to={{path: '/'}} class={`${prefixCls}-forget`}>
                                { () => (<><QuestionCircleOutlined />忘记密码</>) }
                            </RouterLink>
                        </>
                    ) }
                </Form.Item>
            )
        },
        getButtonElem() {
            const prefixCls = this.getPrefixCls()
            const register = this.$g.mobile ? (
                <Button size="large" class={`${prefixCls}-submit ${prefixCls}-submit-register`}>
                    { () => (
                        <RouterLink to={{path: '/register'}}>
                            { () => '没有账号？立即注册' }
                        </RouterLink>
                    ) }
                </Button>
            ) : null
            return (
                <>
                    <Button class={`${prefixCls}-submit`} onClick={this.handleLogin}>
                        { () => '登录' }
                    </Button>
                    { register }
                </>
            )
        },
        getQuickLoginElem() {
            const prefixCls = this.getPrefixCls()
            const link = !this.registerLink ? (
                <RouterLink to={{path: '/register'}}>{ () => '注册' }</RouterLink>
            ) : (
                <a href={this.registerLink} innerHTML="注册"></a>
            )
            return (
                <Form.Item class={`${prefixCls}-socialite`}>
                    { () => (
                        <>
                            { !this.$g.mobile ? (
                                <div class={`${prefixCls}-socialite-register`}>
                                    没有账号？{ link }
                                </div>
                            ) : null }
                            <MiLoginQuick></MiLoginQuick>
                        </>
                    ) }
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
        handleLogin() {}
    },
    render() {
        const prefixCls = this.getPrefixCls()
        let className = prefixCls + (this.$g.mobile ? ` ${prefixCls}-mobile` : '')
        className += this.className ? ` ${this.className}` : ''
        const style = {backgroundImage: `url('${this.background ?? this.$g.background.default}')`}
        return (
            <div class={className} style={style}>
                <Row class={`${prefixCls}-content`} align={this.$g.mobile ? 'top' : 'middle'}>
                    { () => <Col class={`${prefixCls}-box`} xs={24} sm={18} md={12} lg={12}>
                        { () => (
                            <>
                                { this.getMaskElem() }
                                { this.getTitleElem() }
                                { this.getFormElem() }
                            </>
                        ) }
                    </Col> }
                </Row>
                <MiLayout.Footer></MiLayout.Footer>
            </div>
        )
    }
})

Login.Quick = MiLoginQuick
export default Login as typeof Login & {
    readonly Quick: typeof MiLoginQuick
}
