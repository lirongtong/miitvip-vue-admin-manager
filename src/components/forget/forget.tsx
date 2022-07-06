import { defineComponent, ref, createVNode, reactive, Transition } from 'vue'
import { useI18n } from 'vue-i18n'
import { RouterLink, useRouter } from 'vue-router'
import { Form, Row, Col, Input, Button, message } from 'ant-design-vue'
import { UserOutlined, PropertySafetyOutlined } from '@ant-design/icons-vue'
import { passportProps } from '../_utils/props-passport'
import { getPrefixCls, getPropSlot, tuple } from '../_utils/props-tools'
import { $g } from '../../utils/global'
import { $tools } from '../../utils/tools'
import { $request } from '../../utils/request'
import { $storage } from '../../utils/storage'
import MiLayout from '../layout'
import MiCaptcha from '../captcha'
import MiPassword from '../password'
import PropTypes from '../_utils/props-types'

export default defineComponent({
    name: 'MiForget',
    inheritAttrs: false,
    props: Object.assign(
        { ...passportProps() },
        {
            sendCodeAction: PropTypes.oneOfType([PropTypes.string, PropTypes.func]).isRequired,
            sendCodeMethod: PropTypes.oneOf(tuple(...$g.methods)).def('post'),
            checkInputAction: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
            checkInputMethod: PropTypes.oneOf(tuple(...$g.methods)).def('post'),
            checkCodeAction: PropTypes.oneOfType([PropTypes.string, PropTypes.func]).isRequired,
            checkCodeMethod: PropTypes.oneOf(tuple(...$g.methods)).def('post'),
            resetPasswordAction: PropTypes.oneOfType([PropTypes.string, PropTypes.func]).isRequired,
            resetPasswordMethod: PropTypes.oneOf(tuple(...$g.methods)).def('put')
        }
    ),
    emits: ['captchaSuccess'],
    slots: ['content', 'footer'],
    setup(props, { slots, emit }) {
        const { t } = useI18n()
        const router = useRouter()
        const prefixCls = getPrefixCls('passport', props.prefixCls)
        const formRef = ref(null)
        const updateForm = ref(null)
        const anim = getPrefixCls('anim-slide')

        const validateInput = async (_rule: any, value: string) => {
            if (!$tools.isEmpty(value)) {
                if (params.inputTip) return Promise.reject(params.inputTip)
                return Promise.resolve()
            }
            return Promise.reject(t('passport.username'))
        }

        const validateCode = (_rule: any, value: string) => {
            if (params.sent) {
                if ($tools.isEmpty(value)) return Promise.reject(t('passport.code'))
                else Promise.resolve()
            } else return Promise.resolve()
        }

        const validateCaptcha = () => {
            if (!params.captcha) return Promise.reject(t('passport.verify'))
            else return Promise.resolve()
        }

        const params = reactive({
            captcha: false,
            sent: $storage.get($g.caches.storages.password.time) ?? null,
            downtime: 0,
            downtimeMax: 120,
            downtimeHandler: null,
            showUpdateForm: false,
            loading: false,
            tip: t('step.next'),
            inputTip: null,
            captchaTip: null,
            form: {
                validate: {
                    username: null,
                    captcha: true,
                    cuid: null,
                    code: null,
                    uuid: null
                },
                rules: {
                    username: [{ required: true, validator: validateInput }],
                    code: [{ required: true, validator: validateCode }],
                    captcha: [{ required: true, validator: validateCaptcha }]
                }
            },
            passwordManualVerify: false,
            passwordManualVerifyState: false,
            updateForm: {
                validate: {
                    password: null,
                    repeat: null
                }
            }
        })

        const captchaVerify = (data: any) => {
            if (data?.cuid) params.form.validate.cuid = data.cuid
            params.captcha = true
            formRef.value.validateFields(['captcha'])
            emit('captchaSuccess', data)
        }

        const checkUser = async () => {
            if ($tools.isEmpty(params.form.validate.username)) return
            if (props.checkInputAction) {
                await $request[props.checkInputMethod.toLowerCase()](props.checkInputAction, {
                    data: params.form.validate.username
                })
                    .then((res: any) => {
                        if (res?.ret?.code !== 200) params.inputTip = res?.ret?.message
                        else params.inputTip = null
                    })
                    .catch((err: any) => (params.inputTip = err.message))
                formRef.value.validateFields(['username'])
            } else params.inputTip = null
        }

        const startDownTime = () => {
            if (params.sent) {
                const seconds = Math.floor(Date.now() / 1000)
                params.downtime = params.downtimeMax - (seconds - (params.sent ?? 0))
                if (params.downtime > 0) {
                    if (params.downtimeHandler) clearInterval(params.downtimeHandler)
                    params.downtimeHandler = setInterval(() => {
                        params.downtime--
                        if (params.downtime <= 0) clearInterval(params.downtimeHandler)
                    }, 1000)
                }
            }
        }
        startDownTime()

        const nextStep = () => {
            if (params.loading) return
            params.loading = true
            formRef.value
                .validate()
                .then(() => {
                    if (params.sent) {
                        // check code
                        $request[props.checkCodeMethod.toLowerCase()](
                            props.checkCodeAction,
                            {
                                code: params.form.validate.code,
                                uuid: params.form.validate.uuid
                            }
                        ).then((res: any) => {
                            params.loading = false
                            if (res?.ret?.code === 200) {
                                if (res?.data?.token) {
                                    $storage.set($g.caches.storages.password.token, res.data.token)
                                }
                                params.showUpdateForm = true
                            }
                            else message.error(res?.ret?.message)
                        }).catch((err: any) => {
                            params.loading = false
                            message.error(err?.data?.message)
                        })
                    } else sendVerificationCode()
                })
                .catch(() => (params.loading = false))
        }

        const sendVerificationCode = () => {
            if (typeof props.sendCodeAction === 'string') {
                $request[props.sendCodeMethod.toLowerCase()](
                    props.sendCodeAction,
                    params.form.validate
                )
                    .then((res: any) => {
                        params.loading = false
                        if (res?.ret?.code === 200) {
                            params.sent = res?.data?.time
                            $storage.set($g.caches.storages.password.time, params.sent)
                            params.form.validate.uuid = res?.data?.uuid
                            startDownTime()
                        } else message.error(res?.ret?.message)
                    })
                    .catch((err: any) => {
                        params.loading = false
                        message.error(err?.data?.message)
                    })
            } else if (typeof props.sendCodeAction === 'function') {
                props.sendCodeAction(params.form.validate)
            }
        }

        const resendVerificationCode = () => {
            if (params.loading) return
            params.loading = true
            formRef.value.validateFields(['username', 'captcha']).then(() => {
                sendVerificationCode()
            }).catch(() => params.loading = false)
        }

        const setPasswordManualVerifyState = (state: boolean) => {
            console.log(state)
            params.passwordManualVerifyState = state
        }

        const updatePassword = () => {
            if (params.loading) return
            params.loading = true
            params.passwordManualVerify = !params.passwordManualVerify
            if (params.passwordManualVerifyState) {
                const token = $storage.get($g.caches.storages.password.time) ?? null
                if (token) {
                    if (typeof props.resetPasswordAction === 'string') {
                        $request[props.resetPasswordMethod.toLowerCase()](
                            props.resetPasswordAction,
                            params.updateForm.validate
                        )
                            .then((res: any) => {
                                params.loading = false
                                if (res?.ret?.code === 200) {
                                    message.success({
                                        content: t('passport.success'),
                                        duration: 3
                                    })
                                    setTimeout(() => router.push({path: '/login'}), 3000)
                                } else message.error(res?.ret?.message)
                            })
                            .catch((err: any) => {
                                params.loading = false
                                message.error(err?.data?.message)
                            })
                    } else if (typeof props.sendCodeAction === 'function') {
                        props.resetPasswordAction(params.updateForm.validate)
                    }
                } else {
                    params.loading = false
                    message.error(t('passport.illegal'))
                }
            } else params.loading = false
        }

        const renderMask = () => {
            return $g.isMobile ? null : <div class={`${prefixCls}-mask`} />
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
            return (
                <Form.Item name="username">
                    <Input
                        prefix={createVNode(UserOutlined)}
                        v-model:value={params.form.validate.username}
                        maxlength={64}
                        onBlur={checkUser}
                        autocomplete="off"
                        placeholder={t('passport.username')}
                    />
                </Form.Item>
            )
        }

        const renderVerificationCodeSuffix = () => {
            const tip = params.downtime <= 0 ? (
                <span innerHTML={t('passport.resend')}></span>
            ) : (
                <span innerHTML={t('passport.resend-downtime', {sec: params.downtime})}></span>
            )
            return (
                <div class={`${prefixCls}-forget-suffix${params.downtime <= 0 ? ` ${prefixCls}-forget-resend` : ''}`}
                    onClick={resendVerificationCode}>
                    {tip}
                </div>
            )
        }

        const renderVerificationCode = () => {
            return params.sent ? (
                <Transition name={anim} appear={true}>
                    <Form.Item name="code" class="mi-anim" v-show={params.sent}>
                        <Input
                            type="number"
                            prefix={createVNode(PropertySafetyOutlined)}
                            suffix={renderVerificationCodeSuffix()}
                            v-model:value={params.form.validate.code}
                            maxlength={6}
                            autocomplete="off"
                            placeholder={t('passport.code')}
                        />
                    </Form.Item>
                </Transition>
            ) : null
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
            return (
                <>
                    <Button class={cls} onClick={nextStep}>
                        {params.tip}
                    </Button>
                </>
            )
        }

        const renderUpdateButton = () => {
            const cls = `${prefixCls}-submit`
            return (
                <>
                    <Button class={cls} onClick={updatePassword}>
                        {t('passport.update')}
                    </Button>
                </>
            )
        }

        const renderForm = () => {
            const cls = getPrefixCls('form')
            const form = params.showUpdateForm ? (
                <Form
                    layout="vertical"
                    class={`${cls} mi-anim`}
                    ref={formRef}
                    model={params.form.validate}
                    rules={Object.assign({}, params.form.rules, props.rules)}>
                    <MiPassword repeat={true}
                        ref={updateForm}
                        manualVerify={params.passwordManualVerify}
                        onAfterVerify={setPasswordManualVerifyState}
                        v-model:value={params.updateForm.validate.password}
                        v-model:repeatValue={params.updateForm.validate.repeat} />
                    {renderUpdateButton()}
                </Form>
            ) : (
                <Form
                    layout="vertical"
                    class={`${cls} mi-anim`}
                    ref={formRef}
                    model={params.form.validate}
                    rules={Object.assign({}, params.form.rules, props.rules)}>
                    {renderUserName()}
                    {renderVerificationCode()}
                    {renderCaptcha()}
                    {renderButton()}
                </Form>
            )
            return (
                <div class={`${prefixCls}-form`}>
                    <Transition name={anim} appear={true}>
                        {form}
                    </Transition>
                </div>
            )
        }

        return () => (
            <div
                class={`${prefixCls} ${prefixCls}-forget${$g.isMobile ? ` ${prefixCls}-mobile` : ''}`}
                style={{
                    backgroundImage: `url(${props.background ?? $g.background.default})`
                }}>
                <Row class={`${prefixCls}-content`} align={$g.isMobile ? 'top' : 'middle'}>
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
