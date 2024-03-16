import {
    defineComponent,
    ref,
    Teleport,
    reactive,
    computed,
    Transition,
    onMounted,
    onUnmounted
} from 'vue'
import { CaptchaProps } from './props'
import { getPrefixCls } from '../_utils/props'
import { $tools } from '../../utils/tools'
import { $request } from '../../utils/request'
import { $g } from '../../utils/global'
import { __LOGO__ } from '../../utils/images'
import { useI18n } from 'vue-i18n'
import { message } from 'ant-design-vue'
import { VerifiedOutlined } from '@ant-design/icons-vue'
import type { Position, ResponseData } from '../../utils/types'
import { useWindowResize } from '../../hooks/useWindowResize'
import MiCaptchaModal from './Modal'
import applyTheme from '../_utils/theme'
import styled from './style/captcha.module.less'
import Link from '../link'

const MiCaptcha = defineComponent({
    name: 'MiCaptcha',
    inheritAttrs: false,
    props: CaptchaProps(),
    emits: ['init', 'checked', 'success'],
    setup(props, { emit }) {
        const { t, te } = useI18n()
        const { width } = useWindowResize()
        const captchaRef = ref(null)
        const captchaModalRef = ref(null)
        const params = reactive({
            anim: getPrefixCls('anim-slit'),
            init: false,
            failed: false,
            pass: false,
            modal: {
                open: false,
                position: {} as Position
            },
            offset: {
                top: 22.5,
                left: 48
            },
            tip: props.initAction ? t('captcha.init') : t('captcha.click'),
            status: {
                ready: true,
                scanning: false,
                being: false,
                success: false
            },
            verifyParams: { ...props.verifyParams }
        })
        const themeColorStyle = computed(() => {
            return props.color
                ? {
                      backgroundColor: props.color,
                      boxShadow: `inset 0 0 0 .0625rem ${props.color}`
                  }
                : null
        })
        applyTheme(styled)

        const initCaptcha = async () => {
            const afterInit = (tip = t('captcha.click'), failed = false) => {
                params.failed = failed
                params.init = true
                params.tip = tip
            }
            if (props.initAction) {
                if (typeof props.initAction === 'function') {
                    const initSuccess = await props.initAction()
                    if (initSuccess) afterInit()
                } else if (typeof props.initAction === 'string') {
                    await $request[(props.initMethod || 'GET').toLowerCase()](
                        props.initAction,
                        props.initParams,
                        props.actionConfig
                    )
                        .then((res: ResponseData) => {
                            afterInit()
                            if (res?.data?.key && !params.verifyParams.key)
                                params.verifyParams.key = res?.data?.key
                            emit('init', res)
                        })
                        .catch(() => afterInit(t('captcha.error.init'), true))
                }
            } else afterInit()
        }

        const initCaptchaModal = () => {
            if (params.pass) {
                handleCaptchaSuccess()
            } else {
                params.status.scanning = false
                params.status.being = true
                params.modal.position = getCaptchaModalPosition()
                params.modal.open = true
                params.tip = t('captcha.move')
            }
        }

        const getCaptchaModalPosition = (): Position => {
            const elem = captchaRef.value as HTMLElement
            let position = { left: 0, top: 0 } as Position
            if (elem) {
                if (width.value < $g.breakpoints.md) {
                    position = { left: '50%', top: '50%' }
                } else {
                    const rect = elem.getBoundingClientRect()
                    const top = Math.round(rect.top * 1000) / 1000 + params.offset.top
                    const left = Math.round(rect.left * 1000) / 1000 + params.offset.left
                    position = { left, top }
                }
            }
            return position
        }

        const resetCaptchaStatus = () => {
            params.status.ready = true
            params.status.scanning = false
            params.status.success = false
            params.status.being = false
            params.modal.open = false
            params.tip = props.initAction ? t('captcha.init') : t('captcha.click')
        }

        const handleCaptchaSuccess = (data?: any) => {
            params.tip = te('captcha.pass') ? t('captcha.pass') : 'Pass'
            emit('success', data)
            setTimeout(() => {
                params.status.ready = false
                params.status.being = false
                params.status.scanning = false
                params.status.success = true
                params.modal.open = false
            })
        }

        const handleCaptchaModal = async () => {
            if (!params.failed) {
                params.status.ready = false
                params.status.scanning = true
                params.tip = te('captcha.checking') ? t('captcha.checking') : 'Scanning ···'
                if (props.checkAction) {
                    if (typeof props.checkAction === 'string') {
                        $request[(props.checkMethod || 'GET').toLowerCase()](
                            props.checkAction,
                            props.checkParams,
                            props.actionConfig
                        )
                            .then((res: ResponseData) => {
                                if (res?.data?.pass) params.pass = true
                                initCaptchaModal()
                                emit('checked', res)
                            })
                            .catch(() => {
                                params.pass = false
                                initCaptchaModal()
                            })
                    } else if (typeof props.checkAction === 'function') {
                        params.pass = await props.checkAction()
                        initCaptchaModal()
                    }
                } else initCaptchaModal()
            }
        }

        const handleCaptchaModalClose = (data: any) => {
            if (data) {
                if (data?.status === 'close') resetCaptchaStatus()
                if (data?.status === 'success') handleCaptchaSuccess(data?.data)
                if (data?.status === 'frequently') {
                    resetCaptchaStatus()
                    message.error(t('captcha.error.try', { num: props.maxTries }))
                }
            } else resetCaptchaStatus()
        }

        const renderRadarReady = () => {
            return params.status.ready ? (
                <div class={styled.radarReady}>
                    <div class={styled.radarRing} style={themeColorStyle.value}></div>
                    <div class={styled.radarDot} style={themeColorStyle.value}></div>
                </div>
            ) : null
        }

        const renderRadarScan = () => {
            return params.status.scanning ? (
                <div class={styled.radarScan}>
                    <div class={styled.radarScanRing}>
                        <div
                            style={{
                                borderColor: props.color
                                    ? `${props.color} transparent ${props.color} transparent`
                                    : null
                            }}
                        />
                        <div
                            style={{
                                borderColor: props.color
                                    ? `transparent ${props.color} transparent ${props.color}`
                                    : null
                            }}
                        />
                    </div>
                </div>
            ) : null
        }

        const renderRadarBeing = () => {
            return params.status.being ? <div class={styled.radarBeing}>···</div> : null
        }

        const renderRadarSuccess = () => {
            return params.status.success ? (
                <div class={styled.radarSuccess}>
                    <VerifiedOutlined style={{ color: props.color ?? null }} />
                </div>
            ) : null
        }

        const renderRadarTip = () => {
            return (
                <div
                    class={`${styled.radarTip}${params.failed ? ` ${styled.radarError}` : ''}`}
                    style={{ height: $tools.convert2rem($tools.distinguishSize(props.height)) }}
                    innerHTML={params.tip}
                />
            )
        }

        const renderRadarLogo = () => {
            return (
                <div class={styled.radarLogo}>
                    <Link path={props.link} target="_blank">
                        <img src={props.logo ?? __LOGO__} alt={$g.powered} />
                    </Link>
                </div>
            )
        }

        const renderRadar = () => {
            const style = {
                borderRadius: props.radius
                    ? $tools.convert2rem($tools.distinguishSize(props.radius))
                    : null,
                boxShadow: props.boxShadow
                    ? props.color
                        ? `0 0 .25rem ${props.color}`
                        : null
                    : 'none',
                borderColor: props.color ?? null
            }
            return (
                <div class={styled.radar} style={style}>
                    {renderRadarReady()}
                    {renderRadarScan()}
                    {renderRadarBeing()}
                    {renderRadarSuccess()}
                    {renderRadarTip()}
                    {renderRadarLogo()}
                </div>
            )
        }

        const renderSuccess = () => {
            const background = props.color
                ? $g.regExp.hex.test(props.color)
                    ? $tools.colorHex2Rgba(props.color, 0.2)
                    : $g.regExp.rgb.test(props.color)
                      ? $tools.colorHex2Rgba($tools.colorRgb2Hex(props.color), 0.2)
                      : props.color
                : null
            const style = {
                borderRadius: props.radius
                    ? $tools.convert2rem($tools.distinguishSize(props.radius))
                    : null,
                background,
                borderColor: props.color ?? null
            }
            return params.status.success ? (
                <Transition name={params.anim} appear={true}>
                    <div class={styled.success} style={style} />
                </Transition>
            ) : null
        }

        const renderContent = () => {
            const width = $tools.convert2rem($tools.distinguishSize(props.width))
            const height = $tools.convert2rem($tools.distinguishSize(props.height))
            const modal = params.modal.open ? (
                <Teleport to="body" ref={captchaModalRef}>
                    <MiCaptchaModal
                        open={params.modal.open}
                        position={params.modal.position}
                        maxTries={props.maxTries}
                        mask={props.mask}
                        maskClosable={props.maskClosable}
                        color={props.color}
                        verifyParams={props.verifyParams}
                        verifyMethod={props.verifyMethod}
                        verifyAction={props.verifyAction}
                        actionConfig={props.actionConfig}
                        onClose={handleCaptchaModalClose}
                        image={props.image}
                    />
                </Teleport>
            ) : null
            return (
                <>
                    <div
                        class={`${styled.content}${params.failed ? ` ${styled.failed}` : ''}`}
                        onClick={handleCaptchaModal}
                        style={{ width, height }}>
                        {renderRadar()}
                        {renderSuccess()}
                    </div>
                    {modal}
                </>
            )
        }

        onMounted(() => {
            initCaptcha()
            $tools.on(window, 'resize', resetCaptchaStatus)
        })

        onUnmounted(() => {
            handleCaptchaModalClose({ status: 'close' })
            $tools.off(window, 'resize', resetCaptchaStatus)
        })

        return () => (
            <div ref={captchaRef} class={styled.container} key={$tools.uid()}>
                {renderContent()}
            </div>
        )
    }
})

export default MiCaptcha
