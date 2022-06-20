import { defineComponent, computed, ref, createVNode, reactive } from 'vue'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'
import { RouterLink } from 'vue-router'
import { Form, Row, Col, Input, Button } from 'ant-design-vue'
import { UserOutlined } from '@ant-design/icons-vue'
import { passportProps } from '../_utils/props-passport'
import { getPrefixCls, getPropSlot } from '../_utils/props-tools'
import { $g } from '../../utils/global'
import MiLayout from '../layout'
import MiCaptcha from '../captcha'

export default defineComponent({
    name: 'MiForgot',
    inheritAttrs: false,
    props: passportProps(),
    slots: ['content', 'footer'],
    setup(props, {slots, emit}) {
        const { t } = useI18n()
        const prefixCls = getPrefixCls('passport', props.prefixCls)
        const store = useStore()
        const isMobile = computed(() => store.getters['layout/mobile'])
        const formRef = ref(null)

        const params = reactive({
            captcha: false,
            form: {
                validate: {
                    username: null,
                    uuid: null
                },
                rules: []
            }
        })

        const captchaVerify = (data: any) => {
            if (data?.uuid) params.form.validate.uuid = data.uuid
            params.captcha = true
            formRef.value.validateFields(['captcha'])
            emit('captchaSuccess', data)
        }

        const nextStep = () => {}

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
                        {t('step.next')}
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