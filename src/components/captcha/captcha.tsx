import { defineComponent, computed, reactive, Teleport, ref } from 'vue'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'
import { VerifiedOutlined } from '@ant-design/icons-vue'
import PropTypes from '../_utils/props-types'
import { getPrefixCls } from '../_utils/props-tools'
import { $tools } from '../../utils/tools'
import { $request } from '../../utils/request'
import MiCaptchaModal from './modal'

const POWERED = 'Powered By makeit.vip'
const AVATAR = 'https://file.makeit.vip/MIIT/M00/00/00/ajRkHV_pUyOALE2LAAAtlj6Tt_s370.png'
const TARGET = 'https://admin.makeit.vip/components/captcha'

export const captchaProps = () => ({
    prefixCls: PropTypes.string,
    width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).def(320),
    height: PropTypes.number,
    radius: PropTypes.number.def(48),
    themeColor: PropTypes.string,
    bgColor: PropTypes.string,
    borderColor: PropTypes.string,
    textColor: PropTypes.string,
    boxShadow: PropTypes.bool.def(true),
    boxShadowColor: PropTypes.string,
    boxShadowBlur: PropTypes.number.def(4),
    modalBgColor: PropTypes.string,
    modalBoxShadow: PropTypes.bool.def(true),
    modalBoxShadowColor: PropTypes.string,
    modalBoxShadowBlur: PropTypes.number,
    image: PropTypes.string,
    logo: PropTypes.string,
    mask: PropTypes.bool.def(true),
    maskClosable: PropTypes.bool.def(true),
    maxTries: PropTypes.number.def(5),
    initParams: PropTypes.object.def({}),
    initAction: PropTypes.string,
    verifyParams: PropTypes.object.def({}),
    verifyAction: PropTypes.string,
    checkParams: PropTypes.object.def({}),
    checkAction: PropTypes.string,
    checkActionMethod: PropTypes.string.def('post')
})

export default defineComponent({
    name: 'MiCaptcha',
    inheritAttrs: false,
    props: captchaProps(),
    emits: ['init', 'checked', 'success'],
    setup(props, {emit}) {
        const prefixCls = getPrefixCls('captcha', props.prefixCls)
        const captchaRef = ref<InstanceType<typeof HTMLDivElement>>(null)
        const { t } = useI18n()
        const store = useStore()
        const isMobile = computed(() => store.getters['layout/mobile'])
        const themeColorStyle = computed(() => {
            return props.themeColor ? {
                backgroundColor: props.themeColor,
                boxShadow: `inset 0 0 0 1px ${props.themeColor}`
            } : null
        })
        const params = reactive({
            avatar: AVATAR,
            powered: POWERED,
            target: TARGET,
            init: false,
            failed: false,
            pass: false,
            tip: props.initAction ? t('captcha.init') : t('captcha.click'),
            timer: null,
            status: {
                ready: true,
                scanning: false,
                being: false,
                success: false
            },
            offset: {
                top: 22.5,
                left: 48
            },
            modal: {
                show: false,
                pos: {},
                instance: null
            }
        })

        const getRadar = () => {
            const cls = `${prefixCls}-radar${params.status.success
                ? ` ${prefixCls}-radar-pass`
                : ''}`
            const style = {
                borderRadius: props.radius
                    ? `${$tools.px2Rem(props.radius)}rem`
                    : null,
                borderColor: props.borderColor ?? props.themeColor ?? null,
                backgroundColor: props.bgColor ?? null,
                boxShadow: props.boxShadow
                    ? props.boxShadowColor || props.themeColor
                        ? `0 0 ${$tools.px2Rem(props.boxShadowBlur)}rem ${props.boxShadowColor || props.themeColor}`
                        : 'none'
                    : 'none'
            }
            return (
                <div class={cls} style={style}>
                    { getRadarReady() }
                    { getRadarScan() }
                    { getRadarBeing() }
                    { getRadarSuccess() }
                    { getRadarTip() }
                    { getRadarLogo() }
                </div>
            )
        }

        const getRadarReady = () => {
            return (
                params.status.ready ? (
                    <div class={`${prefixCls}-radar-ready`}>
                        <div class={`${prefixCls}-radar-ring`}
                            style={themeColorStyle.value} />
                        <div class={`${prefixCls}-radar-dot`}
                            style={themeColorStyle.value}
                            ref={`${prefixCls}-radar-dot`} />
                    </div>
                ) : null
            )
        }

        const getRadarScan = () => {
            const borderColor = props.themeColor
                ? `${props.themeColor} transparent ${props.themeColor} transparent`
                : null
            const borderColor2 = props.themeColor
                ? `transparent ${props.themeColor} transparent ${props.themeColor}`
                : null
            return params.status.scanning ? (
                <div class={`${prefixCls}-radar-scan`}>
                    <div class="double-ring">
                        <div style={{borderColor}} />
                        <div style={{borderColor: borderColor2}} />
                    </div>
                </div>
            ) : null
        }

        const getRadarBeing = () => {
            return params.status.being ? (
                <div class={`${prefixCls}-radar-being`}>···</div>
            ) : null
        }

        const getRadarSuccess = () => {
            const iconStyle = {
                fontSize: `${$tools.px2Rem(20)}rem`,
                color: props.themeColor ?? null
            }
            return params.status.success ? (
                <div class={`${prefixCls}-radar-success ${prefixCls}-radar-success-icon`}>
                    <VerifiedOutlined style={iconStyle} />
                </div>
            ) : null
        }

        const getRadarTip = () => {
            const radarTipCls = `${prefixCls}-radar-tip`
            const errCls = params.failed ? ` ${radarTipCls}-error` : ''
            const cls =  `${radarTipCls}${errCls}`
            const style = {
                height: $tools.convert2Rem(props.height),
                color: params.status.success && props.themeColor ? props.themeColor : null
            }
            return <div class={cls} style={style} innerHTML={params.tip} />
        }

        const getRadarLogo = () => {
            const height = props.height && props.height > 40 ? props.height : null
            const top = Math.round((height - 20) / 2 * 100) / 100 - 1
            const style = {top: height ? $tools.convert2Rem(top) : null}
            return (
                <div class={`${prefixCls}-radar-logo`} style={style}>
                    <a href={params.target} target="_blank">
                        <img src={props.logo ?? params.avatar} alt={params.powered} />
                    </a>
                </div>
            )
        }

        const getSuccessShow = () => {
            const hex = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/
            const rgb = /^(rgb|RGB)/
            const successCls = `${prefixCls}-success`
            const cls = `${successCls}${params.status.success ? ` ${successCls}-show` : ''}`
            const backgroundColor = props.themeColor ? (
                hex.test(props.themeColor)
                    ? $tools.colorHex2Rgba(props.themeColor, 0.2)
                    : (rgb.test(props.themeColor) ? (
                        $tools.colorHex2Rgba($tools.colorRgb2Hex(props.themeColor), 0.2)
                    ) : props.themeColor)
            ) : null
            const style = {
                borderRadius: props.radius
                    ? $tools.convert2Rem(props.radius)
                    : null,
                background: backgroundColor,
                borderColor: props.themeColor ?? null
            }
            return <div class={cls} style={style}></div>
        }

        const showCaptchaModal = () => {
            if (params.init || params.status.success) return
            params.tip = t('captcha.checking')
            params.status.ready = false
            params.status.scanning = true
            if (props.checkAction) {
                $request[props.checkActionMethod.toLowerCase()](props.checkAction, props.checkParams).then((res: any) => {
                    if (res.data.pass) params.pass = true
                    else initCaptchaModal()
                    emit('checked', res.data)
                }).catch(() => {
                    params.pass = false
                    initCaptchaModal()
                })
            } else initCaptchaModal()
        }

        const initCaptchaModal = (image?: string) => {
            image = image ?? props.image
            params.status.scanning = false
            params.status.being = true
            params.modal.pos = getCaptchaModalPosition()
            params.modal.show = true
            params.tip = t('captcha.move')
        }

        const saveCaptchaModal = (elem: any) => {
            params.modal.instance = elem
        }

        const getCaptchaModalPosition = () => {
            const elem = captchaRef.value
            let pos = {left: 0, top: 0}
            if (elem) {
                const rect = elem.getBoundingClientRect()
                const top = Math.round(rect.top * 1000) / 1000 + params.offset.top
                const left = Math.round(rect.left * 1000) / 1000 + params.offset.left
                pos = {left, top}
            }
            return pos
        }

        const captchaModalClose = (data: any) => {
            if (data) {
                if (data.status === 'close') reset()
                if (data.status === 'success') success(data.data)
                if (data.status === 'frequently') {
                    reset()
                    showMessage(t('captcha.error', {num: props.maxTries}), 5)
                }
            }
        }

        const showMessage = (msg = t('captcha.tip'), duration = 3) => {
            const name = `${prefixCls}-message`
            const exist = document.getElementById(name)
            if (exist) exist.remove()
            const elem = document.createElement('div')
            elem.id = name
            elem.className = name
            elem.innerHTML = `
                <div class="${name}-content">
                    <i class="mi-icon icon-close"></i>
                    <span>${msg}</span>
                </div>
            `
            document.body.appendChild(elem)
            if (params.timer) clearTimeout(params.timer)
            params.timer = setTimeout(() => {
                elem.remove()
            }, duration * 1000)
        }

        const success = (data: any) => {
            params.tip = t('captcha.pass')
            emit('success', data)
            setTimeout(() => {
                params.modal.show = false
                params.status.being = false
                params.status.success = true
            })
        }

        const reset = () => {
            params.modal.show = false
            params.status.being = false
            params.status.success = false
            params.status.scanning = false
            params.status.ready = true
            params.tip = t('captcha.click')
        }

        const getContent = () => {
            const width = $tools.convert2Rem(props.width)
            const height = $tools.convert2Rem(props.height)
            const modal = (
                params.modal.show ||
                params.modal.instance
            ) ? (
                <Teleport to={document.body} ref={saveCaptchaModal}>
                    <MiCaptchaModal position={params.modal.pos}
                        maxTries={props.maxTries}
                        show={params.modal.show}
                        mask={props.mask}
                        maskClosable={props.maskClosable}
                        boxShadow={props.modalBoxShadow}
                        boxShadowBlur={props.modalBoxShadowBlur}
                        boxShadowColor={props.modalBoxShadowColor}
                        themeColor={props.themeColor}
                        bgColor={props.modalBgColor}
                        verifyParams={props.verifyParams}
                        onModalClose={captchaModalClose}
                        image={props.image} />
                </Teleport>
            ) : null
            return (
                <>
                    <div class={`${prefixCls}-content`}
                        style={{width, height}}>
                        {getRadar()}
                        {getSuccessShow()}
                    </div>
                    {modal}
                </>
            )
        }

        return () => (
            <div class={`${prefixCls}${isMobile.value ? ` ${prefixCls}-mobile` : ''}`}
                onClick={showCaptchaModal}
                key={`${prefixCls}-${$tools.uid()}`}
                ref={captchaRef}>
                {getContent()}
            </div>
        )
    }
})
