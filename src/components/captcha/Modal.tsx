import { Transition, defineComponent, reactive, ref, onMounted, onBeforeMount, nextTick } from 'vue'
import { CaptchaModalProps, CaptchaModalBlockPosition } from './props'
import { useI18n } from 'vue-i18n'
import { Tooltip } from 'ant-design-vue'
import { CloseCircleOutlined, ReloadOutlined, QuestionCircleOutlined } from '@ant-design/icons-vue'
import { getPrefixCls } from '../_utils/props'
import { $g, __MI_SITE__, __MI_POWERED__ } from '../../utils/global'
import { $tools } from '../../utils/tools'
import { $request } from '../../utils/request'
import type { ResponseData } from '../../utils/types'
import { useWindowResize } from '../../hooks/useWindowResize'
import { __LOGO__, __CAPTCHA_DEFAULT_BACKGRUOND__ } from '../../utils/images'
import MiLink from '../link/Link'
import applyTheme from '../_utils/theme'
import styled from './style/modal.module.less'

const MiCaptchaModal = defineComponent({
    name: 'MiCaptchaModal',
    inheritAttrs: false,
    props: CaptchaModalProps(),
    emits: ['close', 'update:open'],
    setup(props, { emit }) {
        const { width } = useWindowResize()
        const { t, te, locale } = useI18n()

        const modalRef = ref(null)
        const maskRef = ref(null)
        const contentRef = ref(null)
        const sliderRef = ref(null)
        const sliderBtnRef = ref(null)
        const imageRef = ref(null)
        const blockRef = ref(null)
        const resultRef = ref(null)
        const open = ref<boolean>(props.open)

        const params = reactive({
            anim: getPrefixCls('anim-scale'),
            loading: true,
            _background: null,
            background: __CAPTCHA_DEFAULT_BACKGRUOND__,
            site: __MI_SITE__,
            powered: __MI_POWERED__,
            check: {
                tries: props.maxTries || 5,
                num: 0,
                correct: false,
                tip: null,
                show: false,
                being: false,
                value: null
            },
            drag: {
                moving: false,
                originX: 0,
                originY: 0,
                offset: 0
            },
            size: {
                width: 260,
                height: 160
            },
            elements: {
                slider: null,
                block: null
            },
            block: {
                size: 42,
                radius: 8,
                PI: Math.PI,
                real: 0
            },
            ctx: {
                image: null,
                block: null
            },
            coordinate: {
                x: 0,
                y: 0,
                offset: 6
            },
            time: {
                start: null,
                end: null
            }
        })

        applyTheme(styled)

        const init = () => {
            params._background = props.image ?? params.background
            initModal()
        }

        const initModal = () => {
            params.elements = {
                slider: sliderBtnRef.value as HTMLElement,
                block: blockRef.value as HTMLElement
            }
            params.block.real = params.block.size + params.block.radius * 2 + 2
            setCheckData()
            initCaptcha()
            $tools.on(params.elements.slider, 'pointerdown', dragStart)
            $tools.on(params.elements.slider, 'touchstart', dragStart)
            $tools.on(params.elements.slider, 'pointermove', dragMoving)
            $tools.on(params.elements.slider, 'touchmove', dragMoving)
            $tools.on(params.elements.slider, 'pointerup', dragEnd)
            $tools.on(params.elements.slider, 'touchend', dragEnd)
        }

        const setCheckData = () => {
            params.check = {
                tries: props.maxTries || 5,
                num: 0,
                being: false,
                value: null,
                correct: false,
                tip: te('captcha.dragging') ? t('captcha.dragging') : 'Drag',
                show: false
            }
        }

        const initCaptcha = () => {
            const image = imageRef.value as HTMLCanvasElement
            const block = blockRef.value as HTMLCanvasElement
            const imageCtx = image ? image.getContext('2d', { willReadFrequently: true }) : null
            const blockCtx = block ? block.getContext('2d', { willReadFrequently: true }) : null
            params.ctx = { image: imageCtx, block: blockCtx }
            /**
             * 图片统一转为 base64, 避免跨域问题.
             * 也可采用xhr异步请求图片地址.
             * ```
             * if ($tools.isUrl(this.background)) {
             *     const xhr = new XMLHttpRequest()
             *     xhr.onload = function() {
             *         if (this.status === 200) {
             *             // 注意 this 指向.
             *             const url = URL.createObjectURL(this.response)
             *             params.background = url
             *             initImageElem()
             *             // ...
             *             URL.revokeObjectURL(url)
             *         }
             *     }
             *     xhr.open('GET', this.background, true)
             *     xhr.responseType = 'blob'
             *     xhr.send()
             * } else initImageElem()
             * ```
             */
            if ($tools.isUrl(params._background)) image2Base64(initImageElem)
            else initImageElem()
        }

        const image2Base64 = (callback: Function) => {
            const elem = new Image() as HTMLImageElement
            const canvas = document.createElement('canvas')
            const ctx = canvas.getContext('2d', {
                willReadFrequently: true
            }) as CanvasRenderingContext2D
            canvas.width = params.size.width
            canvas.height = params.size.height
            elem.crossOrigin = ''
            elem.src = params._background
            elem.onload = () => {
                ctx.drawImage(elem, 0, 0, params.size.width, params.size.height)
                params._background = canvas.toDataURL()
                callback && callback()
            }
        }

        const initImage = (elem: HTMLElement) => {
            if (params.ctx.image && params.ctx.block) {
                /** image */
                params.ctx.image.drawImage(elem, 0, 0, params.size.width, params.size.height)
                /** text */
                params.ctx.image.beginPath()
                params.ctx.image.fillStyle = '#FFF'
                params.ctx.image.shadowColor = 'transparent'
                params.ctx.image.shadowBlur = 0
                params.ctx.image.font = 'bold 24px MicrosoftYaHei'
                params.ctx.image.fillText(t('captcha.flatten'), 12, 30)
                params.ctx.image.font = '16px MicrosoftYaHei'
                params.ctx.image.fillText(t('captcha.verify'), 12, 55)
                params.ctx.image.closePath()
                /** block */
                params.ctx.block.save()
                params.ctx.block.globalCompositeOperation = 'destination-over'
                drawBlockPosition()
                params.ctx.block.drawImage(elem, 0, 0, params.size.width, params.size.height)
                /** image data */
                const coordinateY = params.coordinate.y - params.block.radius * 2 + 1
                const imageData = params.ctx.block.getImageData(
                    params.coordinate.x,
                    coordinateY,
                    params.block.real,
                    params.block.real
                )
                const block = blockRef.value as HTMLCanvasElement
                if (block) block.width = params.block.real
                params.ctx.block.putImageData(imageData, params.coordinate.offset, coordinateY)
                params.ctx.block.restore()
                params.loading = false
            }
        }

        const initImageElem = () => {
            const elem = new Image()
            elem.src = params._background
            elem.onload = () => initImage(elem)
        }

        const drawBlock = (
            ctx: CanvasRenderingContext2D,
            direction: CaptchaModalBlockPosition = undefined,
            operation: string
        ) => {
            ctx.beginPath()
            ctx.moveTo(params.coordinate.x, params.coordinate.y)
            const direct = direction?.direction
            const type = direction?.type
            /** top */
            if (direct === 'top') {
                ctx.arc(
                    params.coordinate.x + params.block.size / 2,
                    params.coordinate.y,
                    params.block.radius,
                    -params.block.PI,
                    0,
                    type === 'inner'
                )
            }
            ctx.lineTo(params.coordinate.x + params.block.size, params.coordinate.y)
            /** right */
            if (direct === 'right') {
                ctx.arc(
                    params.coordinate.x + params.block.size,
                    params.coordinate.y + params.block.size / 2,
                    params.block.radius,
                    1.5 * params.block.PI,
                    0.5 * params.block.PI,
                    type === 'inner'
                )
            }
            ctx.lineTo(
                params.coordinate.x + params.block.size,
                params.coordinate.y + params.block.size
            )
            /** bottom */
            ctx.arc(
                params.coordinate.x + params.block.size / 2,
                params.coordinate.y + params.block.size,
                params.block.radius,
                0,
                params.block.PI,
                true
            )
            ctx.lineTo(params.coordinate.x, params.coordinate.y + params.block.size)
            /** left */
            ctx.arc(
                params.coordinate.x,
                params.coordinate.y + params.block.size / 2,
                params.block.radius,
                0.5 * params.block.PI,
                1.5 * params.block.PI,
                true
            )
            ctx.lineTo(params.coordinate.x, params.coordinate.y)
            ctx.shadowColor = 'rgba(0, 0, 0, .001)'
            ctx.shadowBlur = 20
            ctx.lineWidth = 1.5
            ctx.fillStyle = 'rgba(0, 0, 0, .4)'
            ctx.strokeStyle = 'rgba(255, 255, 255, .8)'
            ctx.stroke()
            ctx.closePath()
            ctx[operation]()
        }

        const drawBlockPosition = () => {
            const x = $tools.randomNumberInRange(
                params.block.real + 20,
                params.size.width - (params.block.real + 20)
            )
            const y = $tools.randomNumberInRange(55, params.size.height - 55)
            const direction = drawBlockDirection()
            params.coordinate.x = x
            params.coordinate.y = y
            drawBlock(params.ctx.image, direction, 'fill')
            drawBlock(params.ctx.block, direction, 'clip')
        }

        const drawBlockDirection = (): CaptchaModalBlockPosition => {
            const direction = { top: 'top', right: 'right' }
            const from = ['inner', 'outer']
            const result: any = {}
            const keys = Object.keys(direction)
            const key = keys[Math.floor(Math.random() * keys.length)]
            result.direction = direction[key]
            result.type = from[Math.floor(Math.random() * from.length)]
            return result
        }

        const getBoundingClientRect = (elem: HTMLElement, specific = null) => {
            const rect = elem.getBoundingClientRect()
            if (specific && rect[specific]) return rect[specific]
            return rect
        }

        const dragStart = (evt: any) => {
            const x = evt.clientX || evt.touches[0].clientX
            const sliderRect = getBoundingClientRect(sliderRef.value as any)
            const sliderBtnRect = getBoundingClientRect(sliderBtnRef.value as any)
            params.drag.originX = Math.round(sliderRect.left * 10) / 10
            params.drag.originY = Math.round(sliderRect.top * 10) / 10
            params.drag.offset = Math.round((x - sliderBtnRect.left) * 10) / 10
            params.drag.moving = true
            params.time.start = Date.now()
        }

        const dragMoving = (evt: any) => {
            if (!params.drag.moving || params.check.being) return
            const x = evt.clientX || evt.touches[0].clientX
            const moveX = Math.round((x - params.drag.originX - params.drag.offset) * 10) / 10
            if (moveX < 0 || moveX + 54 >= params.size.width) {
                handleVerify()
                return false
            }
            params.elements.slider.style.left = `${moveX}px`
            params.elements.block.style.left = `${moveX}px`
            params.check.value = moveX
        }

        const dragEnd = () => {
            if (!params.drag.moving) return
            params.time.end = Date.now()
            handleVerify()
        }

        const dragReset = () => {
            params.elements.slider.style.left = 0
            params.elements.block.style.left = 0
            params.drag.originX = 0
            params.drag.originY = 0
        }

        const handleVerify = async () => {
            const coordinateX = Math.round(params.check.value + params.coordinate.offset)
            if (params.check.being) return
            params.check.being = true
            const error = (msg = null) => {
                setTimeout(() => dragReset(), 1000)
                params.check.num++
                params.check.correct = false
                if (msg) params.check.tip = msg
            }
            if (
                params.coordinate.x - props.offset <= coordinateX &&
                params.coordinate.x + props.offset >= coordinateX
            ) {
                const succcess = (data: any = {}) => {
                    setTimeout(() => handleClose('success', data), 400)
                }
                const take = Math.round((params.time.end - params.time.start) / 10) / 100
                params.check.tip = t('captcha.success', { take })
                if (props.verifyAction) {
                    if (typeof props.verifyAction === 'string') {
                        await $request[(props.verifyMethod || 'POST').toLowerCase()](
                            props.verifyAction,
                            props.verifyParams,
                            props.actionConfig
                        )
                            .then((res: ResponseData) => {
                                if (res?.ret?.code === 200) {
                                    params.check.correct = true
                                    succcess(res?.data)
                                }
                            })
                            .catch((err: any) => error(err?.message))
                    } else if (typeof props.verifyAction === 'function') {
                        const result = await props.verifyAction()
                        if (result === true) succcess()
                        else error(typeof result === 'string' ? result : null)
                    }
                } else {
                    params.check.correct = true
                    succcess()
                }
            } else error()
            const result = resultRef.value as HTMLElement
            if (result) result.style.bottom = '0'
            if (params.check.num <= params.check.tries) params.check.show = true
            setTimeout(() => {
                params.drag.moving = false
                if (result)
                    result.style.bottom =
                        (locale as unknown as string) === 'en-us'
                            ? $tools.convert2rem(-48)
                            : $tools.convert2rem(-32)
            }, 1000)
            setTimeout(() => {
                params.check.show = false
                params.check.being = false
                if (params.check.num >= params.check.tries) handleClose('frequently')
            }, 1600)
        }

        const handleClose = (status?: any, data?: any) => {
            params.loading = true
            if (typeof status !== 'string') status = 'close'
            if (props.maskClosable) {
                open.value = false
                emit('update:open', open.value)
                setTimeout(() => {
                    emit('close', { status, data })
                }, 400)
            }
        }

        const handleRefresh = () => {
            params.loading = true
            setCheckData()
            const block = blockRef.value as any
            block.width = params.size.width
            params.ctx.image.clearRect(0, 0, params.size.width, params.size.height)
            params.ctx.block.clearRect(0, 0, params.size.width, params.size.height)
            initImageElem()
        }

        const renderMaks = () => {
            return props.mask && open.value ? (
                <div
                    ref={maskRef}
                    class={`${styled.mask}${
                        width.value < $g.breakpoints.md ? ` ${styled.maskMobile}` : ''
                    }`}
                    onClick={handleClose}
                    style={{ zIndex: Date.now() }}
                />
            ) : null
        }

        const renderArrow = () => {
            const border = {
                borderColor: props.color
                    ? `transparent ${props.color} transparent transparent`
                    : null
            }
            return width.value >= $g.breakpoints.md && props.captchaVisible ? (
                <div class={styled.arrow}>
                    <div class={styled.arrowOut} style={border}></div>
                    <div class={styled.arrowIn} style={border}></div>
                </div>
            ) : null
        }

        const renderContentLoading = () => {
            return params.loading ? (
                <div class={styled.loading}>
                    <div class={styled.loadingSpinner}>
                        <div class={styled.loadingLoad}>
                            <div>
                                <div>
                                    <div style={{ borderColor: props.color ?? null }}></div>
                                    <div style={{ background: props.color ?? null }}></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div
                        class={styled.loadingTip}
                        innerHTML={te('captcha.loading') ? t('captcha.loading') : 'Loading ···'}
                    />
                </div>
            ) : null
        }

        const renderContentInfo = () => {
            return (
                <div class={styled.info}>
                    <canvas ref={imageRef} width={params.size.width} height={params.size.height} />
                    <canvas ref={blockRef} width={params.size.width} height={params.size.height} />
                </div>
            )
        }

        const renderContentResult = () => {
            return (
                <div
                    ref={resultRef}
                    class={`${styled.result} ${
                        params.check.correct ? `${styled.resultSuccess}` : `${styled.resultError}`
                    }`}
                    innerHTML={params.check.tip}
                />
            )
        }

        const renderSliderTrack = () => {
            return (
                <div class={styled.sliderTrack} style={{ borderColor: props.color ?? null }}>
                    <span
                        class={`${styled.sliderTrackTip}${
                            params.drag.moving ? ` ${styled.sliderTrackTipHide}` : ''
                        }`}>
                        {te('captcha.drag') ? t('captcha.drag') : 'Drag'}
                    </span>
                </div>
            )
        }

        const renderSliderBtn = () => {
            return (
                <div
                    ref={sliderBtnRef}
                    class={styled.sliderBtn}
                    style={{ borderColor: props.color ?? null }}>
                    <div class={styled.sliderBtnIcon} style={{ borderColor: props.color ?? null }}>
                        <div class={styled.sliderBtnVertical} />
                        <div
                            class={styled.sliderBtnHorizontal}
                            style={{ background: props.color ?? null }}
                        />
                    </div>
                </div>
            )
        }

        const renderPanelAction = () => {
            return (
                <div class={styled.panelAction}>
                    <Tooltip
                        title={te('captcha.close') ? t('captcha.close') : 'Close'}
                        color={props.color}
                        autoAdjustOverflow={false}
                        overlayClassName={styled.panelActionTooltip}
                        zIndex={Date.now()}>
                        <CloseCircleOutlined onClick={handleClose} />
                    </Tooltip>
                    <Tooltip
                        title={te('captcha.refresh') ? t('captcha.refresh') : 'Refresh'}
                        color={props.color}
                        autoAdjustOverflow={false}
                        overlayClassName={styled.panelActionTooltip}
                        zIndex={Date.now()}>
                        <ReloadOutlined onClick={handleRefresh} />
                    </Tooltip>
                    <Tooltip
                        title={te('captcha.feedback') ? t('captcha.feedback') : 'Feedback'}
                        color={props.color}
                        autoAdjustOverflow={false}
                        overlayClassName={styled.panelActionTooltip}
                        zIndex={Date.now()}>
                        <MiLink path={params.site} target="_blank">
                            <QuestionCircleOutlined />
                        </MiLink>
                    </Tooltip>
                </div>
            )
        }

        const renderPanelCopyright = () => {
            return (
                <div class={styled.panelCopyright}>
                    <div
                        class={styled.panelCopyrightText}
                        style={{ borderColor: props.color ?? null }}>
                        <Tooltip
                            title={te('captcha.provide') ? t('captcha.provide') : ''}
                            color={props.color}
                            autoAdjustOverflow={false}
                            overlayClassName={styled.panelActionTooltip}
                            zIndex={Date.now()}>
                            <MiLink path={params.site} target="_blank">
                                <img src={$g.logo || __LOGO__} alt={params.powered} />
                            </MiLink>
                        </Tooltip>
                    </div>
                </div>
            )
        }

        const renderContent = () => {
            return (
                <div
                    ref={contentRef}
                    class={styled.content}
                    style={{ borderColor: props?.color ?? null }}>
                    <div class={styled.contentInner}>
                        <div class={styled.embed}>
                            {renderContentLoading()}
                            {renderContentInfo()}
                            {renderContentResult()}
                        </div>
                        <div ref={sliderRef} class={styled.slider}>
                            {renderSliderTrack()}
                            {renderSliderBtn()}
                        </div>
                    </div>
                    <div class={styled.panel}>
                        {renderPanelAction()}
                        {renderPanelCopyright()}
                    </div>
                </div>
            )
        }

        onMounted(() => nextTick().then(() => init()))

        onBeforeMount(() => {
            $tools.off(params.elements.slider, 'pointerdown', dragStart)
            $tools.off(params.elements.slider, 'touchstart', dragStart)
            $tools.off(params.elements.slider, 'pointermove', dragMoving)
            $tools.off(params.elements.slider, 'touchmove', dragMoving)
            $tools.off(params.elements.slider, 'pointerup', dragEnd)
            $tools.off(params.elements.slider, 'touchend', dragEnd)
        })

        return () => (
            <>
                {renderMaks()}
                <Transition name={params.anim} appear={true}>
                    <div
                        ref={modalRef}
                        class={`${styled.container} ${getPrefixCls(`modal-${locale.value}`)}${
                            !params.check.correct && params.check.show ? ` ${styled.error}` : ''
                        }${width.value < $g.breakpoints.md ? ` ${styled.mobile}` : ''}`}
                        style={{
                            ...$tools.wrapPositionOrSpacing(props.position),
                            zIndex: Date.now()
                        }}
                        v-show={open.value}>
                        {renderArrow()}
                        {renderContent()}
                    </div>
                </Transition>
            </>
        )
    }
})

export default MiCaptchaModal
