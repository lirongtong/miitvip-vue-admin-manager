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
import MiLink from '../link/Link'
import applyTheme from '../_utils/theme'
import styled from './style/captcha.module.less'

const MiCaptcha = defineComponent({
    name: 'MiCaptcha',
    inheritAttrs: false,
    props: CaptchaProps(),
    emits: ['init', 'checked', 'success'],
    setup(props, { emit, expose, attrs }) {
        const { t, te } = useI18n()
        const { width } = useWindowResize()
        const size = computed(() => {
            return {
                width: $tools.convert2rem($tools.distinguishSize(props.width, width.value)),
                height: $tools.convert2rem($tools.distinguishSize(props.height, width.value))
            }
        })
        const radius = computed(() => {
            return $tools.convert2rem($tools.distinguishSize(props.radius, width.value))
        })
        const radarStyle = computed(() => {
            return {
                borderRadius: radius.value,
                boxShadow: props.boxShadow
                    ? props.color
                        ? `0 0 .25rem ${props.color}`
                        : null
                    : 'none',
                borderColor: props.color ?? null
            }
        })
        const successStyle = computed(() => {
            const background = props.color
                ? $g.regExp.hex.test(props.color)
                    ? $tools.colorHex2Rgba(props.color, 0.2)
                    : $g.regExp.rgb.test(props.color)
                      ? $tools.colorHex2Rgba($tools.colorRgb2Hex(props.color), 0.2)
                      : props.color
                : null
            return {
                borderRadius: radius.value,
                background,
                borderColor: props.color ?? null
            }
        })
        const captchaRef = ref(null)
        const captchaContentRef = ref(null)
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
            verifyParams: { ...props.verifyParams },
            actionConfig: { ...props.actionConfig }
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
                params.tip = tip || t('captcha.click')
            }
            if (props.initAction) {
                if (typeof props.initAction === 'function') {
                    const initStatus = await props.initAction()
                    if (initStatus === true) afterInit()
                    else afterInit(typeof initStatus === 'string' ? initStatus : undefined, true)
                    emit('init')
                } else if (typeof props.initAction === 'string') {
                    await $request[(props.initMethod || 'GET').toLowerCase()](
                        props.initAction,
                        props.initParams,
                        params.actionConfig
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
            if (!props.visible) return { left: '50%', top: '50%' } as Position
            const elem = captchaContentRef.value as HTMLElement
            let position = { left: 0, top: 0 } as Position
            if (elem) {
                if (width.value < $g.breakpoints.md) {
                    position = { left: '50%', top: '50%' }
                } else {
                    const realTop = $tools.getElementActualOffsetTopOrLeft(elem)
                    const realLeft = $tools.getElementActualOffsetTopOrLeft(elem, 'left')
                    const top = Math.round(realTop * 1000) / 1000 + params.offset.top
                    const left = Math.round(realLeft * 1000) / 1000 + params.offset.left
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
            params.tip = props.initAction
                ? params.init
                    ? t('captcha.click')
                    : t('captcha.init')
                : t('captcha.click')
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
                            params.actionConfig
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
                        const checkStatus = await props.checkAction()
                        if (typeof checkStatus === 'boolean') params.pass = checkStatus
                        else params.pass = false
                        initCaptchaModal()
                        emit('checked')
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
                <div class={styled.radarLogo} style={{ borderColor: props.color ?? null }}>
                    <MiLink path={props.link} target="_blank">
                        <img src={props.logo ?? __LOGO__} alt={$g.powered} />
                    </MiLink>
                </div>
            )
        }

        const renderRadar = () => {
            return (
                <div class={styled.radar} style={radarStyle.value}>
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
            return params.status.success ? (
                <Transition name={params.anim} appear={true}>
                    <div class={styled.success} style={successStyle.value} />
                </Transition>
            ) : null
        }

        const renderContent = () => {
            const offset = props.offset
                ? props.offset > 5
                    ? 5
                    : props.offset < 2
                      ? 2
                      : props.offset
                : 2
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
                        actionConfig={params.actionConfig}
                        onClose={handleCaptchaModalClose}
                        image={props.image}
                        offset={offset}
                        captchaVisible={props.visible}
                    />
                </Teleport>
            ) : null
            return (
                <>
                    <div
                        ref={captchaContentRef}
                        class={`${styled.content}${params.failed ? ` ${styled.failed}` : ''}${
                            props.visible ? '' : ` ${styled.hide}`
                        }`}
                        onClick={handleCaptchaModal}
                        style={size.value}>
                        {renderRadar()}
                        {renderSuccess()}
                    </div>
                    {modal}
                </>
            )
        }

        onMounted(() => {
            if (params.actionConfig?.url) delete params.actionConfig.url
            if (params.actionConfig.method) delete params.actionConfig.method
            initCaptcha()
            $tools.on(window, 'resize', resetCaptchaStatus)
        })

        onUnmounted(() => {
            handleCaptchaModalClose({ status: 'close' })
            $tools.off(window, 'resize', resetCaptchaStatus)
        })

        const resetCaptcha = (reinit = true) => {
            resetCaptchaStatus()
            if (reinit) initCaptcha()
        }

        expose({
            resetCaptcha: (reinit = true) => resetCaptcha(reinit),
            openCaptcha: () => handleCaptchaModal()
        })

        return () => (
            <div ref={captchaRef} class={styled.container} key={$tools.uid()} {...attrs}>
                {renderContent()}
            </div>
        )
    }
})

export default MiCaptcha
