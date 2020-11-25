import { defineComponent, createVNode } from 'vue'
import { Form, Row, Col, Input, Popover } from 'ant-design-vue'
import { UserOutlined, MailOutlined } from '@ant-design/icons-vue'
import MiLayout from '../layout'
import MiModal from '../modal'
import PropTypes, { getSlotContent } from '../../utils/props'
import { $tools } from '../../utils/tools'

const prefixCls = $tools.getPrefixCls('passport')
export default defineComponent({
    name: 'MiRegister',
    props: {
        background: PropTypes.string,
        title: PropTypes.string,
        captchaInitAction: PropTypes.string,
        captchaVerifyAction: PropTypes.string,
        captchaBackground: PropTypes.string,
        captchaThemeColor: PropTypes.string,
        captchaMaxTries: PropTypes.number.def(5),
        captchaOnSuccess: PropTypes.func,
        usernameVerifyAction: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
        emailVerifyAction: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
        socialiteLoginDomain: PropTypes.string,
        rules: PropTypes.object,
        content: PropTypes.any,
        usernameTip: PropTypes.any
    },
    data() {
        const vm = this as any
        const checkUserName = (_rule: any, value: string, _callback: any) => {
            if (vm.$tools.isEmpty(value)) {
                return Promise.reject('请设置用户账号')
            } else {
                if (!vm.$g.regExp.username.test(value)) {
                    return Promise.reject('仅允许字母+数字，4-16 个字符，且以字母开头')
                } else {
                    if (vm.usernameVerifyAction) {
                        vm.$http.get(`${this.usernameVerifyAction}/${value}`).then((res: any) => {
                            if (res.ret.code !== 1) {
                                return Promise.reject(res.ret.message)
                            } else return Promise.resolve()
                        }).catch((err: any) => {
                            MiModal.error({content: err.message})
                            return Promise.reject('请设置用户账号')
                        })
                    } else return Promise.resolve()
                }
            }
        }
        const checkEmail = (_rule: any, value: string, _callback: any) => {
            if (vm.$tools.isEmpty(value)) {
                return Promise.reject('请输入邮箱地址')
            } else {
                if (!vm.$tools.checkEmail(value)) {
                    return Promise.reject('请输入有效的邮箱地址')
                } else {
                    if (vm.emailVerifyAction) {
                        vm.$http.get(`${this.emailVerifyAction}/${value}`).then((res: any) => {
                            if (res.ret.code !== 1) return Promise.reject(res.ret.message)
                            else return Promise.resolve()
                        }).catch((err: any) => {
                            MiModal.error(err.message)
                            return Promise.reject('请输入邮箱地址')
                        })
                    } else return Promise.resolve()
                }
            }
        }
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
	                    username: [{required: true, validator: checkUserName, trigger: 'blur'}],
	                    email: [{required: true, validator: checkEmail, trigger: 'blur'}],
                        repeat: [{required: true, message: '请再次确认密码'}]
                    }
                }
        }
    },
    methods: {
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
                    <Popover placement="top" trigger="focus" content={content}>
                        { () => defaultInput }
                    </Popover>
                )
            }
            return (
                <Form.Item name="username">
                    { () => template }
                </Form.Item>
            )
        },
        getUserNameContent() {
            let content = getSlotContent(this, 'usernameTip')
            if (content === undefined) {
                content = (
                    <div class={`${prefixCls}-register-tips`}>
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
        },
        getEmailElem() {
            return (
                <Form.Item name="email">
                    { () => <Input
                        type="email"
                        prefix={createVNode(MailOutlined)}
                        value={this.form.validate.email}
                        onInput={this.handleEmailValue}
                        maxlength={256}
                        placeholder="请输入邮箱地址">
                    </Input> }
                </Form.Item>
            )
        },
        handleEmailValue(e: any) {
            this.form.validate.email = e.target.value
        },
        getFormElem() {
            const formPrefixCls = this.$tools.getPrefixCls('form')
            return (
                <div class={`${prefixCls}-form`}>
                    <Form
                        layout="vertical"
                        class={formPrefixCls}
                        ref={`${prefixCls}-register-form`}
                        model={this.form.validate}
                        rules={Object.assign({}, this.form.rules, this.rules)}>
                        { () => (
                            <>
                                { this.getUserNameElem() }
                                { this.getEmailElem() }
                            </>
                        ) }
                    </Form>
                </div>
            )
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
                { () => <Col class={`${prefixCls}-box`} xs={24} sm={18} md={12} lg={12}>
                        { () => (
                            <>
                                { this.getMaskElem() }
                                { this.getTitleElem() }
                                { formTemplate }
                            </>
                        ) }
                    </Col> }
                </Row>
                <MiLayout.Footer></MiLayout.Footer>
            </div>
        )
    }
})