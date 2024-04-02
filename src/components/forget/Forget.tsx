import { defineComponent, createVNode, reactive, ref, onMounted, Transition } from 'vue'
import { ForgetProps } from './props'
import { __PASSPORT_DEFAULT_BACKGROUND__, __LOGO__ } from '../../utils/images'
import {
    Row,
    Col,
    Form,
    Input,
    type FormInstance,
    ConfigProvider,
    Button,
    message
} from 'ant-design-vue'
import { getPrefixCls, getPropSlot } from '../_utils/props'
import { useWindowResize } from '../../hooks/useWindowResize'
import { $g } from '../../utils/global'
import { $tools } from '../../utils/tools'
import { $request } from '../../utils/request'
import { $storage } from '../../utils/storage'
import type { ResponseData } from '../../utils/types'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { UserOutlined, PropertySafetyOutlined } from '@ant-design/icons-vue'
import MiTheme from '../theme/Theme'
import MiLink from '../link/Link'
import MiCaptcha from '../captcha/Captcha'
import MiPassword from '../password/Password'
import MiPalette from '../palette/Palette'
import MiLayoutFooter from '../layout/Footer'
import applyTheme from '../_utils/theme'
import styled from './style/forget.module.less'

const MiForget = defineComponent({
    name: 'MiForget',
    inheritAttrs: false,
    props: ForgetProps(),
    emits: ['captchaInit', 'captchaChecked', 'captchaSuccess'],
    setup(props, { slots, emit }) {
        const { t } = useI18n()
        const { width } = useWindowResize()
        const router = useRouter()
        const formRef = ref<FormInstance>()
        const videoRef = ref<HTMLVideoElement>()
        const passwordFormRef = ref<FormInstance>()
        const updateFormRef = ref<FormInstance>()

        const validateUserName = (_rule: any, value: string) => {
            if (!$tools.isEmpty(value)) {
                if (params.tips.username) return Promise.reject(params.tips.username)
                return Promise.resolve()
            }
            return Promise.reject(t('forget.username'))
        }

        const validateCode = (_rule: any, value: string) => {
            if (params.sent) {
                if ($tools.isEmpty(value)) return Promise.reject(t('forget.code'))
                return Promise.resolve()
            }
            return Promise.resolve()
        }

        const validateCaptcha = () => {
            if (!params.captcha) return Promise.reject(t('login.verify'))
            else return Promise.resolve()
        }

        const params = reactive({
            loading: false,
            captcha: false,
            sent: $storage.get($g?.caches?.storages?.password?.reset?.time) || null,
            tips: {
                btn: t('global.step.next'),
                username: null,
                captcha: null
            },
            form: {
                validate: {
                    username: null,
                    captcha: false,
                    cuid: null,
                    code: null,
                    uuid: $storage.get($g?.caches?.storages?.password?.reset?.uid) || null
                },
                rules: {
                    username: [{ required: true, validator: validateUserName }],
                    code: [{ required: true, validator: validateCode }],
                    captcha: [{ required: true, validator: validateCaptcha }]
                }
            },
            anim: getPrefixCls('anim-slide'),
            update: {
                show: false,
                form: {
                    validate: { password: null, confirm: null },
                    rules: {}
                }
            },
            downtime: {
                remain: 0,
                handler: null
            }
        })
        applyTheme(styled)

        const handleDowntime = () => {
            if (params.sent) {
                const seconds = Math.floor(Date.now() / 1000)
                params.downtime.remain = props.resendDowntime - (seconds - parseInt(params.sent))
                if (params.downtime.remain > 0) {
                    if (params.downtime.handler) clearInterval(params.downtime.handler)
                    params.downtime.handler = setInterval(() => {
                        params.downtime.remain--
                        if (params.downtime.remain <= 0) clearInterval(params.downtime.handler)
                    }, 1000)
                } else params.downtime.remain = 0
            }
        }

        const handleNext = () => {
            if (params.loading) return
            params.loading = true
            if (formRef.value) {
                formRef.value
                    ?.validate()
                    .then(async () => {
                        if (params.sent) await handleVerifyCode()
                        else await handleSendCode()
                    })
                    .finally(() => (params.loading = false))
            }
        }

        const handleSendCode = async () => {
            if (params.downtime.remain > 0) return
            const handleSendCodeSuccess = (time?: number) => {
                params.sent = time || Math.floor(Date.now() / 1000)
                $storage.set($g?.caches?.storages?.password?.reset?.time, params.sent)
                $storage.set(
                    $g?.caches?.storages?.password?.reset?.username,
                    params.form.validate.username
                )
            }
            if (typeof props.sendCodeAction === 'string') {
                await $request[(props.sendCodeMethod || 'post').toLowerCase()](
                    props.sendCodeAction,
                    {
                        ...params.form.validate
                    }
                )
                    .then((res: ResponseData) => {
                        if (res?.ret?.code === 200) {
                            handleSendCodeSuccess(res?.data?.time)
                            if (res?.data?.email) {
                                message.success({
                                    content: t('forget.sent', { email: res.data.email }),
                                    duration: 6
                                })
                            }
                            handleDowntime()
                        } else message.error(res?.ret?.message)
                    })
                    .catch((err: any) => message.error(err?.message || t('global.error.unknown')))
            } else if (typeof props.sendCodeAction === 'function') {
                const response = await props.sendCodeAction(params.form.validate)
                if (typeof response === 'boolean' && response) {
                    handleSendCodeSuccess()
                    message.success(t('global.sent'))
                    handleDowntime()
                }
                if (typeof response === 'string') message.error(response)
            }
        }

        const handleResendCode = () => {
            if (params.loading || params.downtime.remain > 0) return
            params.loading = true
            if (formRef.value) {
                formRef.value
                    ?.validateFields(['username', 'captcha'])
                    .then(() => handleSendCode())
                    .finally(() => (params.loading = false))
            }
        }

        const handleVerifyUserName = async () => {
            if ($tools.isEmpty(params.form.validate.username)) return
            if (props.checkUsernameAction) {
                if (typeof props.checkUsernameAction === 'string') {
                    await $request[(props.checkUsernameMethod || 'post').toLowerCase()](
                        props.checkUsernameAction,
                        { username: params.form.validate.username }
                    )
                        .then((res: ResponseData) => {
                            if (res?.ret?.code !== 200) params.tips.username = res?.ret?.message
                            else params.tips.username = null
                        })
                        .catch(
                            (err: any) =>
                                (params.tips.username = err?.message || t('global.error.unknown'))
                        )
                    formRef.value?.validateFields(['username'])
                } else if (typeof props.checkUsernameAction === 'function') {
                    const response = await props.checkUsernameAction(params.form.validate.username)
                    if (typeof response === 'boolean' && response) params.tips.username = null
                    if (typeof response === 'string') params.tips.username = response
                    formRef.value?.validateFields(['username'])
                }
            } else params.tips.username = null
        }

        const handleVerifyCode = async () => {
            const data = {
                code: params.form.validate.code,
                uuid: params.form.validate.uuid
            }
            if (typeof props.checkCodeAction === 'string') {
                await $request[(props.checkCodeMethod || 'post').toLowerCase()](
                    props.checkCodeAction,
                    {
                        ...data
                    }
                )
                    .then((res: ResponseData) => {
                        if (res?.ret?.code === 200) {
                            if (res?.data?.token) {
                                $storage.set(
                                    $g?.caches?.storages?.password?.reset?.token,
                                    res.data.token
                                )
                            }
                            params.update.show = true
                        } else message.error(res?.ret?.message)
                    })
                    .catch((err: any) => message.error(err?.message || t('global.error.unknown')))
            } else if (typeof props.checkCodeAction === 'function') {
                const response = await props.checkCodeAction(data)
                if (typeof response === 'boolean' && response) params.update.show = true
                if (typeof response === 'string') message.error(response)
            }
        }

        const handleCaptchaSuccess = (data?: any) => {
            if (data?.cuid) params.form.validate.cuid = data.cuid
            params.form.validate.captcha = true
            params.captcha = true
            if (formRef.value) formRef.value.validateFields(['captcha'])
            emit('captchaSuccess', data)
        }

        const handleUpdatePassword = async () => {
            if (params.loading) return
            if (updateFormRef.value) {
                params.loading = true
                const passwordState = await passwordFormRef.value
                    .validate()
                    .then(() => {
                        return true
                    })
                    .catch(() => {
                        return false
                    })
                updateFormRef.value
                    ?.validate()
                    .then(async () => {
                        if (passwordState) {
                            const token =
                                $storage.get($g?.caches?.storages?.password?.reset?.token) || null
                            if (token) {
                                const data = {
                                    token,
                                    username:
                                        $storage.get(
                                            $g?.caches?.storages?.password?.reset?.username
                                        ) || null,
                                    ...params.update.form.validate,
                                    ...props.resetPasswordParams
                                }
                                const handleUpdatePasswordSuccess = () => {
                                    message.success({
                                        content: t('foget.success'),
                                        duration: 3
                                    })
                                }
                                if (typeof props.resetPasswordAction === 'string') {
                                    await $request[
                                        (props.resetPasswordMethod || 'put').toLowerCase()
                                    ](props.resetPasswordAction, { ...data })
                                        .then((res: ResponseData) => {
                                            if (res?.ret?.code === 200) {
                                                handleUpdatePasswordSuccess()
                                                $storage.del(
                                                    Object.values({
                                                        ...$g?.caches?.storages?.password?.reset
                                                    })
                                                )
                                                setTimeout(() => {
                                                    if ($tools.isUrl(props.redirectTo)) {
                                                        window.location.href = props.redirectTo
                                                    } else router.push({ path: props.redirectTo })
                                                }, 3000)
                                            } else message.error(res?.ret?.message)
                                        })
                                        .catch((err: any) =>
                                            message.error(err?.message || t('global.error.unknown'))
                                        )
                                } else if (typeof props.resetPasswordAction === 'function') {
                                    const response = await props.resetPasswordAction(data)
                                    if (typeof response === 'boolean' && response)
                                        handleUpdatePasswordSuccess()
                                    if (typeof response === 'string') message.error(response)
                                }
                            } else message.error(t('forget.illegal'))
                        }
                    })
                    .finally(() => (params.loading = false))
            }
        }

        const renderVideo = () => {
            return props.video ? (
                <div ref={videoRef} class={styled.video}>
                    <div class={styled.videoInner}>
                        <video
                            src={props.video}
                            muted={true}
                            playsinline={true}
                            preload="auto"
                            autoplay={true}
                            loop={true}
                        />
                    </div>
                </div>
            ) : null
        }

        const renderMask = () => {
            return width.value < $g.breakpoints.md ? null : <div class={styled.mask} />
        }

        const renderTitle = () => {
            return (
                <div class={styled.title}>
                    <span innerHTML={props.title || $g.site} />
                    <sup>
                        <MiLink path="/">
                            <img src={$g.logo || __LOGO__} class={styled.logo} alt={$g.powered} />
                        </MiLink>
                    </sup>
                </div>
            )
        }

        const renderPalette = () => {
            return (
                <div class={styled.palette}>
                    <MiPalette />
                </div>
            )
        }

        const renderUserName = () => {
            return (
                <Form.Item name="username" class={styled.item}>
                    <Input
                        prefix={createVNode(UserOutlined)}
                        v-model:value={params.form.validate.username}
                        maxlength={64}
                        autcomplete="off"
                        onPressEnter={handleNext}
                        onBlur={handleVerifyUserName}
                        class={styled.input}
                        placeholder={t('forget.username')}
                    />
                </Form.Item>
            )
        }

        const renderCaptcha = () => {
            return props.captcha ? (
                <Form.Item name="captcha" class={[styled.captcha, styled.item]}>
                    <MiCaptcha
                        {...Object.assign(
                            {},
                            { width: '100%', boxShadow: false },
                            props.captchaSetting
                        )}
                        onInit={(res: any) => emit('captchaInit', res)}
                        onChecked={(res: any) => emit('captchaChecked', res)}
                        onSuccess={(res: any) => handleCaptchaSuccess(res)}
                    />
                </Form.Item>
            ) : null
        }

        const renderCodeSuffix = () => {
            const tip =
                params.downtime.remain <= 0 ? (
                    <span innerHTML={t('forget.resend.normal')} />
                ) : (
                    <span
                        innerHTML={t('forget.resend.downtime', { sec: params.downtime.remain })}
                    />
                )
            return (
                <div
                    class={`${styled.suffix}${
                        params.downtime.remain <= 0 ? ` ${styled.resend}` : ''
                    }`}
                    onClick={handleResendCode}>
                    {tip}
                </div>
            )
        }

        const renderCode = () => {
            return (
                <Transition name={params.anim} appear={true}>
                    {params.sent ? (
                        <Form.Item name="code" class={styled.item}>
                            <Input
                                type="number"
                                class={styled.input}
                                prefix={createVNode(PropertySafetyOutlined)}
                                suffix={renderCodeSuffix()}
                                v-model:value={params.form.validate.code}
                                maxlength={6}
                                autocomplete="off"
                                placeholder={t('forget.code')}
                                onPressEnter={handleNext}
                            />
                        </Form.Item>
                    ) : null}
                </Transition>
            )
        }

        const renderButton = () => {
            return (
                <div class={styled.btns}>
                    <Button
                        type="primary"
                        onClick={handleNext}
                        loading={params.loading}
                        class={[styled.btn, styled.btnPrimary]}>
                        {params.tips.btn}
                    </Button>
                </div>
            )
        }

        const renderUpdateButton = () => {
            return (
                <div class={styled.btns}>
                    <Button
                        type="primary"
                        onClick={handleUpdatePassword}
                        loading={params.loading}
                        class={[styled.btn, styled.btnPrimary]}>
                        {t('forget.update')}
                    </Button>
                </div>
            )
        }

        const renderLinks = () => {
            return (
                <div class={styled.links}>
                    <MiLink path={props.loginLink}>{t('forget.login')}</MiLink>
                    <MiLink path={props.registerLink}>{t('forget.register')}</MiLink>
                </div>
            )
        }

        const renderForm = () => {
            return (
                <div class={styled.form}>
                    {params.update.show ? (
                        <Form
                            ref={updateFormRef}
                            layout="vertical"
                            class={styled.formForget}
                            model={params.update.form.validate}
                            rules={params.update.form.rules}
                            autcomplete="off">
                            <MiPassword
                                ref={passwordFormRef}
                                value={params.update.form.validate.password}
                                confirm={true}
                                onPressEnter={handleUpdatePassword}
                            />
                            {renderUpdateButton()}
                        </Form>
                    ) : (
                        <Form
                            ref={formRef}
                            layout="vertical"
                            class={styled.formForget}
                            model={params.form.validate}
                            rules={params.form.rules}
                            autcomplete="off">
                            {renderUserName()}
                            {renderCode()}
                            {renderCaptcha()}
                            {renderButton()}
                            {renderLinks()}
                        </Form>
                    )}
                </div>
            )
        }

        onMounted(() => handleDowntime())

        return () => (
            <MiTheme>
                <ConfigProvider theme={{ ...$tools.getAntdvThemeProperties() }}>
                    <div
                        class={styled.container}
                        style={
                            !props.video
                                ? {
                                      backgroundImage: `url(${
                                          props.background ?? __PASSPORT_DEFAULT_BACKGROUND__
                                      })`
                                  }
                                : null
                        }>
                        {renderVideo()}
                        <Row class={styled.content}>
                            <Col class={styled.inner} xs={24} sm={18} md={12} lg={12}>
                                {renderMask()}
                                {renderTitle()}
                                {renderPalette()}
                                {getPropSlot(slots, props, 'content') ?? renderForm()}
                            </Col>
                        </Row>
                        {getPropSlot(slots, props, 'footer') ?? <MiLayoutFooter />}
                    </div>
                </ConfigProvider>
            </MiTheme>
        )
    }
})

export default MiForget
