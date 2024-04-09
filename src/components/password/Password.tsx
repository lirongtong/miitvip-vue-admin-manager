import { defineComponent, ref, reactive, createVNode, computed } from 'vue'
import { PasswordProps } from './props'
import { useI18n } from 'vue-i18n'
import { getPrefixCls } from '../_utils/props'
import { $tools } from '../../utils/tools'
import { useWindowResize } from '../../hooks/useWindowResize'
import { Form, Input, Popover } from 'ant-design-vue'
import {
    EyeInvisibleOutlined,
    EyeOutlined,
    LockOutlined,
    UnlockOutlined,
    CheckOutlined,
    CloseOutlined
} from '@ant-design/icons-vue'
import applyTheme from '../_utils/theme'
import styled from './style/password.module.less'

const MiPassword = defineComponent({
    name: 'MiPassword',
    inheritAttrs: false,
    props: PasswordProps(),
    emits: [
        'change',
        'confirmChange',
        'update:value',
        'update:modelValue',
        'update:confirmValue',
        'input'
    ],
    setup(props, { emit, expose }) {
        const { t, locale } = useI18n()
        const passwordFormRef = ref(null)
        const levels = ref<object>(
            props.level ?? {
                1: t('password.lv1'),
                2: t('password.lv2'),
                3: t('password.lv3'),
                4: t('password.lv4')
            }
        )
        const defaultTip = ref<string>(props.complexityTip ?? t('password.tip'))
        const { width } = useWindowResize()
        const style = computed(() => {
            return {
                width: $tools.convert2rem($tools.distinguishSize(props.width, width.value)),
                height: $tools.convert2rem($tools.distinguishSize(props.height, width.value)),
                borderRadius: $tools.convert2rem($tools.distinguishSize(props.radius, width.value))
            }
        })

        const checkPassword = (_rule: any, value: string) => {
            const reset = () => {
                params.password = {
                    strength: 0,
                    tips: null,
                    length: false,
                    format: false,
                    complexity: false
                }
            }
            if (props.skipCheck) {
                if (props.isRequired) {
                    if ($tools.isEmpty(value)) {
                        reset()
                        return Promise.reject(t('password.setting'))
                    } else return Promise.resolve()
                }
                return Promise.resolve()
            }
            if ($tools.isEmpty(value)) {
                reset()
                return Promise.reject(t('password.setting'))
            } else {
                params.password.format = true
                if (value.length < props.min) {
                    params.password.length = false
                    params.password.strength = 0
                    params.password.tips = null
                    return Promise.reject(t('password.least', { min: props.min }))
                }
                if (props.complexity) {
                    if ($tools.checkPassword(value)) {
                        params.password.length = true
                        const strength = $tools.getPasswordStrength(value)
                        params.password.strength = strength
                        params.password.tips = levels.value[strength]
                        if (strength <= 1) {
                            params.password.complexity = false
                            return Promise.reject(defaultTip.value)
                        } else {
                            params.password.complexity = true
                            return Promise.resolve()
                        }
                    }
                } else {
                    params.password.length = true
                    const strength = $tools.getPasswordStrength(value)
                    params.password.strength = strength
                    params.password.tips = levels.value[strength]
                    params.password.complexity = true
                    return Promise.resolve()
                }
            }
        }

        const checkConfirm = (_rule: any, value: string) => {
            if (props.skipCheck) {
                if (props.isRequired) {
                    if ($tools.isEmpty(value)) {
                        return Promise.reject(t('password.confirm'))
                    } else return Promise.resolve()
                }
                return Promise.resolve()
            }
            if ($tools.isEmpty(value)) {
                return Promise.reject(t('password.confirm'))
            } else {
                if (params.form.validate.password !== value) {
                    return Promise.reject(t('password.different'))
                }
                return Promise.resolve()
            }
        }

        const params = reactive({
            visible: {
                normal: false,
                confirm: false
            },
            password: {
                strength: 0,
                tips: null,
                length: false,
                format: false,
                complexity: false
            },
            form: {
                name: getPrefixCls(`password-form-${$tools.uid()}`),
                validate: {
                    password: null,
                    confirm: null
                },
                rules: Object.assign(
                    {},
                    {
                        password: [{ required: true, validator: checkPassword }],
                        confirm: [{ required: props.confirm, validator: checkConfirm }]
                    },
                    props.rules
                )
            }
        })

        applyTheme(styled)

        const handleVisible = () => {
            params.visible.normal = !params.visible.normal
        }

        const handleInput = (evt: any) => {
            const value = evt?.target?.value
            params.form.validate.password = value
            emit('update:value', value)
            emit('update:modelValue', value)
            emit('change', value)
            emit('input', value)
            if (props.confirm && params.form.validate.confirm) {
                passwordFormRef.value.validateFields(['confirm'])
            }
        }

        const handleConfirmInput = (evt: any) => {
            const value = evt?.target?.value
            params.form.validate.confirm = value
            emit('update:confirmValue', value)
            emit('confirmChange', value)
        }

        const handleConfirmVisible = () => {
            params.visible.confirm = !params.visible.confirm
        }

        const renderPassword = (
            value: any,
            inputHandler: (...args: any) => any,
            visibleHandler: (...args: any) => any,
            visibleType = 'normal',
            placeholder?: string,
            key?: string
        ) => {
            placeholder = placeholder ?? t('password.placeholder')
            const iconEye = <EyeOutlined onClick={visibleHandler} />
            const iconEyeClose = <EyeInvisibleOutlined onClick={visibleHandler} />
            const prefix =
                visibleType === 'normal'
                    ? createVNode(params.visible.normal ? UnlockOutlined : LockOutlined)
                    : createVNode(params.visible.confirm ? UnlockOutlined : LockOutlined)
            const suffix =
                visibleType === 'normal'
                    ? params.visible.normal
                        ? iconEye
                        : iconEyeClose
                    : params.visible.confirm
                      ? iconEye
                      : iconEyeClose
            const type =
                visibleType === 'normal'
                    ? params.visible.normal
                        ? 'text'
                        : 'password'
                    : params.visible.confirm
                      ? 'text'
                      : 'password'
            return (
                <Input
                    maxLength={props.max}
                    class={styled.input}
                    prefix={prefix}
                    suffix={suffix}
                    value={value}
                    onInput={inputHandler}
                    placeholder={placeholder}
                    autocomplete="off"
                    id={key ?? getPrefixCls(`password-key-${$tools.uid()}`)}
                    style={style.value}
                    type={type}
                />
            )
        }

        const renderPopoverContent = () => {
            const items = []
            for (let i = 0; i < 4; i++) {
                items.push(
                    <i
                        class={`${styled.strength}${
                            params.password.strength > i ? ` ${styled.strengthActive}` : ''
                        }`}
                    />
                )
            }
            const getStatus = (status: boolean) => {
                return status ? <CheckOutlined class="success" /> : <CloseOutlined class="failed" />
            }
            return (
                <div class={styled.tips}>
                    <div class={styled.strengthItem}>
                        <span innerHTML={t('password.strong')} />
                        <div class={styled.strengthGroup}>{...items}</div>
                        <span class={styled.strengthTips} innerHTML={params.password.tips}></span>
                    </div>
                    <div class={styled.strengthItem}>
                        {getStatus(params.password.length)}
                        <span innerHTML={t('password.size', { min: props.min, max: props.max })} />
                    </div>
                    <div class={styled.strengthItem}>
                        {getStatus(params.password.format)}
                        <span innerHTML={t('password.format')} />
                    </div>
                    {props.complexity ? (
                        <div class={styled.strengthItem}>
                            {getStatus(params.password.complexity)}
                            <span innerHTML={defaultTip.value} />
                        </div>
                    ) : null}
                </div>
            )
        }

        const renderConfirm = () => {
            return props.confirm ? (
                <Form.Item name="confirm" class={styled.item}>
                    {renderPassword(
                        params.form.validate.confirm,
                        handleConfirmInput,
                        handleConfirmVisible,
                        'confirm',
                        t('password.confirm')
                    )}
                </Form.Item>
            ) : null
        }

        const validate = () => {
            return passwordFormRef.value.validate()
        }

        const validateFields = (fields: []) => {
            return passwordFormRef.value.validate(fields)
        }

        expose({ validate, validateFields })

        return () => (
            <Form
                ref={passwordFormRef}
                layout="vertical"
                name={params.form.name}
                model={params.form.validate}
                rules={params.form.rules}
                autocomplete="off">
                <Form.Item name="password" class={styled.item}>
                    {props.skipCheck ? (
                        renderPassword(params.form.validate.password, handleInput, handleVisible)
                    ) : (
                        <Popover
                            trigger="focus"
                            placement={props.placement}
                            content={renderPopoverContent()}
                            overlayStyle={{ zIndex: Date.now() }}
                            overlayClassName={`${styled.popover} ${getPrefixCls(
                                `password-${locale}`
                            )}`}>
                            {renderPassword(
                                params.form.validate.password,
                                handleInput,
                                handleVisible
                            )}
                        </Popover>
                    )}
                </Form.Item>
                {props.skipCheck ? null : renderConfirm()}
            </Form>
        )
    }
})

export default MiPassword
