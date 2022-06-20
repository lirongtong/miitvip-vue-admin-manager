import { defineComponent, computed, ref, reactive, createVNode } from 'vue'
import { useStore } from 'vuex'
import { RouterLink } from 'vue-router'
import { Form, Row, Col, Input, Checkbox, Button } from 'ant-design-vue'
import { UserOutlined, EyeInvisibleOutlined, EyeOutlined, LockOutlined, UnlockOutlined, QuestionCircleOutlined } from '@ant-design/icons-vue'
import { getPrefixCls, getPropSlot } from '../_utils/props-tools'
import { passportProps } from '../_utils/props-passport'
import { $g } from '../../utils/global'
import { useI18n } from 'vue-i18n'
import PropTypes from '../_utils/props-types'
import MiLayout from '../layout'
import MiCaptcha from '../captcha'
import MiLoginSocialite from './socialite'

const Login = defineComponent({
    name: 'MiLogin',
    inheritAttrs: false,
    props: Object.assign({...passportProps()}, {
        registerLink: PropTypes.string,
        forgetPasswordLink: PropTypes.string
    }),
    emits: ['afterLogin'],
    slots: ['content'],
    setup(props, {slots, attrs}) {
        const { t } = useI18n()
        const prefixCls = getPrefixCls('passport', props.prefixCls)
        const store = useStore()
        const isMobile = computed(() => store.getters['layout/mobile'])
        const formRef = ref(null)

        const validateCaptcha = () => {}

        const params = reactive({
            loading: false,
            captcha: false,
            password: true,
            form: {
                validate: {
                    username: '',
                    password: '',
                    remember: false,
                    captcha: false,
                    uuid: null,
                    url: null
                },
                rules: {
                    username: [{required: true, message: t('passport.login.username'), trigger: 'blur'}],
                    password: [{required: true, message: t('passport.login.password'), trigger: 'blur'}],
                    captcha: [{required: true, validator: validateCaptcha}]
                }
            }
        })

        const login = () => {}

        const renderMask = () => {
            return isMobile.value ? null : (
                <div class={`${prefixCls}-mask`} />
            )
        }

        const renderTitle = () => {
            return (
                <div class={`${prefixCls}-title`}>
                    <span innerHTML={props.title ?? $g.site} />
                    <sup>
                        <img src={$g.avatar} class={`${prefixCls}-logo`} alt={$g.powered} />
                    </sup>
                </div>
            )
        }

        const renderForm = () => {
            const cls = getPrefixCls('form')
            return (
                <div class={`${prefixCls}-form`}>
                    <Form layout="vertical"
                        class={cls}
                        ref={formRef}
                        model={params.form.validate}
                        rules={Object.assign({}, params.form.rules, props.rules)}>
                        {renderUserName()}
                        {renderPassword()}
                        {renderCaptcha()}
                        {renderRememberBtn()}
                        {renderButton()}
                        {renderSocialiteLogin()}
                    </Form>
                </div>
            )
        }

        const renderUserName = () => {
            return (
                <Form.Item name="username">
                    <Input prefix={createVNode(UserOutlined)}
                        v-model:value={params.form.validate.username}
                        maxlength={64}
                        placeholder={t('passport.login.username')} />
                </Form.Item>
            )
        }

        const renderPassword = () => {
            let password: any = null
            if (params.password) {
                const suffix = (<EyeInvisibleOutlined onClick={() => params.password = !params.password} />)
                password = (
                    <Input type="password"
                        maxlength={32}
                        prefix={createVNode(LockOutlined)}
                        suffix={suffix}
                        v-model:value={params.form.validate.password}
                        placeholder={t('passport.login.password')} />
                )
            } else {
                const suffix = (<EyeOutlined onClick={() => params.password = !params.password} />)
                password = (
                    <Input type="text"
                        maxlength={32}
                        prefix={createVNode(UnlockOutlined)}
                        suffix={suffix}
                        v-model:value={params.form.validate.password}
                        placeholder={t('passport.login.password')} />
                )
            }
            return (
                <Form.Item name="password">
                    {password}
                </Form.Item>
            )
        }

        const renderCaptcha = () => {
            if (props.openCaptcha) {
                return (
                    <Form.Item name="captcha" class={`${prefixCls}-captcha`}>
                        <MiCaptcha width="100%"
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
                            onSuccess={props.onCaptchaSuccess} />
                    </Form.Item>
                )
            }
            return null
        }

        const renderRememberBtn = () => {
            const cls = `${prefixCls}-forgot`
            const title = t('passport.forgot')
            const link = props.forgetPasswordLink
                ? (
                    <a href={props.forgetPasswordLink}
                        class={`${cls}`}>
                        <QuestionCircleOutlined />{title}
                    </a>
                )
                : (
                    <RouterLink to={{path: 'forgot'}}
                        class={`${cls}`}>
                        <QuestionCircleOutlined />{title}
                    </RouterLink>
                )
            return (
                <Form.Item class={`${prefixCls}-remember`}>
                    <Checkbox v-model:checked={params.form.validate.remember}>
                        {t('passport.remember')}
                    </Checkbox>
                    {link}
                </Form.Item>
            )
        }

        const renderButton = () => {
            const cls = `${prefixCls}-submit`
            const register = isMobile.value ? (
                <Button size="large"
                    class={`${cls} ${cls}-register`}>
                    <RouterLink to={{path: 'register'}}>
                        {t('passport.no-account')}{t('passport.login.sign')}
                    </RouterLink>
                </Button>
            ) : null
            return (
                <>
                    <Button class={cls} onClick={login}>
                        {t('passport.login.title')}
                    </Button>
                    {register}
                </>
            )
        }

        const renderSocialiteLogin = () => {
            const link = !props.registerLink ? (
                <RouterLink to={{path: 'register'}}>
                    {t('passport.register.title')}
                </RouterLink>
            ) : (
                <a href={props.registerLink} innerHTML={t('passport.register.title')} />
            )
            const cls = `${prefixCls}-socialite`
            return (
                <Form.Item class={`${cls}`}>
                    {
                        !isMobile.value ? (
                            <div class={`${cls}-link`}>
                                {t('passport.no-account')}
                                {link}
                            </div>
                        ) : null
                    }
                    <MiLoginSocialite />
                </Form.Item>
            )
        }

        return () => {
            const formTemplate = getPropSlot(slots, props, 'content') ?? renderForm()
            return (
                <div class={`${prefixCls}${isMobile.value ? ` ${prefixCls}-mobile` : ''}`} style={{
                    backgroundImage: `url(${props.background ?? $g.background.default})`
                }} {...attrs}>
                    <Row class={`${prefixCls}-content`} align={isMobile.value ? 'top' : 'middle'}>
                        <Col class={`${prefixCls}-box`} xs={24} sm={18} md={12} lg={12}>
                            {renderMask()}
                            {renderTitle()}
                            {formTemplate}
                        </Col>
                    </Row>
                    {getPropSlot(slots, props, 'footer') ?? <MiLayout.Footer />}
                </div>
            )
        }
    }
})

export default Login