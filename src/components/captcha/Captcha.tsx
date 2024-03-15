import { defineComponent, ref, Teleport, reactive, computed, Transition } from 'vue'
import { CaptchaProps } from './props'
import { getPrefixCls } from '../_utils/props'
import { $tools } from '../../utils/tools'
import { $request } from '../../utils/request'
import { $g } from '../../utils/global'
import { logo } from '../../utils/images'
import { useI18n } from 'vue-i18n'
import { VerifiedOutlined } from '@ant-design/icons-vue'
import type { Position, ResponseData } from '../../utils/types'
import MiCaptchaModal from './Modal'
import applyTheme from '../_utils/theme'
import styled from './style/captcha.module.less'
import Link from '../link'

const MiCaptcha = defineComponent({
    name: 'MiCaptcha',
    inheritAttrs: false,
    props: CaptchaProps(),
    emits: ['init', 'checked', 'success'],
    setup(props) {
        const { t } = useI18n()
        const captchaRef = ref(null)
        const captchaModalRef = ref(null)
        const params = reactive({
            anim: getPrefixCls('anim-slit'),
            init: false,
            failed: false,
            pass: false,
            modal: {
                open: false,
                position: {}
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
            }
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

        const initCaptchaModal = () => {
            params.status.scanning = false
            params.status.being = true
            params.modal.position = getCaptchaModalPosition()
            params.modal.open = true
            params.tip = t('captcha.move')
        }

        const getCaptchaModalPosition = (): Position => {
            const elem = captchaRef.value as HTMLElement
            let position = { left: 0, top: 0 }
            if (elem) {
                const rect = elem.getBoundingClientRect()
                const top = Math.round(rect.top * 1000) / 1000 + params.offset.top
                const left = Math.round(rect.left * 1000) / 1000 + params.offset.left
                position = { left, top }
            }
            return position
        }

        const handleCaptchaModal = () => {
            params.status.ready = false
            params.status.scanning = true
            if (props.checkAction) {
                if (typeof props.checkAction === 'string') {
                    $request[(props.checkMethod || 'GET').toLowerCase()](
                        props.checkAction,
                        props.checkParams,
                        props.actionConfig
                    ).then((res: ResponseData) => {
                        if (res?.data?.pass) params
                    })
                } else if (typeof props.checkAction === 'function') props.checkAction()
            } else initCaptchaModal()
        }

        const handleCaptchaModalClose = () => {}

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
                        <img src={props.logo ?? logo} alt={$g.powered} />
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
            // return (
            //     <div
            //         class={`${styled.success}${
            //             params.status.success ? ` ${styled.successOpen}` : ''
            //         }`}
            //         style={style}
            //     />
            // )
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
                        class={styled.content}
                        onClick={handleCaptchaModal}
                        style={{ width, height }}>
                        {renderRadar()}
                        {renderSuccess()}
                    </div>
                    {modal}
                </>
            )
        }

        return () => (
            <div ref={captchaRef} class={styled.container} key={$tools.uid()}>
                {renderContent()}
            </div>
        )
    }
})

export default MiCaptcha
