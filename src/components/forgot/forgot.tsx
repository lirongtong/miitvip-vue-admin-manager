import { defineComponent, computed, ref, createVNode, reactive, Transition } from 'vue'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'
import { RouterLink } from 'vue-router'
import { Form, Row, Col, Input, Button } from 'ant-design-vue'
import { UserOutlined, PropertySafetyOutlined } from '@ant-design/icons-vue'
import { passportProps } from '../_utils/props-passport'
import { getPrefixCls, getPropSlot } from '../_utils/props-tools'
import { $g } from '../../utils/global'
import { $tools } from '../../utils/tools'
import { $request } from '../../utils/request'
import MiLayout from '../layout'
import MiCaptcha from '../captcha'
import MiModal from '../modal'
import PropTypes from '../_utils/props-types'

export default defineComponent({
    name: 'MiForgot',
    inheritAttrs: false,
    props: Object.assign({...passportProps()}, {
        sendCodeAction: PropTypes.oneOfType([PropTypes.string, PropTypes.func]).isRequired,
        sendCodeMethod: PropTypes.string.def('post'),
        checkCodeAction: PropTypes.oneOfType([PropTypes.string, PropTypes.func]).isRequired,
        checkCodeMethod: PropTypes.string.def('post'),
        resetPasswordAction: PropTypes.oneOfType([PropTypes.string, PropTypes.func]).isRequired,
        resetPasswordMethod: PropTypes.string.def('put')
    }),
    slots: ['content', 'footer'],
    setup(props, {slots, emit}) {
        const { t } = useI18n()
        const prefixCls = getPrefixCls('passport', props.prefixCls)
        const store = useStore()
        const isMobile = computed(() => store.getters['layout/mobile'])
        const formRef = ref(null)
        const anim = getPrefixCls('anim-slide')

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
            sent: false,
            loading: false,
            tip: t('step.next'),
            form: {
                validate: {
                    username: null,
                    uuid: null,
                    code: null
                },
                rules: {
                    username: [{required: true, message: t('passport.username')}],
                    code: [{required: true, validator: validateCode}],
                    captcha: [{required: true, validator: validateCaptcha}]
                }
            }
        })

        const captchaVerify = (data: any) => {
            if (data?.uuid) params.form.validate.uuid = data.uuid
            params.captcha = true
            formRef.value.validateFields(['captcha'])
            emit('captchaSuccess', data)
        }

        const nextStep = () => {
            if (params.loading) return
            params.loading = true
            formRef.value.validate().then(() => {
                if (params.sent) {
                    // check code
                    $request[props.checkCodeMethod](props.checkCodeAction, params.form.validate)
                    .then(() => {
                        
                    })
                } else {
                    // send code
                    if (typeof props.sendCodeAction === 'string') {
                        $request[props.sendCodeMethod](props.sendCodeAction, params.form.validate)
                        .then((res: any) => {
                            params.loading = false
                            if (res?.ret?.code === 200) {
                                params.sent = true
                                params.tip = t('passport.sent')
                            } else MiModal.error(res?.ret?.mesasge)
                        }).catch((err: any) => {
                            params.loading = false
                            MiModal.error(err.message)
                        })
                    } else if (typeof props.sendCodeAction === 'function') {
                        props.sendCodeAction(params.form.validate)
                    }
                    params.sent = true
                }
            }).catch(() => params.loading = false)
        }

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
                        <RouterLink to={{path: '/'}}>
                            <img src={$g.avatar} class={`${prefixCls}-logo`} alt={$g.powered} />
                        </RouterLink>
                    </sup>
                </div>
            )
        }

        const renderUserName = () => {
            return (
                <Form.Item name="username">
                    <Input prefix={createVNode(UserOutlined)}
                        v-model:value={params.form.validate.username}
                        maxlength={16}
                        autocomplete="off"
                        placeholder={t('passport.username')} />
                </Form.Item>
            )
        }

        const renderVerificationCode = () => {
            return params.sent ? (
                <Transition name={anim} appear={true}>
                    <Form.Item name="code" class="mi-anim" v-show={params.sent}>
                        <Input prefix={createVNode(PropertySafetyOutlined)}
                            v-model:value={params.form.validate.code}
                            maxlength={16}
                            autocomplete="off"
                            placeholder={t('passport.code')} />
                    </Form.Item>
                </Transition>
            ) : null
        }

        const renderCaptcha = () => {
            return props.openCaptcha ? (
                <Form.Item name="captcha">
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
                        onSuccess={captchaVerify} />
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
                        {renderVerificationCode()}
                        {renderCaptcha()}
                        {renderButton()}
                    </Form>
                </div>
            )
        }

        return () => (
            <div class={`${prefixCls}${isMobile.value ? `${prefixCls}-mobile` : ''}`}
            style={{
                backgroundImage: `url(${props.background ?? $g.background.default})`
            }}>
                <Row class={`${prefixCls}-content`} align={isMobile.value ? 'top' : 'middle'}>
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