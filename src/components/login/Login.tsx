import { defineComponent, type SlotsType, ref, reactive, createVNode, computed } from 'vue'
import type { ResponseData } from '../../utils/types'
import { LoginProps } from './props'
import { useI18n } from 'vue-i18n'
import { QuestionCircleOutlined, UserOutlined } from '@ant-design/icons-vue'
import {
    Row,
    Col,
    message,
    type FormInstance,
    Form,
    Input,
    ConfigProvider,
    Checkbox,
    Button
} from 'ant-design-vue'
import { useRoute, useRouter } from 'vue-router'
import { api } from '../../utils/api'
import { $tools } from '../../utils/tools'
import { $g } from '../../utils/global'
import { getPropSlot } from '../_utils/props'
import { useAuthStore } from '../../stores/auth'
import { useWindowResize } from '../../hooks/useWindowResize'
import { __LOGO__, __PASSPORT_DEFAULT_BACKGROUND__ } from '../../utils/images'
import MiLayoutFooter from '../layout/Footer'
import MiPassword from '../password/Password'
import MiCaptcha from '../captcha/Captcha'
import MiLink from '../link/Link'
import MiPalette from '../palette/Palette'
import MiTheme from '../theme/Theme'
import MiSocialite from '../socialite/Socialite'
import applyTheme from '../_utils/theme'
import styled from './style/login.module.less'

const MiLogin = defineComponent({
    name: 'MiLogin',
    inheritAttrs: false,
    props: LoginProps(),
    emits: ['captchaInit', 'captchaChecked', 'captchaSuccess', 'afterLogin'],
    slots: Object as SlotsType<{
        content: any
        footer: any
    }>,
    setup(props, { slots, emit }) {
        const { t } = useI18n()
        const auth = useAuthStore()
        const route = useRoute()
        const router = useRouter()
        const videoRef = ref<HTMLVideoElement>()
        const formRef = ref<FormInstance>()
        const passwordFormRef = ref<FormInstance>()
        const { width } = useWindowResize()

        const validateCaptcha = () => {
            if (!params.captcha) return Promise.reject(t('login.verify'))
            else return Promise.resolve()
        }

        const params = reactive({
            loading: false,
            captcha: false,
            password: true,
            submitting: false,
            form: {
                validate: {
                    username: '',
                    password: '',
                    remember: true,
                    captcha: props.captcha || false,
                    cuid: null,
                    url: null
                },
                rules: Object.assign(
                    {},
                    {
                        username: [{ required: true, message: t('login.username') }],
                        password: [{ required: true, message: t('login.password') }],
                        captcha: [{ required: true, validator: validateCaptcha }]
                    },
                    props.rules
                )
            }
        })
        !params.form.validate.captcha && delete params.form.validate.cuid
        const socialiteSetting = computed(() => {
            return Object.assign(
                {
                    tip: t('login.socialite'),
                    showMore: width.value >= $g.breakpoints.md
                },
                props.socialiteSetting
            )
        })
        applyTheme(styled)

        const handleLogin = async () => {
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
                            const handleLoginSuccess = () => {
                                const path = route.query?.redirect as string
                                if (path) {
                                    if ($tools.isUrl(path)) window.location.href = path
                                    else router.push({ path })
                                } else router.push({ path: '/' })
                            }
                            if (typeof props.action === 'string') {
                                api.login = props.action
                                params.form.validate.url = api.login
                                await auth.login(params.form.validate).then((res: ResponseData) => {
                                    if (res?.ret?.code === 200) {
                                        const path = route.query?.redirect as string
                                        if (path) {
                                            if ($tools.isUrl(path)) window.location.href = path
                                            else router.push({ path })
                                        }
                                    } else message.error(res?.ret?.message)
                                    emit('afterLogin', res)
                                })
                            } else if (typeof props.action === 'function') {
                                const response = await props.action(params.form.validate)
                                if (typeof response === 'boolean' && response) {
                                    handleLoginSuccess()
                                    emit('afterLogin')
                                }
                                if (typeof response === 'string') message.error(response)
                            }
                        }
                    })
                    .finally(() => (params.loading = false))
            }
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
            return width.value < $g.breakpoints.sm ? null : <div class={styled.mask} />
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
                        id={$tools.uid()}
                        prefix={createVNode(UserOutlined)}
                        v-model:value={params.form.validate.username}
                        maxlength={64}
                        autcomplete="off"
                        onPressEnter={handleLogin}
                        class={styled.input}
                        placeholder={t('login.username')}
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

        const renderRememberBtn = () => {
            return (
                <Form.Item class={styled.remember}>
                    <Checkbox v-model:checked={params.form.validate.remember}>
                        {t('login.remember')}
                    </Checkbox>
                    <MiLink path={props.forgetPasswordLink ?? `/forget`} class={styled.forget}>
                        <QuestionCircleOutlined />
                        {t('login.forget')}
                    </MiLink>
                </Form.Item>
            )
        }

        const renderButton = () => {
            return (
                <div class={styled.btns}>
                    <Button
                        type="primary"
                        onClick={handleLogin}
                        loading={params.loading}
                        class={[styled.btn, styled.btnPrimary]}>
                        {t('login.title')}
                    </Button>
                    {width.value < $g.breakpoints.md ? (
                        <Button class={styled.btn}>
                            <MiLink path="/register">
                                {t('login.no-account')}
                                {t('login.signup')}
                            </MiLink>
                        </Button>
                    ) : null}
                </div>
            )
        }

        const renderSocialiteLogin = () => {
            return (
                <Form.Item class={styled.socialite}>
                    {width.value >= $g.breakpoints.md ? (
                        <div class={styled.socialiteLink}>
                            {t('login.no-account')}
                            <MiLink path={props.registerLink ?? '/register'}>
                                {t('login.register')}
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
                        {renderUserName()}
                        {
                            <MiPassword
                                ref={passwordFormRef}
                                value={params.form.validate.password}
                                skipCheck={true}
                                isRequired={true}
                                onPressEnter={handleLogin}
                            />
                        }
                        {renderCaptcha()}
                        {renderRememberBtn()}
                        {renderButton()}
                        {renderSocialiteLogin()}
                    </Form>
                </div>
            )
        }

        return () => {
            const socialite = route.params.socialite
            const token = route.params.token as string
            if (socialite && token) {
                const socialite = route.params.socialite
                const token = route.params.token as string
                const url = $tools.replaceUrlParams(api.oauth.authorize, { socialite })
                auth.authorize({ url, token })
                    .then((res: ResponseData) => {
                        if (res?.ret?.code === 200) router.push({ path: '/' })
                        else router.push({ path: '/login' })
                    })
                    .catch((err: any) => message.error(err?.message || t('login.unknown')))
            }
            return socialite && token ? null : (
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
                            }
                            key={$tools.uid()}>
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
    }
})

export default MiLogin
