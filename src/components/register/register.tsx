import { defineComponent, ref, createVNode, reactive, SlotsType } from 'vue'
import { useStore } from 'vuex'
import { RouterLink, useRouter } from 'vue-router'
import { Form, Row, Col, Button, Popover, Input, message, FormInstance } from 'ant-design-vue'
import { MailOutlined, UserOutlined } from '@ant-design/icons-vue'
import { passportProps } from '../_utils/props-passport'
import { getPrefixCls, tuple, getPropSlot } from '../_utils/props-tools'
import { $tools } from '../../utils/tools'
import { $g } from '../../utils/global'
import { api } from '../../utils/api'
import { useI18n } from 'vue-i18n'
import { $request } from '../../utils/request'
import { $storage } from '../../utils/storage'
import { useWindowResize } from '../../hooks/useWindowResize'
import PropTypes from '../_utils/props-types'
import MiLayout from '../layout'
import MiPassword from '../password'
import MiCaptcha from '../captcha'
import MiPassportSocialite from '../login/socialite'

export default defineComponent({
    name: 'MiRegister',
    inheritAttrs: false,
    props: Object.assign(
        { ...passportProps() },
        {
            action: PropTypes.oneOfType([PropTypes.string, PropTypes.func]).isRequired,
            redirectTo: PropTypes.string,
            binding: PropTypes.bool.def(false),
            passwordMinLength: PropTypes.number.def(6),
            passwordMaxLength: PropTypes.number.def(32),
            passwordComplexity: PropTypes.bool.def(true),
            passwordComplexityTip: PropTypes.string,
            passwordLevel: PropTypes.object,
            passwordRepeat: PropTypes.bool.def(true),
            usernameVerifyAction: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
            usernameVerifyMethod: PropTypes.oneOf(tuple(...$g.methods)).def('post'),
            emailVerifyAction: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
            emailVerifyMethod: PropTypes.oneOf(tuple(...$g.methods)).def('post'),
            loginLink: PropTypes.string,
            usernameTip: PropTypes.any,
            onAfterRegister: PropTypes.func,
            socialiteLoginDomain: PropTypes.string
        }
    ),
    emits: ['captchaSuccess'],
    slots: Object as SlotsType<{
        content: any
        usernameTip: any
        footer: any
    }>,
    setup(props, { slots, emit }) {
        const { t } = useI18n()
        const store = useStore()
        const router = useRouter()
        const prefixCls = getPrefixCls('passport', props.prefixCls)
        const formRef = ref<FormInstance>()
        const passwordFormRef = ref(null) as any
        const { width } = useWindowResize()

        const checkUsername = async (_rule: any, value: string) => {
            if ($tools.isEmpty(value)) {
                return Promise.reject(t('passport.register.account'))
            } else {
                if (!$g.regExp.username.test(value)) {
                    return Promise.reject(t('passport.register.format'))
                } else {
                    if (params.tips.username) return Promise.reject(params.tips.username)
                    else return Promise.resolve()
                }
            }
        }

        const checkEmail = async (_rule: any, value: string) => {
            if ($tools.isEmpty(value)) {
                return Promise.reject(t('passport.email'))
            } else {
                if (!$tools.checkEmail(value)) {
                    return Promise.reject(t('passport.register.email-valid'))
                } else {
                    if (params.tips.email) return Promise.reject(params.tips.email)
                    else return Promise.resolve()
                }
            }
        }

        const checkCaptcha = () => {
            if (!params.captcha) return Promise.reject(t('passport.verify'))
            else return Promise.resolve()
        }

        const params = reactive({
            loading: false,
            captcha: null,
            form: {
                validate: {
                    url: null,
                    username: '',
                    email: '',
                    password: '',
                    repeat: '',
                    captcha: false,
                    cuid: null
                },
                rules: {
                    username: [
                        {
                            required: true,
                            validator: checkUsername
                        }
                    ],
                    email: [
                        {
                            required: true,
                            validator: checkEmail
                        }
                    ],
                    captcha: [{ required: true, validator: checkCaptcha }]
                }
            },
            tips: {
                username: null,
                email: null
            }
        }) as { [index: string]: any }

        const checkName = async () => {
            if ($tools.isEmpty(params.form.validate.username)) return
            if (props.usernameVerifyAction) {
                await $request[props.usernameVerifyMethod](props.usernameVerifyAction, {
                    data: params.form.validate.username
                })
                    .then((res: any) => {
                        if (res?.ret?.code === 200) params.tips.username = null
                        else params.tips.username = res?.ret?.message
                    })
                    .catch((err: any) => (params.tips.username = err?.message))
                if (formRef.value) formRef.value.validateFields(['username'])
            } else params.tips.username = null
        }

        const checkMail = async () => {
            if ($tools.isEmpty(params.form.validate.email)) return
            if (props.emailVerifyAction) {
                await $request[props.emailVerifyMethod](props.emailVerifyAction, {
                    data: params.form.validate.email
                })
                    .then((res: any) => {
                        if (res?.ret?.code === 200) params.tips.email = null
                        else params.tips.email = res?.ret?.message
                    })
                    .catch((err: any) => (params.tips.email = err?.message))
                if (formRef.value) formRef.value.validateFields(['email'])
            } else params.tips.email = null
        }

        const captchaVerify = (data: any) => {
            if (data?.cuid) params.form.validate.cuid = data.cuid
            params.captcha = true
            if (formRef.value) formRef.value.validateFields(['captcha'])
            emit('captchaSuccess', data)
        }

        const register = async () => {
            if (params.loading) return
            params.loading = true
            const passwordState = await passwordFormRef.value
                ?.validate()
                .then(() => {
                    return true
                })
                .catch(() => {
                    return false
                })
            if (formRef.value) {
                formRef.value
                    .validate()
                    .then(() => {
                        if (
                            passwordState &&
                            (!params.form.validate.captcha ||
                                (params.form.validate.captcha && params.captcha))
                        ) {
                            api.register = props.action
                            params.form.validate.url = api.register
                            if (typeof props.action === 'string') {
                                store
                                    .dispatch('passport/register', params.form.validate)
                                    .then((res: any) => {
                                        params.loading = false
                                        if (
                                            props.onAfterRegister &&
                                            typeof props.onAfterRegister === 'function'
                                        ) {
                                            // custom
                                            props.onAfterRegister(res)
                                        } else {
                                            if (res.ret.code === 200) {
                                                $storage.set(
                                                    $g.caches.storages.email,
                                                    params.form.validate.email
                                                )
                                                if (props.redirectTo) {
                                                    if ($g.regExp.url.test(props.redirectTo)) {
                                                        window.location.href = props.redirectTo
                                                    } else router.push({ path: '/' })
                                                }
                                                router.push({ path: '/' })
                                            } else message.error(res.ret.message)
                                        }
                                    })
                                    .catch((err: any) => {
                                        params.loading = false
                                        message.error(err.message)
                                    })
                            } else if (typeof props.action === 'function') {
                                params.loading = false
                                props.action(params.form.validate)
                            }
                        } else params.loading = false
                    })
                    .catch(() => (params.loading = false))
            }
        }

        const renderMask = () => {
            return width.value < $g.devices.mobile ? null : <div class={`${prefixCls}-mask`} />
        }

        const renderTitle = () => {
            return (
                <div class={`${prefixCls}-title`}>
                    <span innerHTML={props.title ?? $g.site} />
                    <sup>
                        <RouterLink to={{ path: '/' }}>
                            <img src={$g.avatar} class={`${prefixCls}-logo`} alt={$g.powered} />
                        </RouterLink>
                    </sup>
                </div>
            )
        }

        const renderUserName = () => {
            const content = renderUserNameTip()
            const defaultInput = (
                <Input
                    prefix={createVNode(UserOutlined)}
                    v-model:value={params.form.validate.username}
                    maxlength={32}
                    onBlur={checkName}
                    autocomplete="off"
                    placeholder={t('passport.username')}
                />
            )
            let template = defaultInput
            if (content) {
                template = (
                    <Popover placement="top" trigger={['focus']} content={content}>
                        {defaultInput}
                    </Popover>
                )
            }
            return <Form.Item name="username">{template}</Form.Item>
        }

        const renderUserNameTip = () => {
            const cls = `${prefixCls}-register-tips`
            return (
                getPropSlot(slots, props, 'usernameTip') ?? (
                    <div class={`${cls}${width.value < $g.devices.mobile ? ` ${cls}-mobile` : ''}`}>
                        <p innerHTML={t('passport.register.tips.special')} />
                        <p innerHTML={t('passport.register.tips.structure')} />
                        <p innerHTML={t('passport.register.tips.start')} />
                        <p innerHTML={t('passport.register.tips.length')} />
                    </div>
                )
            )
        }

        const renderEmail = () => {
            return (
                <Form.Item name="email">
                    <Input
                        type="email"
                        prefix={createVNode(MailOutlined)}
                        v-model:value={params.form.validate.email}
                        onBlur={checkMail}
                        maxlength={256}
                        autocomplete="off"
                        placeholder={t('passport.email')}
                    />
                </Form.Item>
            )
        }

        const renderPassword = () => {
            return (
                <MiPassword
                    repeat={props.passwordRepeat}
                    ref={passwordFormRef}
                    v-model:value={params.form.validate.password}
                    v-model:repeatValue={params.form.validate.repeat}
                    minLength={props.passwordMinLength}
                    maxLength={props.passwordMaxLength}
                    complexity={props.passwordComplexity}
                    complexityTip={props.passwordComplexityTip}
                    level={props.passwordLevel}
                />
            )
        }

        const renderCaptcha = () => {
            return props.openCaptcha ? (
                <Form.Item name="captcha">
                    <MiCaptcha
                        width="100%"
                        radius={props.captchaRadius}
                        image={props.captchaImage}
                        bgColor={props.captchaBackground}
                        textColor={props.captchaTextColor}
                        maxTries={props.captchaMaxTries}
                        themeColor={props.captchaThemeColor}
                        initParams={props.captchaInitParams}
                        initAction={props.captchaInitAction}
                        checkParams={props.captchaCheckParams}
                        checkAction={props.captchaCheckAction}
                        verifyParams={props.captchaVerifyParams}
                        verifyAction={props.captchaVerifyAction}
                        onInit={props.onCaptchaInit}
                        onChecked={props.onCaptchaChecked}
                        onSuccess={captchaVerify}
                    />
                </Form.Item>
            ) : null
        }

        const renderButton = () => {
            const cls = `${prefixCls}-submit`
            const login =
                width.value < $g.devices.mobile ? (
                    <Button size="large" class={`${cls} ${cls}-register`}>
                        <RouterLink to={{ path: 'login' }}>
                            {t('passport.has-account')}
                            {t('passport.register.sign')}
                        </RouterLink>
                    </Button>
                ) : null
            return (
                <>
                    <Button class={cls} type="primary" onClick={register} loading={params.loading}>
                        {props.binding ? t('passport.binding') : t('passport.register.title')}
                    </Button>
                    {login}
                </>
            )
        }

        const renderSocialiteRegister = () => {
            const link = !props.loginLink ? (
                <RouterLink to={{ path: 'login' }}>{t('passport.login.title')}</RouterLink>
            ) : (
                <a href={props.loginLink} innerHTML={t('passport.login.title')} />
            )
            const cls = `${prefixCls}-socialite`
            return (
                <Form.Item class={`${cls}`}>
                    {width.value >= $g.devices.mobile ? (
                        <div class={`${cls}-link`}>
                            {t('passport.has-account')}
                            {link}
                        </div>
                    ) : null}
                    <MiPassportSocialite />
                </Form.Item>
            )
        }

        const renderForm = () => {
            const cls = getPrefixCls('form')
            return (
                <div class={`${prefixCls}-form`}>
                    <Form
                        layout="vertical"
                        class={cls}
                        ref={formRef}
                        model={params.form.validate}
                        rules={Object.assign({}, params.form.rules, props.rules)}>
                        {renderUserName()}
                        {renderEmail()}
                        {renderPassword()}
                        {renderCaptcha()}
                        {renderButton()}
                        {renderSocialiteRegister()}
                    </Form>
                </div>
            )
        }

        return () => (
            <div
                class={`${prefixCls}${
                    width.value < $g.devices.mobile ? ` ${prefixCls}-mobile` : ''
                }`}
                style={{
                    backgroundImage: `url(${props.background ?? $g.background.default})`
                }}>
                <Row
                    class={`${prefixCls}-content`}
                    align={width.value < $g.devices.mobile ? 'top' : 'middle'}>
                    <Col class={`${prefixCls}-box`} xs={24} sm={18} md={12} lg={12}>
                        {renderMask()}
                        {renderTitle()}
                        {getPropSlot(slots, props, 'content') ?? renderForm()}
                    </Col>
                </Row>
                {getPropSlot(slots, props, 'footer') ?? <MiLayout.Footer />}
            </div>
        )
    }
})
