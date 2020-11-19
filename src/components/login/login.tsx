import { defineComponent, createVNode } from 'vue'
import { Form, Row, Col, Input } from 'ant-design-vue'
import { UserOutlined, LockOutlined, UnlockOutlined, EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons-vue'
import PropTypes from '../../utils/props'

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
                    username: null,
                    password: null,
                    remember: false,
                    captcha: false,
                    uuid: null,
                    url: null
                },
                rules: {}
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
                    <Form class={formPrefixCls} ref="form" model={this.form.validate} rules={this.form.rules}>
                        { () => (
                            <>
                                { this.getUserNameElem() }
                                { this.getPasswordElem() }
                            </>
                        ) }
                    </Form>
                </div>
            )
        },
        getUserNameElem() {
            return (
                <Form.Item name="username">
                    { () => (
                        <Input
                            prefix={createVNode(UserOutlined)}
                            type="text"
                            value={this.form.validate.username}
                            maxlength={256}
                            size="large"
                            placeholder="请输入用户名 / 邮箱地址 / 手机号码" />
                    ) }
                </Form.Item>
            )
        },
        getPasswordElem() {
            let password: any = null
            if (this.password) {
                password = (
                    <Input
                        type="password"
                        maxlength={32}
                        size="large"
                        prefix={createVNode(LockOutlined)}
                        suffix={createVNode(EyeInvisibleOutlined)}
                        value={this.form.validate.password}
                        placeholder="请输入登录密码" />
                )
            } else {
                password = (
                    <Input
                        type="text"
                        maxlength={32}
                        size="large"
                        prefix={createVNode(UnlockOutlined)}
                        suffix={createVNode(EyeOutlined)}
                        value={this.form.validate.password}
                        placeholder="请输入登录密码" />
                )
            }
            return (
                <Form.Item name="password">
                    { () => password }
                </Form.Item>
            )
        },
        handlePasswordVisible() {

        }
    },
    render() {
        const prefixCls = this.getPrefixCls()
        let className = prefixCls + (this.$g.mobile ? ` ${prefixCls}-mobile` : '')
        className += this.className ? ` ${this.className}` : ''
        const style = {backgroundImage: `url('${this.background ?? this.$g.background.default}')`}
        return (
            <div class={className} style={style}>
                <Row class={`${prefixCls}-content`}>
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
            </div>
        )
    }
})
export default Login as typeof Login
