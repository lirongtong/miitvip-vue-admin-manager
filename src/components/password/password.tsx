import { defineComponent, createVNode } from 'vue'
import { Form, Input, Popover } from 'ant-design-vue'
import {
    EyeInvisibleOutlined, LockOutlined, EyeOutlined, UnlockOutlined,
    CheckOutlined, CloseOutlined
} from '@ant-design/icons-vue'
import PropTypes from '../../utils/props'
import { $tools } from '../../utils/tools'

const formRef = $tools.getPrefixCls('password-form')
export default defineComponent({
    name: 'MiPassword',
    emits: ['update:value', 'change', 'input', 'update:repeatValue'],
    props: {
        repeat: PropTypes.bool.def(false),
        value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        repeatValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        loading: PropTypes.bool.def(false),
        minLength: PropTypes.number.def(6),
        maxLength: PropTypes.number.def(32),
        complexity: PropTypes.bool.def(true),
        complexityTip: PropTypes.string.def('需包含字母、数字及特殊字符两种或以上组合'),
        level: PropTypes.object.def({
            1: '弱不禁风',
            2: '平淡无奇',
            3: '出神入化',
            4: '登峰造极'
        }),
        rules: PropTypes.object,
        onChange: PropTypes.func,
        onRepeatChange: PropTypes.func
    },
    data() {
        const vm = this as any
        return {
            visible: false,
            repeatVisible: false,
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
    watch: {
        loading(_o: boolean, v: boolean) {
            if (v === true) this.$refs[formRef].validate()
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
                if (value.length < this.minLength) {
                    this.password.length = false
                    this.password.strength = 0
                    this.password.tips = null
                    return Promise.reject(`密码长度至少为${this.minLength}个字符`)
                }
                if (this.complexity) {
                    if (this.$tools.checkPassword(value)) {
                        this.password.length = true
                        const strength = this.$tools.getPasswordStrength(value)
                        this.password.strength = strength
                        this.password.tips = this.level[strength]
                        if (strength <= 1) {
                            this.password.complexity = false
                            return Promise.reject(this.complexityTip)
                        } else {
                            this.password.complexity = true
                            return Promise.resolve()
                        }
                    }
                } else {
                    this.password.length = true
                    const strength = this.$tools.getPasswordStrength(value)
                    this.password.strength = strength
                    this.password.tips = this.level[strength]
                    this.password.complexity = true
                    return Promise.resolve()
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
            inputHandler: (...args: any) => {},
            visibleHandler: (...args: any) => {},
            placeholder = '请输入密码'
        ) {
            let password: any = null
            if (!this.visible) {
                const suffix = (<EyeInvisibleOutlined onClick={visibleHandler} />)
                password = (
                    <Input
                        type="password"
                        maxlength={this.maxLength}
                        prefix={createVNode(LockOutlined)}
                        suffix={suffix}
                        value={value}
                        onInput={inputHandler}
                        placeholder={placeholder} />
                )
            } else {
                const suffix = (<EyeOutlined onClick={visibleHandler} />)
                password = (
                    <Input
                        type="text"
                        maxlength={this.maxLength}
                        prefix={createVNode(UnlockOutlined)}
                        suffix={suffix}
                        value={value}
                        onInput={inputHandler}
                        placeholder={placeholder} />
                )
            }
            return password
        },
        handlePasswordInput(e: any) {
            const val = e.target.value
            this.form.validate.password = val
            this.$refs.password.onFieldChange()
            this.$emit('update:value', val)
            this.$emit('change', val)
            this.$emit('input', val)
        },
        handlePasswordVisible() {
            this.visible = !this.visible
        },
        getPopoverContent() {
            const prefixCls = this.$tools.getPrefixCls('passport')
            const strengthCls = this.$tools.getPrefixCls('password-strength')
            return (
                <div class={`${prefixCls}-register-tips${this.$g.mobile ? ` ${prefixCls}-register-tips-mobile` : ''}`}>
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
                        <span>{ this.minLength }-{ this.maxLength }个字符，区分大小写，前后无空格</span>
                    </div>
                    <div class={`${strengthCls}-item`}>
                        { this.password.format
                            ? (<CheckOutlined class="success" />)
                            : (<CloseOutlined class="failed" />)
                        }
                        <span>字母、数字及英文符号 ~!@#$%^&*(.,)_+=-</span>
                    </div>
                    { this.complexity ? (
                        <div class={`${strengthCls}-item`}>
                            { this.password.complexity
                                ? (<CheckOutlined class="success" />)
                                : (<CloseOutlined class="failed" />)
                            }
                            <span>{ this.complexityTip }</span>
                        </div>
                    ) : null }
                </div>
            )
        },
        getRepeatElem() {
            return this.repeat ? (
                <Form.Item name="repeat" ref="repeat">
                    { this.getPasswordElem(
                        this.form.validate.repeat,
                        this.handleRepeatInput,
                        this.handleRepeatVisible,
                        '请再次输入密码'
                    ) }
                </Form.Item>
            ) : null
        },
        handleRepeatInput(e: any) {
            const val = e.target.value
            this.form.validate.repeat = val
            this.$refs.repeat.onFieldChange()
            this.$emit('update:repeatValue', val)
            this.$emit('repeatChange', this.form.validate.repeat)
        },
        handleRepeatVisible() {
            this.repeatVisible = !this.repeatVisible
        }
    },
    render() {
        return (
            <Form
                ref={formRef}
                layout="vertical"
                model={this.form.validate}
                rules={Object.assign({}, this.form.rules, this.rules)}>
                <Form.Item name="password" ref="password">
                    <Popover trigger="focus" placement="top" content={this.getPopoverContent}>
                        { this.getPasswordElem(
                            this.form.validate.password,
                            this.handlePasswordInput,
                            this.handlePasswordVisible
                        ) }
                    </Popover>
                </Form.Item>
                { this.getRepeatElem() }
            </Form>
        )
    }
})