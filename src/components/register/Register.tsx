import { defineComponent, ref, reactive, createVNode, computed, type SlotsType } from 'vue'
import { RegisterProps } from './props'
import {
    ConfigProvider,
    Row,
    Col,
    type FormInstance,
    Form,
    Input,
    Popover,
    Button,
    message
} from 'ant-design-vue'
import { UserOutlined, MailOutlined } from '@ant-design/icons-vue'
import { $tools } from '../../utils/tools'
import { $request } from '../../utils/request'
import { $g } from '../../utils/global'
import { api } from '../../utils/api'
import { $storage } from '../../utils/storage'
import { useWindowResize } from '../../hooks/useWindowResize'
import { getPropSlot } from '../_utils/props'
import { __LOGO__, __PASSPORT_DEFAULT_BACKGROUND__ } from '../../utils/images'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import type { ResponseData } from '../../utils/types'
import { useAuthStore } from '../../stores/auth'
import MiTheme from '../theme/Theme'
import MiLink from '../link/Link'
import MiLayoutFooter from '../layout/Footer'
import MiPalette from '../palette/Palette'
import MiPassword from '../password/Password'
import MiCaptcha from '../captcha/Captcha'
import MiSocialite from '../socialite/Socialite'
import applyTheme from '../_utils/theme'
import styled from './style/register.module.less'

const MiRegister = defineComponent({
    name: 'MiRegister',
    inheritAttrs: false,
    props: RegisterProps(),
    emits: ['captchaInit', 'captchaChecked', 'captchaSuccess', 'afterRegister'],
    slots: Object as SlotsType<{
        content: any
        footer: any
        usernameTip: any
    }>,
    setup(props, { slots, emit }) {
        const { t } = useI18n()
        const { width } = useWindowResize()
        const auth = useAuthStore()
        const router = useRouter()
        const videoRef = ref<HTMLVideoElement>()
        const formRef = ref<FormInstance>()
        const passwordFormRef = ref<FormInstance>()

        const validateUsername = async (_rule: any, value: string) => {
            if ($tools.isEmpty(value)) {
                return Promise.reject(t('register.account'))
            } else {
                if (!$g.regExp.username.test(value)) {
                    return Promise.reject(t('register.format'))
                } else {
                    if (params.tips.username) return Promise.reject(params.tips.username)
                    else return Promise.resolve()
                }
            }
        }

        const validateEmail = async (_rule: any, value: string) => {
            if ($tools.isEmpty(value)) {
                return Promise.reject(t('register.email.text'))
            } else {
                if (!$tools.isEmail(value)) {
                    return Promise.reject(t('register.email.invalid'))
                } else {
                    if (params.tips.email) return Promise.reject(params.tips.email)
                    else return Promise.resolve()
                }
            }
        }

        const validateCaptcha = () => {
            if (!params.captcha) return Promise.reject(t('register.verify'))
            else return Promise.resolve()
        }

        const params = reactive({
            loading: false,
            captcha: null,
            form: {
                validate: {
                    url: api.register,
                    username: '',
                    email: '',
                    password: '',
                    confirm: '',
                    captcha: false,
                    cuid: null
                },
                rules: Object.assign(
                    {},
                    {
                        username: [{ required: true, validator: validateUsername }],
                        email: [{ required: true, validator: validateEmail }],
                        captcha: [{ required: true, validator: validateCaptcha }]
                    },
                    props.rules
                )
            },
            tips: {
                username: null,
                email: null
            }
        })
        const socialiteSetting = computed(() => {
            return Object.assign(
                {
                    tip: t('register.socialite'),
                    showMore: width.value >= $g.breakpoints.md
                },
                props.socialiteSetting
            )
        })
        applyTheme(styled)

        const handleRegister = async () => {
            if (params.loading) return
            if (formRef.value) {
                params.loading = true
                const passwordState = await passwordFormRef.value
                    .validate()
                    .then(() => {
                        return true
                    })
                    .catch(() => {
                        return false
                    })
                formRef.value
                    ?.validate()
                    .then(async () => {
                        if (
                            passwordState &&
                            (!params.form.validate.captcha ||
                                (params.form.validate.captcha && params.captcha))
                        ) {
                            const handleRegiserSuccess = () => {
                                $storage.set($g.caches.storages.email, params.form.validate.email)
                                if (props.redirectTo) {
                                    if ($tools.isUrl(props.redirectTo))
                                        window.location.href = props.redirectTo
                                    else router.push({ path: '/' })
                                } else router.push({ path: '/' })
                            }
                            if (typeof props.action === 'string') {
                                api.register = props.action
                                params.form.validate.url = api.login
                                await auth
                                    .register(params.form.validate)
                                    .then((res: ResponseData) => {
                                        if (res?.ret?.code === 200) handleRegiserSuccess()
                                        else message.error(res?.ret?.message)
                                        emit('afterRegister', res)
                                    })
                            } else if (typeof props.action === 'function') {
                                const response = await props.action(params.form.validate)
                                if (typeof response === 'boolean' && response)
                                    handleRegiserSuccess()
                                if (typeof response === 'string') message.error(response)
                            }
                        }
                    })
                    .finally(() => (params.loading = false))
            }
        }

        const handleVerify = async (key: 'username' | 'email') => {
            if ($tools.isEmpty(params.form.validate?.[key])) return
            const action = props.verify?.[key]?.action
            if (action) {
                if (typeof action === 'string') {
                    const method = props.verify?.[key]?.method || 'post'
                    const data = { data: params.form.validate?.[key] }
                    await $request[method.toLowerCase()](action, data)
                        .then((res: ResponseData) => {
                            if (res?.ret?.code === 200) params.tips[key] = null
                            else params.tips[key] = res?.ret?.message
                        })
                        .catch((err: any) => (params.tips[key] = err?.message))
                } else if (typeof action === 'function') {
                    const state = await action()
                    if (state === true) params.tips[key] = null
                    else if (typeof state === 'string') params.tips[key] = state
                    else params.tips[key] = t('register.unknown')
                }
                if (formRef.value) formRef.value?.validateFields([key])
            } else params.tips[key] = null
        }

        const handleCaptchaSuccess = (data?: any) => {
            if (data?.cuid) params.form.validate.cuid = data.cuid
            params.captcha = true
            if (formRef.value) formRef.value.validateFields(['captcha'])
            emit('captchaSuccess', data)
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

        const renderUsernameTip = () => {
            return (
                getPropSlot(slots, props, 'usernameTip') ?? (
                    <div class={styled.tips}>
                        <p innerHTML={t('register.tips.special')} />
                        <p innerHTML={t('register.tips.structure')} />
                        <p innerHTML={t('register.tips.start')} />
                        <p innerHTML={t('register.tips.length')} />
                    </div>
                )
            )
        }

        const renderUsername = () => {
            const tip = renderUsernameTip()
            const input = (
                <Input
                    id={$tools.uid()}
                    prefix={createVNode(UserOutlined)}
                    v-model:value={params.form.validate.username}
                    maxlength={32}
                    autcomplete="off"
                    onPressEnter={handleRegister}
                    onBlur={() => handleVerify('username')}
                    class={styled.input}
                    placeholder={t('register.placeholder.username')}
                />
            )
            let template = input
            if (tip) {
                template = (
                    <Popover
                        placement="top"
                        trigger={['focus']}
                        content={tip}
                        overlayClassName={styled.usernamePopover}
                        overlayStyle={{ zIndex: Date.now() }}>
                        {input}
                    </Popover>
                )
            }
            return (
                <Form.Item name="username" class={styled.item}>
                    {template}
                </Form.Item>
            )
        }

        const renderEmail = () => {
            return (
                <Form.Item name="email" class={styled.item}>
                    <Input
                        id={$tools.uid()}
                        type="email"
                        prefix={createVNode(MailOutlined)}
                        v-model:value={params.form.validate.email}
                        onBlur={() => handleVerify('email')}
                        onPressEnter={handleRegister}
                        maxlength={256}
                        class={styled.input}
                        autocomplete="off"
                        placeholder={t('register.placeholder.email')}
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

        const renderButton = () => {
            return (
                <div class={styled.btns}>
                    <Button
                        type="primary"
                        onClick={handleRegister}
                        loading={params.loading}
                        class={[styled.btn, styled.btnPrimary]}>
                        {t('register.title')}
                    </Button>
                    {width.value < $g.breakpoints.md ? (
                        <Button class={styled.btn}>
                            <MiLink path="/login">
                                {t('register.has-account')}
                                {t('register.login')}
                            </MiLink>
                        </Button>
                    ) : null}
                </div>
            )
        }

        const renderSocialiteRegister = () => {
            return (
                <Form.Item class={styled.socialite}>
                    {width.value >= $g.breakpoints.md ? (
                        <div class={styled.socialiteLink}>
                            {t('register.no-account')}
                            <MiLink path={props.loginLink ?? '/login'}>
                                {t('register.login')}
                            </MiLink>
                        </div>
                    ) : null}
                    <MiSocialite {...socialiteSetting.value} />
                </Form.Item>
            )
        }

        const renderForm = () => {
            return (
                <div class={styled.form}>
                    <Form
                        ref={formRef}
                        layout="vertical"
                        class={styled.formLogin}
                        model={params.form.validate}
                        rules={params.form.rules}
                        autcomplete="off">
                        {renderUsername()}
                        {renderEmail()}
                        {
                            <MiPassword
                                ref={passwordFormRef}
                                value={params.form.validate.password}
                                confirm={true}
                                onPressEnter={handleRegister}
                            />
                        }
                        {renderCaptcha()}
                        {renderButton()}
                        {renderSocialiteRegister()}
                    </Form>
                </div>
            )
        }

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

export default MiRegister
