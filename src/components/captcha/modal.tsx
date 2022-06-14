import { defineComponent, ref, reactive, onMounted, onBeforeUnmount, Transition } from 'vue'
import { Tooltip } from 'ant-design-vue'
import { CloseCircleOutlined, ReloadOutlined, QuestionCircleOutlined } from '@ant-design/icons-vue'
import { useI18n } from 'vue-i18n'
import PropTypes from '../_utils/props-types'
import { getPrefixCls } from '../_utils/props-tools'
import { $tools } from '../../utils/tools'
import { $g } from '../../utils/global'
import { $request } from '../../utils/request'

const BACKGROUND = 'https://file.makeit.vip/MIIT/M00/00/00/ajRkHV7d0JOAJYSMAAFwUxGzMIc287.jpg'
const POWERED = 'Powered By makeit.vip'
const AVATAR = 'https://file.makeit.vip/MIIT/M00/00/00/ajRkHV_pUyOALE2LAAAtlj6Tt_s370.png'
const TARGET = 'https://admin.makeit.vip/components/captcha'

export const captchaModalProps = () => ({
    prefixCls: PropTypes.string,
    show: PropTypes.bool.def(false),
    image: PropTypes.string,
    position: PropTypes.object,
    mask: PropTypes.bool.def(true),
    maskClosable: PropTypes.bool.def(true),
    themeColor: PropTypes.string,
    bgColor: PropTypes.string,
    boxShadow: PropTypes.bool.def(true),
    boxShadowColor: PropTypes.string,
    boxShadowBlur: PropTypes.number.def(6),
    maxTries: PropTypes.number.def(5),
    verifyParams: PropTypes.object.def({}),
    verifyMethod: PropTypes.string.def('post'),
    verifyAction: PropTypes.string
})

export default defineComponent({
    name: 'MiCaptchaModal',
    inheritAttrs: false,
    props: captchaModalProps(),
    emits: ['modalClose'],
    setup(props, {emit}) {
        const { t, locale } = useI18n()
        const prefixCls = getPrefixCls('captcha-modal', props.prefixCls)
        const langCls = getPrefixCls(`lang-${locale.value}`, props.prefixCls)
        const animation = getPrefixCls('anim-scale')

        const modalRef = ref<InstanceType<typeof HTMLElement>>(null)
        const maskRef = ref<InstanceType<typeof HTMLElement>>(null)
        const contentRef = ref<InstanceType<typeof HTMLElement>>(null)
        const sliderRef = ref<InstanceType<typeof HTMLElement>>(null)
        const sliderBtnRef = ref<InstanceType<typeof HTMLElement>>(null)
        const imageRef = ref<InstanceType<typeof HTMLElement>>(null)
        const blockRef = ref<InstanceType<typeof HTMLElement>>(null)
        const resultRef = ref<InstanceType<typeof HTMLElement>>(null)

        const show = ref<boolean>(props.show)

        const classes = {
            modal: prefixCls,
            image: `${prefixCls}-image`,
            block: `${prefixCls}-block`,
            slider: `${prefixCls}-slider`,
            mask: `${prefixCls}-mask`,
            result: `${prefixCls}-result`,
            content: `${prefixCls}-content`
        }
        const params = reactive({
            loading: true,
            background: BACKGROUND,
            avatar: AVATAR,
            powered: POWERED,
            target: TARGET,
            ctx: {
                image: null,
                block: null
            },
            elements: {
                slider: null,
                block: null
            },
            coordinate: {
                x: 0,
                y: 0,
                offset: 6
            },
            size: {
                width: 260,
                height: 160
            },
            block: {
                size: 42,
                radius: 8,
                PI: Math.PI,
                real: 0
            },
            drag: {
                moving: false,
                originX: 0,
                originY: 0,
                offset: 0
            },
            time: {
                start: null,
                end: null
            },
            check: {
                tries: props.maxTries ?? 5,
                num: 0,
                correct: false,
                show: false,
                tip: null,
                being: false,
                value: null
            },
            _background: null
        })

        onMounted(() => {
            init()
        })

        onBeforeUnmount(() => {
            $tools.off(params.elements.slider, 'pointerdown', dragStart)
            $tools.off(params.elements.slider, 'touchstart', dragStart)
            $tools.off(params.elements.slider, 'pointermove', dragMoving)
            $tools.off(params.elements.slider, 'touchmove', dragMoving)
            $tools.off(params.elements.slider, 'pointerup', dragEnd)
            $tools.off(params.elements.slider, 'touchend', dragEnd)
        })

        const init = () => {
            params._background = props.image ?? params.background
            initModal()
        }

        const initModal = () => {
            params.elements = {
                slider: sliderBtnRef.value,
                block: blockRef.value
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
                tries: props.maxTries ?? 5,
                num: 0,
                being: false,
                value: null,
                correct: false,
                tip: t('captcha.dragging'),
                show: false
            }
        }

        const initCaptcha = () => {
            const image = imageRef.value as HTMLCanvasElement
            const block = blockRef.value as HTMLCanvasElement
            const imageCtx = image ? image.getContext('2d') : null
            const blockCtx = block ? block.getContext('2d') : null
            params.ctx = {image: imageCtx, block: blockCtx}
            /**
             * 图片统一转为 base64, 避免跨域问题.
             * 也可采用xhr异步请求图片地址.
             * ```
             * if (this.$g.regExp.url.test(this.background)) {
             *     const xhr = new XMLHttpRequest();
             *     xhr.onload = function() {
             *         if (this.status === 200) {
             *             // 注意 this 指向.
             *             const url = URL.createObjectURL(this.response);
             *             vm.background = url;
             *             vm.initImageElem();
             *             // ...
             *             URL.revokeObjectURL(url);
             *         }
             *     }
             *     xhr.open('GET', this.background, true);
             *     xhr.responseType = 'blob';
             *     xhr.send();
             * } else {
             *     this.initImageElem();
             * }
             * ```
             */
             if ($g.regExp.url.test(params._background)) image2Base64(initImageElem)
             else initImageElem()
        }

        const refreshCaptcha = () => {
            params.loading = true
            setCheckData()
            const block = blockRef.value as HTMLCanvasElement
            block.width = params.size.width
            params.ctx.image.clearRect(0, 0, params.size.width, params.size.height)
            params.ctx.block.clearRect(0, 0, params.size.width, params.size.height)
            initImageElem()
        }

        const closeModal = (status?:any, data?: any) => {
            params.loading = true
            if (typeof status !== 'string') status = 'close'
            if (props.maskClosable) {
                show.value = false
                setTimeout(() => {
                    emit('modalClose', {
                        status,
                        data
                    })
                }, 400)
            }
        }

        const image2Base64 = (callback: Function) => {
            const elem = new Image()
            const canvas = document.createElement('canvas')
            const ctx = canvas.getContext('2d')
            canvas.width = params.size.width
            canvas.height = params.size.height
            elem.crossOrigin = ''
            elem.src = params._background
            elem.onload = () => {
                ctx.drawImage(
                    elem,
                    0,
                    0,
                    params.size.width,
                    params.size.height
                )
                params._background = canvas.toDataURL()
                callback && callback()
            }
        }

        const initImage = (elem: HTMLElement) => {
            if (
                params.ctx.image &&
                params.ctx.block
            ) {
                /** image */
                params.ctx.image.drawImage(
					elem,
					0,
					0,
					params.size.width,
					params.size.height
                )
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
				params.ctx.block.drawImage(
                    elem,
                    0,
                    0,
                    params.size.width,
                    params.size.height
                )
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
                params.ctx.block.putImageData(
                    imageData,
                    params.coordinate.offset,
                    coordinateY
                )
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
            direction: any = {},
            operation: string
        ) => {
            ctx.beginPath()
            ctx.moveTo(params.coordinate.x, params.coordinate.y)
            const direct = direction.direction
            const type = direction.type
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
            ctx.lineTo(params.coordinate.x + params.block.size, params.coordinate.y + params.block.size)
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

        const drawBlockDirection = () => {
            const direction = {top: 'top', right: 'right'}
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
            const sliderRect = getBoundingClientRect(sliderRef.value)
            const sliderBtnRect = getBoundingClientRect(sliderBtnRef.value)
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
                checkVerificationCode()
                return false
            }
            params.elements.slider.style.left = `${moveX}px`
            params.elements.block.style.left = `${moveX}px`
            params.check.value = moveX
        }

        const dragEnd = () => {
            if (!params.drag.moving) return
            params.time.end = Date.now()
            checkVerificationCode()
        }

        const dragReset = () => {
            params.elements.slider.style.left = 0
            params.elements.block.style.left = 0
            params.drag.originX = 0
            params.drag.originY = 0
        }

        const checkVerificationCode = async () => {
            const coordinateX = Math.round(params.check.value + params.coordinate.offset)
            if (params.check.being) return
            params.check.being = true
            const error = (msg = null) => {
                setTimeout(() => {
                    dragReset()
                }, 1000)
                params.check.num++
                params.check.correct = false
                if (msg) params.check.tip = msg
            }
            if (
                params.coordinate.x - 2 <= coordinateX &&
                params.coordinate.x + 2 >= coordinateX
            ) {
                const succcess = (data: any = {}) => {
                    setTimeout(() => {
                        closeModal('success', data)
                    }, 500)
                }
                const take = Math.round(((params.time.end - params.time.start) / 10)) / 100
                params.check.tip = t('captcha.success', {take})
                if (props.verifyAction) {
                    await $request[props.verifyParams.toLowerCase()](props.verifyAction, props.verifyParams).then((res: any) => {
                        const response = res.data
                        if (response.ret.code === 1) {
                            params.check.correct = true
                            succcess(response.data)
                        } else error(response.ret.message)
                    }).catch((err: any) => {
                        error(err.message)
                    })
                } else {
                    params.check.correct = true
                    succcess()
                }
            } else error()
            const result = resultRef.value
            if (result) result.style.bottom = '0'
            if (params.check.num <= params.check.tries) params.check.show = true
            setTimeout(() => {
                params.drag.moving = false
                if (result) result.style.bottom = locale.value === 'en-us' ? $tools.convert2Rem(-48) : $tools.convert2Rem(-32)
            }, 1000)
            setTimeout(() => {
                params.check.show = false
                params.check.being = false
                if (params.check.num >= params.check.tries) closeModal('frequently')
            }, 1600)
        }

        const renderMask = () => {
            return props.mask && props.show ? (
                <div class={classes.mask} onClick={closeModal} ref={maskRef} />
            ) : null
        }

        const renderArrow = () => {
            const arrowCls = `${prefixCls}-arrow`
            const style = {
                borderColor: props.themeColor
                    ? `transparent ${props.themeColor} transparent transparent`
                    : null
            }
            return (
                <div class={arrowCls}>
                    <div class={`${arrowCls}-out`} style={style} />
                    <div class={`${arrowCls}-in`} style={style} />
                </div>
            )
        }

        const renderContent = () => {
            const style = {
                borderColor: props.themeColor ?? null,
                background: props.bgColor ?? null,
                boxShadow:
                    props.boxShadow && (props.boxShadowColor || props.themeColor)
                        ? `0 0 ${$tools.convert2Rem(props.boxShadowBlur)} ${
                              props.boxShadowColor || props.themeColor
                          }`
                        : null
            }
            return (
                <div class={classes.content} style={style} ref={contentRef}>
                    <div class={`${prefixCls}-wrap`}>
                        <div class={`${prefixCls}-embed`}>
                            {renderContentLoading()}
                            {renderContentInfo()}
                            {renderContentResult()}
                        </div>
                        <div ref={sliderRef}
                            class={`${classes.slider}${
                                params.drag.moving ? ` ${classes.slider}-moving` : ''
                            }`}>
                            {renderSliderTrack()}
                            {renderSliderBtn()}
                        </div>
                    </div>
                    <div class={`${prefixCls}-panel`}>
                        {renderPanelAction()}
                        {renderPanelCopyright()}
                    </div>
                </div>
            )
        }

        const renderContentLoading = () => {
            const loadingCls = `${prefixCls}-loading`
            const style1 = { borderColor: props.themeColor ?? null }
            const style2 = { background: props.themeColor ?? null }
            return params.loading ? (
                <div class={loadingCls}>
                    <div class={`${loadingCls}-spinner`}>
                        <div class="load">
                            <div>
                                <div>
                                    <div style={style1}></div>
                                    <div style={style2}></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class={`${loadingCls}-tip`}>{t('captcha.loading')}</div>
                </div>
            ) : null
        }

        const renderContentInfo = () => {
            return (
                <div class={`${prefixCls}-info`}>
                    <canvas
                        width={params.size.width}
                        height={params.size.height}
                        ref={imageRef}></canvas>
                    <canvas
                        width={params.size.width}
                        height={params.size.height}
                        ref={blockRef}></canvas>
                </div>
            )
        }

        const renderContentResult = () => {
            const cls = `${classes.result} ${
                params.check.correct ? `${classes.result}-success` : `${classes.result}-error`
            }`
            return <div class={cls} ref={resultRef} innerHTML={params.check.tip}></div>
        }

        const renderSliderTrack = () => {
            const sliderTrackCls = `${classes.slider}-track`
            const style = { borderColor: props.themeColor ?? null }
            return (
                <div class={sliderTrackCls} style={style}>
                    <span class={`${sliderTrackCls}-tip${params.drag.moving ? ' hide' : ''}`}>
                        {t('captcha.drag')}
                    </span>
                </div>
            )
        }

        const renderSliderBtn = () => {
            const sliderBtnCls = `${classes.slider}-btn`
            const style = { borderColor: props.themeColor ?? null }
            return (
                <div class={sliderBtnCls} style={style} ref={sliderBtnRef}>
                    <div class={`${sliderBtnCls}-icon`} style={style}>
                        <div class={`${sliderBtnCls}-vertical`} />
                        <div class={`${sliderBtnCls}-horizontal`}
                            style={{ background: props.themeColor ?? null }} />
                    </div>
                </div>
            )
        }

        const renderPanelAction = () => {
            const panelActionCls = `${prefixCls}-panel-action`
            return (
                <div class={panelActionCls}>
                    <Tooltip
                        title={t('captcha.close')}
                        autoAdjustOverflow={false}
                        overlayClassName={`${prefixCls}-tooltip`}
                        color={props.themeColor}>
                        <CloseCircleOutlined onClick={closeModal} />
                    </Tooltip>

                    <Tooltip
                        title={t('captcha.refresh')}
                        autoAdjustOverflow={false}
                        overlayClassName={`${prefixCls}-tooltip`}
                        color={props.themeColor}>
                        <ReloadOutlined onClick={refreshCaptcha} />
                    </Tooltip>

                    <Tooltip
                        title={t('captcha.feedback')}
                        autoAdjustOverflow={false}
                        overlayClassName={`${prefixCls}-tooltip`}
                        color={props.themeColor}>
                        <a href={params.target} target="_blank">
                            <QuestionCircleOutlined />
                        </a>
                    </Tooltip>
                </div>
            )
        }

        const renderPanelCopyright = () => {
            const copyrightCls = `${prefixCls}-copyright`
            return (
                <div class={copyrightCls}>
                    <div class={`${copyrightCls}-text`}>
                        {
                            locale.value === 'en-us' ? (
                                <>
                                    <Tooltip
                                        title={t('captcha.provide')}
                                        autoAdjustOverflow={false}
                                        overlayClassName={`${prefixCls}-tooltip`}
                                        color={props.themeColor}>
                                        <a href={params.target} target="_blank">
                                            <img src={params.avatar} alt={params.powered} />
                                        </a>
                                    </Tooltip>
                                </>
                            ) : (
                                <>
                                    <a href={params.target} target="_blank">
                                        <img src={params.avatar} alt={params.powered} />
                                    </a>
                                    <span>{t('captcha.provide')}</span>
                                </>
                            )
                        }
                    </div>
                </div>
            )
        }

        return () => (
            <>
                {renderMask()}
                <Transition name={animation} appear={true}>
                    <div class={`${prefixCls} ${langCls}${
                            !params.check.correct && params.check.show
                                ? ` ${prefixCls}-error`
                                : ''
                        }`}
                        style={{
                            top: `${$tools.convert2Rem(props.position.top)}`,
                            left: `${$tools.convert2Rem(props.position.left)}`
                        }}
                        v-show={show.value}
                        ref={modalRef}>
                        {renderArrow()}
                        {renderContent()}
                    </div>
                </Transition>
            </>
        )
    }
})
