import { defineComponent } from 'vue'
import { Tooltip } from 'ant-design-vue'
import {
    PictureOutlined, CloseCircleOutlined, ScanOutlined,
    ReloadOutlined, QuestionCircleOutlined
} from '@ant-design/icons-vue'
import PropTypes from '../../utils/props'
import { $MI_HOME, $MI_ARATAR, $MI_POWERED } from '../../utils/config'
import { $tools } from '../../utils/tools'

const prefixCls = $tools.getPrefixCls('captcha-modal')
const selectors = {
    modal: prefixCls,
    image: `${prefixCls}-image`,
    block: `${prefixCls}-block`,
    slider: `${prefixCls}-slider`,
    mask: `${prefixCls}-mask`,
    result: `${prefixCls}-result`,
    content: `${prefixCls}-content`
}

export default defineComponent({
    name: 'MiCaptchaModal',
    props: {
        position: PropTypes.object,
        tries: PropTypes.number.def(5),
        show: PropTypes.bool.def(false),
        background: PropTypes.string,
        onModalClose: PropTypes.func
    },
    emits: ['onModalClose'],
    data() {
        return {
            events: {},
            eventName: null,
            loading: true,
            ctx: {
                image: null,
                block: null,
            },
            time: {
                start: null,
                end: null
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
            check: {},
            _background: null
        }
    },
    watch: {
        show(value: boolean) {
            if (value) {
                this.$nextTick(() => {
                    this.initModal()
                })
            }
        }
    },
    created() {
        this.eventName = `${prefixCls}-event`
    },
    beforeUnmount() {
        this.$tools.off(this.elements.slider, 'pointerdown', this.dragStart)
        this.$tools.off(this.elements.slider, 'touchstart', this.dragStart)
        this.$tools.off(this.elements.slider, 'pointermove', this.dragMoving)
        this.$tools.off(this.elements.slider, 'touchmove', this.dragMoving)
        this.$tools.off(this.elements.slider, 'pointerup', this.dragEnd)
        this.$tools.off(this.elements.slider, 'touchend', this.dragEnd)
    },
    mounted() {
        this.initModal()
    },
    methods: {
        initModal() {
            this._background = this.background
            this.init()
        },
        init() {
            const slider = this.$refs[`${selectors.slider}-btn`]
            const block = this.$refs[selectors.block]
            this.elements = {slider, block}
            this.block.real = this.block.size + this.block.radius * 2 + 2
            this.setCheckData()
            this.initCaptcha()
            this.initMask()
            this.$tools.on(this.elements.slider, 'pointerdown', this.dragStart)
            this.$tools.on(this.elements.slider, 'touchstart', this.dragStart)
            this.$tools.on(this.elements.slider, 'pointermove', this.dragMoving)
            this.$tools.on(this.elements.slider, 'touchmove', this.dragMoving)
            this.$tools.on(this.elements.slider, 'pointerup', this.dragEnd)
            this.$tools.on(this.elements.slider, 'touchend', this.dragEnd)
        },
        initCaptcha() {
            const image = this.$refs[selectors.image]
            const block = this.$refs[selectors.block]
            const imageCtx = image ? image.getContext('2d') : null
            const blockCtx = block ? block.getContext('2d') : null
            this.ctx = {image: imageCtx, block: blockCtx}
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
            if (this.$g.regExp.url.test(this._background)) this.imageToBase64(this.initImageElem)
            else this.initImageElem()
        },
        initImage(elem: HTMLElement) {
            if (
                this.ctx.image &&
                this.ctx.block
            ) {
                /** image */
                this.ctx.image.drawImage(
					elem,
					0,
					0,
					this.size.width,
					this.size.height
                )
                /** text */
                this.ctx.image.beginPath()
                this.ctx.image.fillStyle = '#FFF'
				this.ctx.image.shadowColor = 'transparent'
				this.ctx.image.shadowBlur = 0
				this.ctx.image.font = 'bold 24px MicrosoftYaHei'
				this.ctx.image.fillText('拖动滑块拼合图片', 12, 30)
				this.ctx.image.font = '16px MicrosoftYaHei'
				this.ctx.image.fillText('就能验证成功哦', 12, 55)
                this.ctx.image.closePath()
                /** block */
                this.ctx.block.save()
                this.ctx.block.globalCompositeOperation = 'destination-over'
                this.drawBlockPosition()
				this.ctx.block.drawImage(
                    elem,
                    0,
                    0,
                    this.size.width,
                    this.size.height
                )
                /** image data */
                const coordinateY = this.coordinate.y - this.block.radius * 2 + 1
                const imageData = this.ctx.block.getImageData(
                    this.coordinate.x,
                    coordinateY,
                    this.block.real,
                    this.block.real
                )
                const block = this.$refs[selectors.block]
                block.width = this.block.real
                this.ctx.block.putImageData(
                    imageData,
                    this.coordinate.offset,
                    coordinateY
                )
                this.ctx.block.restore()
                this.loading = false
            }
        },
        initImageElem() {
            const elem = new Image()
            elem.src = this._background
            elem.onload = () => this.initImage(elem)
        },
        imageToBase64(callback: Function) {
            const elem = new Image()
            const canvas = document.createElement('canvas')
            const ctx = canvas.getContext('2d')
            canvas.width = this.size.width
            canvas.height = this.size.height
            elem.crossOrigin = ''
            elem.src = this._background
            elem.onload = () => {
                ctx.drawImage(
                    elem,
                    0,
                    0,
                    this.size.width,
                    this.size.height
                )
                this._background = canvas.toDataURL()
                if (callback) callback.apply(this)
            }
        },
        drawBlock(
            ctx: CanvasRenderingContext2D,
            direction: any = {},
            operation: string
        ) {
            ctx.beginPath()
            ctx.moveTo(this.coordinate.x, this.coordinate.y)
            const direct = direction.direction
            const type = direction.type
            /** top */
            if (direct === 'top') {
                ctx.arc(
                    this.coordinate.x + this.block.size / 2,
                    this.coordinate.y,
                    this.block.radius,
                    -this.block.PI,
                    0,
                    type === 'inner'
                )
            }
            ctx.lineTo(this.coordinate.x + this.block.size, this.coordinate.y)
            /** right */
            if (direct === 'right') {
                ctx.arc(
                    this.coordinate.x + this.block.size,
                    this.coordinate.y + this.block.size / 2,
                    this.block.radius,
                    1.5 * this.block.PI,
                    0.5 * this.block.PI,
                    type === 'inner'
                )
            }
            ctx.lineTo(this.coordinate.x + this.block.size, this.coordinate.y + this.block.size)
            /** bottom */
            ctx.arc(
                this.coordinate.x + this.block.size / 2,
                this.coordinate.y + this.block.size,
                this.block.radius,
                0,
                this.block.PI,
                true
            )
            ctx.lineTo(this.coordinate.x, this.coordinate.y + this.block.size)
            /** left */
            ctx.arc(
                this.coordinate.x,
                this.coordinate.y + this.block.size / 2,
                this.block.radius,
                0.5 * this.block.PI,
                1.5 * this.block.PI,
                true
            )
            ctx.lineTo(this.coordinate.x, this.coordinate.y)
            ctx.shadowColor = 'rgba(0, 0, 0, .001)'
            ctx.shadowBlur = 20
            ctx.lineWidth = 1.5
            ctx.fillStyle = 'rgba(0, 0, 0, .4)'
            ctx.strokeStyle = 'rgba(255, 255, 255, .8)'
            ctx.stroke()
            ctx.closePath()
            ctx[operation]()
        },
        drawBlockPosition() {
            const x = this.$tools.randomNumberInRange(
                this.block.real + 20,
                this.size.width - (this.block.real + 20)
            )
            const y = this.$tools.randomNumberInRange(55, this.size.height - 55)
            const direction = this.drawBlockDirection()
            this.coordinate.x = x
            this.coordinate.y = y
            this.drawBlock(this.ctx.image, direction, 'fill')
            this.drawBlock(this.ctx.block, direction, 'clip')
        },
        drawBlockDirection() {
            const direction = {top: 'top', right: 'right'}
            const from = ['inner', 'outer']
            const result: any = {}
            const keys = Object.keys(direction)
            const key = keys[Math.floor(Math.random() * keys.length)]
            result.direction = direction[key]
            result.type = from[Math.floor(Math.random() * from.length)]
            return result
        },
        setCheckData() {
            this.check = {
                tries: this.tries ?? 5,
                num: 0,
                being: false,
                value: null,
                correct: false,
                tip: '拖动滑块将悬浮图像正确拼合',
                show: false
            }
        },
        initMask(drop = false) {
            if (drop) {
                const elem = document.getElementById(selectors.mask)
				if (elem) elem.remove()
            } else {
                const elem = document.createElement('div')
                elem.className = selectors.mask
                elem.id = selectors.mask
                document.body.appendChild(elem)
                this.$nextTick(() => {
                    this.$tools.on(elem, 'click', () => {
                        this.close()
                    })
                })
            }
        },
        dragStart(event: any) {
            const x = event.clientX || event.touches[0].clientX
            const sliderRef = this.$refs[selectors.slider]
            const sliderBtnRef = this.$refs[`${selectors.slider}-btn`]
            const sliderRect = this.getBoundingClientRect(sliderRef)
            const sliderBtnRect = this.getBoundingClientRect(sliderBtnRef)
            this.drag.originX = Math.round(sliderRect.left * 10) / 10
            this.drag.originY = Math.round(sliderRect.top * 10) / 10
            this.drag.offset = Math.round((x - sliderBtnRect.left) * 10) / 10
            this.drag.moving = true
            this.time.start = Date.now()
        },
        dragMoving(event: any) {
            if (!this.drag.moving || this.check.being) return
            const x = event.clientX || event.touches[0].clientX
            const moveX = Math.round((x - this.drag.originX - this.drag.offset) * 10) / 10
            if (moveX < 0 || moveX + 54 >= this.size.width) {
                this.checkVerificationCode()
                return false
            }
            this.elements.slider.style.left = `${moveX}px`
            this.elements.block.style.left = `${moveX}px`
            this.check.value = moveX
        },
        dragEnd() {
            if (!this.drag.moving) return
            this.time.end = Date.now()
            this.checkVerificationCode()
        },
        dragReset() {
            this.elements.slider.style.left = 0
            this.elements.block.style.left = 0
            this.drag.originX = 0
            this.drag.originY = 0
        },
        async checkVerificationCode() {
            const coordinateX = Math.round(this.check.value + this.coordinate.offset)
            if (this.check.being) return
            this.check.being = true
            const error = (msg = null) => {
                setTimeout(() => {
                    this.dragReset()
                }, 1000)
                this.check.num++
                this.check.correct = false
                if (msg) this.check.tip = msg
            }
            if (
                this.coordinate.x - 1 <= coordinateX &&
                this.coordinate.x + 1 >= coordinateX
            ) {
                const key = this.$storage.get(this.$g.caches.storages.captcha.login)
                await this.$http.post(this.action ?? this.api.captcha.verification, {key}).then((res: any) => {
                    if (res.ret.code === 1) {
                        const taking = Math.round(((this.time.end - this.time.start) / 10)) / 100
                        this.check.tip = `${taking}s速度完成图片拼合验证`
                        this.check.correct = true
                        setTimeout(() => {
                            this.close('success', res.data)
                        }, 600)
                    } else error(res.ret.message)
                }).catch((err: any) => {
                    error(err.message)
                })
            } else error()
            this.$refs[selectors.result].style.bottom = 0
            if (this.check.num <= this.check.tries) this.check.show = true
            setTimeout(() => {
                this.drag.moving = false
                this.$refs[selectors.result].style.bottom = '-32px'
            }, 1000)
            setTimeout(() => {
                this.check.show = false
                this.check.being = false
                if (this.check.num >= this.check.tries) this.close('frequently')
            }, 1600)
        },
        refreshCaptcha() {
            this.loading = true
            this.setCheckData()
            const block = this.$refs[selectors.block]
            block.width = this.size.width
            this.ctx.image.clearRect(0, 0, this.size.width, this.size.height)
            this.ctx.block.clearRect(0, 0, this.size.width, this.size.height)
            this.initImageElem()
        },
        close(status = 'close', data = {}) {
            this.initMask(true)
            this.loading = true
            if (typeof status !== 'string') status = 'close'
            this.$emit('modalClose', {
                event: 'close',
                status,
                data
            })
        },
        getBoundingClientRect(elem: HTMLElement, specific = null) {
            const rect = elem.getBoundingClientRect()
            if (specific && rect[specific]) return rect[specific]
            return rect
        },
        getArrowElem() {
            const arrowCls = `${prefixCls}-arrow`
            return !this.$g.mobile ? (
                <div class={arrowCls}>
                    <div class={`${arrowCls}-out`}></div>
                    <div class={`${arrowCls}-in`}></div>
                </div>
            ) : null
        },
        getContentElem() {
            const contentCls = `${prefixCls}-content`
            const sliderCls = `${prefixCls}-slider`
            return (
                <div class={contentCls} ref={contentCls}>
                    <div class={`${prefixCls}-wrap`}>
                        <div class={`${prefixCls}-embed`}>
                            { this.getContentLoadingElem() }
                            { this.getContentInfoElem() }
                            { this.getContentResultElem() }
                        </div>
                        <div ref={sliderCls}
                            class={`${sliderCls}${this.drag.moving ? ` ${sliderCls}-moving` : ''}`}>
                            { this.getSliderTrackElem() }
                            { this.getSliderBtnElem() }
                        </div>
                    </div>
                    <div class={`${prefixCls}-panel`}>
                        { this.getPanelActionElem() }
                        { this.getPanelCopyrightElem() }
                    </div>
                </div>
            )
        },
        getContentLoadingElem() {
            const loadingCls = `${prefixCls}-loading`
            return this.loading ? (
                <div class={loadingCls}>
                    <PictureOutlined />
                    <div class={`${loadingCls}-tip`}>正在加载 ...</div>
                </div>
            ) : null
        },
        getContentInfoElem() {
            return (
                <div class={`${prefixCls}-info`}>
                    <canvas
                        width={this.size.width}
                        height={this.size.height}
                        ref={`${prefixCls}-image`}>
                    </canvas>
                    <canvas
                        width={this.size.width}
                        height={this.size.height}
                        ref={`${prefixCls}-block`}>
                    </canvas>
                </div>
            )
        },
        getContentResultElem() {
            const resultCls = `${prefixCls}-result`
            const cls = `${resultCls} ${this.check.correct ? `${resultCls}-success` : `${resultCls}-error`}`
            return <div class={cls} ref={resultCls} innerHTML={this.check.tip}></div>
        },
        getSliderTrackElem() {
            const sliderTrackCls = `${prefixCls}-slider-track`
            return (
                <div class={sliderTrackCls}>
                    <span class={`${sliderTrackCls}-tip`}>拖动左边滑块完成上方拼图</span>
                </div>
            )
        },
        getSliderBtnElem() {
            const sliderBtnCls = `${prefixCls}-slider-btn`
            return (
                <div class={sliderBtnCls} ref={sliderBtnCls}>
                    <ScanOutlined />
                </div>
            )
        },
        getPanelActionElem() {
            const panelActionCls = `${prefixCls}-panel-action`
            return (
                <div class={panelActionCls}>
                    <Tooltip placement="top" title="关闭验证">
                        <CloseCircleOutlined onClick={this.close} />
                    </Tooltip>
                    <Tooltip placement="top" title="刷新验证">
                        <ReloadOutlined onClick={this.refreshCaptcha} />
                    </Tooltip>
                    <Tooltip placement="top" title="帮助反馈">
                        <a href={$MI_HOME} target="_blank">
                            <QuestionCircleOutlined />
                        </a>
                    </Tooltip>
                </div>
            )
        },
        getPanelCopyrightElem() {
            const copyrightCls = `${prefixCls}-copyright`
            return (
                <div class={copyrightCls}>
                    <div class={`${copyrightCls}-text`}>
                        <Tooltip placement="top" title={$MI_POWERED}>
                            <a href={$MI_HOME} target="_blank">
                                <img src={$MI_ARATAR} alt={$MI_POWERED} />
                            </a>
                        </Tooltip>
                        <span>提供技术支持</span>
                    </div>
                </div>
            )
        }
    },
    render() {
        const style = {top: `${this.position.top}px`, left: `${this.position.left}px`}
        const cls = `${prefixCls}${
            !this.check.correct && this.check.show
                ? ` ${prefixCls}-error`
                : ''
        }`
        return this.show ? (
            <div class={cls} style={style} ref={prefixCls}>
                { this.getArrowElem() }
                { this.getContentElem() }
            </div>
        ) : null
    }
})