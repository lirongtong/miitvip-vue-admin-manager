import { defineComponent, reactive, ref, createVNode } from 'vue'
import { useI18n } from 'vue-i18n'
import { Form, Input, Popover } from 'ant-design-vue'
import {
    EyeInvisibleOutlined, EyeOutlined, LockOutlined, UnlockOutlined,
    CheckOutlined, CloseOutlined
} from '@ant-design/icons-vue'
import { getPrefixCls } from '../_utils/props-tools'
import PropTypes from '../_utils/props-types'
import { $tools } from '../../utils/tools'

export const passwordProps = () => ({
    prefixCls: PropTypes.string,
    repeat: PropTypes.bool.def(false),
    modelValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    repeatValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    loading: PropTypes.bool.def(false),
    minLength: PropTypes.number.def(6),
    maxLength: PropTypes.number.def(32),
    complexity: PropTypes.bool.def(true),
    complexityTip: PropTypes.string,
    level: PropTypes.object,
    rules: PropTypes.object,
    width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).def(360),
    height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).def(42),
    radius: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).def(48),
    bgColor: PropTypes.string
})

export default defineComponent({
    name: 'MiPassword',
    inheritAttrs: false,
    props: passwordProps(),
    emits: ['change', 'repeatChange', 'update:modelValue', 'update:repeatValue', 'input'],
    setup(props, {emit}) {
        const { t, locale } = useI18n()
        const prefixCls = getPrefixCls('password', props.prefixCls)
        const prefixKey = getPrefixCls('password-key', props.prefixCls)
        const langCls = getPrefixCls(`lang-${locale.value}`, props.prefixCls)
        const prefixId = `${prefixKey}-${$tools.uid()}`
        const level = props.level ?? {
            1: t('password.lv1'),
            2: t('password.lv2'),
            3: t('password.lv3'),
            4: t('password.lv4')
        }
        const tip = props.complexityTip ?? t('password.tip')
        const formRef = ref<InstanceType<typeof HTMLFormElement>>(null)
        const passwordRef = ref<InstanceType<typeof HTMLDivElement>>(null)
        const repeatRef = ref<InstanceType<typeof HTMLDivElement>>(null)

        const checkPassword = (_rule: any, value: string, _callback) => {
            if ($tools.isEmpty(value)) {
                params.password = {
                    strength: 0,
                    tips: null,
                    length: false,
                    format: false,
                    complexity: false
                }
                return Promise.reject(t('password.setting'))
            } else {
                params.password.format = true
                if (value.length < props.minLength) {
                    params.password.length = false
                    params.password.strength = 0
                    params.password.tips = null
                    return Promise.reject(t('password.least', {min: props.minLength}))
                }
                if (props.complexity) {
                    if ($tools.checkPassword(value)) {
                        params.password.length = true
                        const strength = $tools.getPasswordStrength(value)
                        params.password.strength = strength
                        params.password.tips = level[strength]
                        if (strength <= 1) {
                            params.password.complexity = false
                            return Promise.reject(tip)
                        } else {
                            params.password.complexity = true
                            return Promise.resolve()
                        }
                    }
                } else {
                    params.password.length = true
                    const strength = $tools.getPasswordStrength(value)
                    params.password.strength = strength
                    params.password.tips = level[strength]
                    params.password.complexity = true
                    return Promise.resolve()
                }
            }
        }

        const checkRepeat = (_rule: any, value: string, _callback: any) => {
            if ($tools.isEmpty(value)) {
                return Promise.reject(t('password.repeat'))
            } else {
                if (params.form.validate.password !== value) {
                    return Promise.reject(t('password.different'))
                }
                return Promise.resolve()
            }
        }

        const params = reactive({
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
                    password: [{required: true, validator: checkPassword}],
                    repeat: [{required: props.repeat, validator: checkRepeat}]
                }
            }
        })

        const onInput = (evt: any) => {
            const val = evt.target.value
            params.form.validate.password = val
            emit('update:modelValue', val)
            emit('change', val)
            emit('input', val)
            if (
                props.repeat &&
                params.form.validate.repeat
            ) formRef.value.validateFields('repeat')
        }

        const onVisible = () => {
            params.visible = !params.visible
        }

        const onRepeatInput = (evt: any) => {
            const val = evt.target.value
            params.form.validate.repeat = val
            emit('update:repeatValue', val)
            emit('repeatChange', val)
        }

        const onRepeatVisible = () => {
            params.repeatVisible = !params.repeatVisible
        }

        const renderPassword = (
            value: any,
            inputHandler: (...args: any) => any,
            visibleHandler: (...args: any) => any,
            placeholder?: string,
            key?: string
        ) => {
            placeholder = placeholder ?? t('password.placeholder')
            let password: any = null
            if (!params.visible) {
                const suffix = <EyeInvisibleOutlined onClick={visibleHandler} />
                password = (
                    <Input maxlength={props.maxLength}
                        class={`${prefixCls}-input`}
                        prefix={createVNode(LockOutlined)}
                        suffix={suffix}
                        value={value}
                        onInput={inputHandler}
                        placeholder={placeholder}
                        autocomplete="off"
                        id={key ?? prefixId}
                        style={{
                            width: $tools.convert2Rem(props.width),
                            height: $tools.convert2Rem(props.height),
                            borderRadius: $tools.convert2Rem(props.radius),
                            background: props.bgColor ?? null
                        }}
                        type="password" />
                )
            } else {
                const suffix = (<EyeOutlined onClick={visibleHandler} />)
                password = (
                    <Input type="text"
                        maxlength={props.maxLength}
                        prefix={createVNode(UnlockOutlined)}
                        suffix={suffix}
                        value={value}
                        onInput={inputHandler}
                        autocomplete="off"
                        id={key ?? prefixId}
                        style={{
                            width: $tools.convert2Rem(props.width),
                            height: $tools.convert2Rem(props.height),
                            borderRadius: $tools.convert2Rem(props.radius),
                            background: props.bgColor ?? null
                        }}
                        placeholder={placeholder} />
                )
            }
            return password
        }

        const renderPopover = () => {
            const strengthCls = getPrefixCls('password-strength', props.prefixCls)
            return (
                <div class={`${prefixCls}-tips`}>
                    <div class={`${strengthCls}-item`}>
                        <span>{t('password.strong')}</span>
                        <div class={`${strengthCls}-group`}>
                            <i class={`${strengthCls}${params.password.strength > 0 ? ' active' : ''}`}></i>
                            <i class={`${strengthCls}${params.password.strength > 1 ? ' active' : ''}`}></i>
                            <i class={`${strengthCls}${params.password.strength > 2 ? ' active' : ''}`}></i>
                            <i class={`${strengthCls}${params.password.strength > 3 ? ' active' : ''}`}></i>
                        </div>
                        <span class="theme-color" innerHTML={params.password.tips}></span>
                    </div>
                    <div class={`${strengthCls}-item`}>
                        { params.password.length
                            ? (<CheckOutlined class="success" />)
                            : (<CloseOutlined class="failed" />)
                        }
                        <span>{t('password.size', {min: props.minLength, max: props.maxLength})}</span>
                    </div>
                    <div class={`${strengthCls}-item`}>
                        { params.password.format
                            ? (<CheckOutlined class="success" />)
                            : (<CloseOutlined class="failed" />)
                        }
                        <span>{t('password.format')}</span>
                    </div>
                    { props.complexity ? (
                        <div class={`${strengthCls}-item`}>
                            { params.password.complexity
                                ? (<CheckOutlined class="success" />)
                                : (<CloseOutlined class="failed" />)
                            }
                            <span>{ tip }</span>
                        </div>
                    ) : null }
                </div>
            )
        }

        const renderRepeat = () => {
            return props.repeat ? (
                <Form.Item name="repeat" ref={repeatRef}>
                    {
                        renderPassword(
                            params.form.validate.repeat,
                            onRepeatInput,
                            onRepeatVisible,
                            t('password.repeat'),
                            `${prefixKey}-${$tools.uid()}`
                        )
                    }
                </Form.Item>
            ) : null
        }

        return () => (
            <Form ref={formRef}
                layout="vertical"
                name={`${prefixCls}-form`}
                model={params.form.validate}
                rules={Object.assign({}, params.form.rules, props.rules)}>
                <Form.Item name="password" ref={passwordRef}>
                    <Popover trigger="focus" placement="top" content={renderPopover()} overlayClassName={langCls}>
                        {
                            renderPassword(
                                params.form.validate.password,
                                onInput,
                                onVisible
                            )
                        }
                    </Popover>
                </Form.Item>
                {renderRepeat()}
            </Form>
        )
    }
})