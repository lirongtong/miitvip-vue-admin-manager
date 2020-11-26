import { defineComponent, createVNode } from 'vue'
import { Form, Input, Popover } from 'ant-design-vue'
import {
    EyeInvisibleOutlined, LockOutlined, EyeOutlined, UnlockOutlined,
    CheckOutlined, CloseOutlined
} from '@ant-design/icons-vue'
import PropTypes from '../../utils/props'

export default defineComponent({
    name: 'MiPassword',
    props: {
        repeat: PropTypes.bool.def(false),
        value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        tips: PropTypes.any,
        rules: PropTypes.object,
        onChange: PropTypes.func,
        onRepeatChange: PropTypes.func
    },
    data() {
        const vm = this as any
        return {
            visible: false,
            repeatVisible: false,
            level: {
                1: '弱不禁风',
                2: '平淡无奇',
                3: '出神入化',
                4: '登峰造极'
            },
            password: {
                strength: 0,
                tips: null,
                length: false,
                format: false,
                complexity: false
            },
            form: {
                validate: {
                    password: null,
                    repeat: null
                },
                rules: {
                    password: [{required: true, validator: vm.checkPassword}],
                    repeat: [{required: vm.repeat, validator: vm.checkRepeat}]
                }
            }
        }
    },
    methods: {
        checkPassword(_rule: any, value: string, _callback: any) {
            if (this.$tools.isEmpty(value)) {
                this.password = {
                    strength: 0,
                    tips: null,
                    length: false,
                    format: false,
                    complexity: false
                }
                return Promise.reject('请设置密码')
            } else {
                this.password.format = true
                if (value.length < 6) {
                    this.password.length = false
                    this.password.strength = 0
                    this.password.tips = null
                    return Promise.reject('密码长度至少为6个字符')
                }
                if (this.$tools.checkPassword(value)) {
                    this.password.length = true
                    const strength = this.$tools.getPasswordStrength(value)
                    this.password.strength = strength
                    this.password.tips = this.level[strength]
                    if (strength <= 1) {
                        this.password.complexity = false
                        return Promise.reject('需包含字母、数字及特殊字符两种或以上组合')
                    } else {
                        this.password.complexity = true
                        return Promise.resolve()
                    }
                }
            }
        },
        checkRepeat(_rule: any, value: string, _callback: any) {
            if (this.$tools.isEmpty(value)) {
                return Promise.reject('请再次输入密码')
            } else {
                if (this.form.validate.password !== value) {
                    return Promise.reject('两次密码输入不一致')
                }
                return Promise.resolve()
            }
        },
        getPasswordElem(
            value: any,
            changeHandler: (...args: any) => {},
            visibleHandler: (...args: any) => {},
            placeholder = '请输入密码'
        ) {
            let password: any = null
            if (!this.visible) {
                const suffix = (<EyeInvisibleOutlined onClick={visibleHandler} />)
                password = (
                    <Input
                        type="password"
                        maxlength={32}
                        prefix={createVNode(LockOutlined)}
                        suffix={suffix}
                        value={value}
                        onChange={changeHandler}
                        placeholder={placeholder} />
                )
            } else {
                const suffix = (<EyeOutlined onClick={visibleHandler} />)
                password = (
                    <Input
                        type="text"
                        maxlength={32}
                        prefix={createVNode(UnlockOutlined)}
                        suffix={suffix}
                        value={value}
                        onInput={changeHandler}
                        placeholder={placeholder} />
                )
            }
            return password
        },
        handlePasswordValue(e: any) {
            this.form.validate.password = e.target.value
            this.$refs.password.onFieldChange()
            this.$emit('change', this.form.validate.password)
        },
        handlePasswordVisible() {
            this.visible = !this.visible
        },
        getPopoverContent() {
            const prefixCls = this.$tools.getPrefixCls('passport')
            const strengthCls = this.$tools.getPrefixCls('password-strength')
            return (
                <div class={`${prefixCls}-register-tips`}>
                    <div class={`${strengthCls}-item`}>
                        <span>密码强度</span>
                        <div class={`${strengthCls}-group`}>
                            <i class={`${strengthCls}${this.password.strength > 0 ? ' active' : ''}`}></i>
                            <i class={`${strengthCls}${this.password.strength > 1 ? ' active' : ''}`}></i>
                            <i class={`${strengthCls}${this.password.strength > 2 ? ' active' : ''}`}></i>
                            <i class={`${strengthCls}${this.password.strength > 3 ? ' active' : ''}`}></i>
                        </div>
                        <span class="theme-color" innerHTML={this.password.tips}></span>
                    </div>
                    <div class={`${strengthCls}-item`}>
                        { this.password.length
                            ? (<CheckOutlined class="success" />)
                            : (<CloseOutlined class="failed" />)
                        }
                        <span>6-32个字符，区分大小写，前后无空格</span>
                    </div>
                    <div class={`${strengthCls}-item`}>
                        { this.password.format
                            ? (<CheckOutlined class="success" />)
                            : (<CloseOutlined class="failed" />)
                        }
                        <span>字母、数字及英文符号 ~!@#$%^&*(.,)_+=-</span>
                    </div>
                    <div class={`${strengthCls}-item`}>
                        { this.password.complexity
                            ? (<CheckOutlined class="success" />)
                            : (<CloseOutlined class="failed" />)
                        }
                        <span>需包含字母、数字及特殊字符两种及以上的组合</span>
                    </div>
                </div>
            )
        },
        getRepeatElem() {
            return this.repeat ? (
                <Form.Item name="repeat" ref="repeat">
                    { () => this.getPasswordElem(
                        this.form.validate.repeat,
                        this.handlerRepeatValue,
                        this.handleRepeatVisible,
                        '请再次输入密码'
                    ) }
                </Form.Item>
            ) : null
        },
        handlerRepeatValue(e: any) {
            this.form.validate.repeat = e.target.value
            this.$refs.repeat.onFieldChange()
            this.$emit('repeatChange', this.form.validate.repeat)
        },
        handleRepeatVisible() {
            this.repeatVisible = !this.repeatVisible
        }
    },
    render() {
        const ref = this.$tools.getPrefixCls('password-form')
        return (
            <Form
                ref={ref}
                layout="vertical"
                model={this.form.validate}
                rules={Object.assign({}, this.form.rules, this.rules)}>
                { () => (
                    <>
                        <Form.Item name="password" ref="password">
                            { () => (
                                <Popover trigger="focus" placement="top" content={this.getPopoverContent}>
                                    { () => this.getPasswordElem(
                                        this.form.validate.password,
                                        this.handlePasswordValue,
                                        this.handlePasswordVisible
                                    ) }
                                </Popover>
                            ) }
                        </Form.Item>
                        { this.getRepeatElem() }
                    </>
                ) }
            </Form>
        )
    }
})