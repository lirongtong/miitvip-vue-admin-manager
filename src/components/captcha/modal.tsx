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
        show: PropTypes.bool.def(false),
        background: PropTypes.string
    },
    emits: ['update:show'],
    data() {
        return {
            prefixCls: null,
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
            tries: 0,
            check: {},
            _background: null
        }
    },
    created() {
        this.prefixCls = this.getPrefixCls()
    },
    mounted() {
        this._background = this.background
        this.init()
    },
    methods: {
        init() {
            const slider = this.$refs[selectors.slider]
            const block = this.$refs[selectors.block]
            this.elements = {slider, block}
            this.block.real = this.block.size + this.block.radius * 2 + 2
            this.setCheckData()
            this.initCaptcha()
            this.initMask()
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
            const block = this.$refs[selectors.block]
            if (this.ctx.image) {
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
                this.drawBlockPosition()
                this.ctx.image.drawImage(
					elem,
					0,
					0,
					this.size.width,
					this.size.height
				)
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
                block.width = this.block.real
                this.ctx.block.putImageData(
                    imageData,
                    this.coordinate.offset,
                    coordinateY
                )
                this.loading = false
            }
        },
        initImageElem() {
            const elem = new Image()
            elem.src = this._background
            elem.onload = () => {
                this.initImage(elem)
            }
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
            ctx.globalCompositeOperation = 'destination-over'
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
            ctx.shadowColor = '#000'
            ctx.shadowBlur = 10
            ctx.lineWidth = 1
            ctx.fillStyle = 'rgba(0, 0, 0, .4)'
            ctx.strokeStyle = 'rgba(255, 255, 255, .8)'
            ctx.stroke()
            ctx[operation]()
            ctx.closePath()
        },
        drawBlockPosition() {
            const x = this.$tools.randomNumberInRange(
                this.block.real + 20,
                this.size.width - (this.block.real + 20)
            )
            const y = this.$tools.randomNumberInRange(55, this.size.height - 55)
            const direction = this.drawBlockDirection()
            this.coordinate = {x, y}
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
        close(status = 'close', data = {}) {
            this.$emit('update:show', !this.show)
            this.initMask(true)

        },
        getPrefixCls() {
            return this.$tools.getPrefixCls('captcha-modal')
        },
        getArrowElem() {
            const arrowCls = `${this.prefixCls}-arrow`
            return !this.$g.mobile ? (
                <div class={arrowCls}>
                    <div class={`${arrowCls}-out`}></div>
                    <div class={`${arrowCls}-in`}></div>
                </div>
            ) : null
        },
        getContentElem() {
            const contentCls = `${this.prefixCls}-content`
            const sliderCls = `${this.prefixCls}-slider`
            return (
                <div class={contentCls} ref={contentCls}>
                    <div class={`${this.prefixCls}-wrap`}>
                        <div class={`${this.prefixCls}-embed`}>
                            { this.getContentLoadingElem() }
                            { this.getContentInfoElem() }
                            { this.getContentResultElem() }
                        </div>
                        <div class={`${sliderCls}${this.drag.moving ? ` ${sliderCls}-moving` : ''}`}>
                            { this.getSliderTrackElem() }
                            { this.getSliderBtnElem() }
                        </div>
                    </div>
                    <div class={`${this.prefixCls}-panel`}>
                        { this.getPanelActionElem() }
                        { this.getPanelCopyrightElem() }
                    </div>
                </div>
            )
        },
        getContentLoadingElem() {
            const loadingCls = `${this.prefixCls}-loading`
            return this.loading ? (
                <div class={loadingCls}>
                    <PictureOutlined />
                    <div class={`${loadingCls}-tip`}>正在加载 ...</div>
                </div>
            ) : null
        },
        getContentInfoElem() {
            return (
                <div class={`${this.prefixCls}-info`}>
                    <canvas
                        width={this.size.width}
                        height={this.size.height}
                        ref={`${this.prefixCls}-image`}>
                    </canvas>
                    <canvas
                        width={this.size.width}
                        height={this.size.height}
                        ref={`${this.prefixCls}-block`}>
                    </canvas>
                </div>
            )
        },
        getContentResultElem() {
            const resultCls = `${this.prefixCls}-result`
            const cls = `${resultCls} ${this.check.correct ? `${resultCls}-success` : `${resultCls}-error`}`
            return (<div class={cls} ref={resultCls} innerHTML={this.check.tip}></div>)
        },
        getSliderTrackElem() {
            const sliderTrackCls = `${this.prefixCls}-slider-track`
            return (
                <div class={sliderTrackCls}>
                    <span class={`${sliderTrackCls}-tip`}>拖动左边滑块完成上方拼图</span>
                </div>
            )
        },
        getSliderBtnElem() {
            const sliderRef = `${this.prefixCls}-slider`
            const sliderBtnCls = `${this.prefixCls}-slider-btn`
            return (
                <div class={sliderBtnCls} ref={sliderRef}>
                    <ScanOutlined />
                </div>
            )
        },
        getPanelActionElem() {
            const panelActionCls = `${this.prefixCls}-panel-action`
            return (
                <div class={panelActionCls}>
                    <Tooltip placement="top" title="关闭验证">
                        { () => <CloseCircleOutlined /> }
                    </Tooltip>
                    <Tooltip placement="top" title="刷新验证">
                        { () => <ReloadOutlined /> }
                    </Tooltip>
                    <Tooltip placement="top" title="帮助反馈">
                        { () => <QuestionCircleOutlined /> }
                    </Tooltip>
                </div>
            )
        },
        getPanelCopyrightElem() {
            const copyrightCls = `${this.prefixCls}-copyright`
            return (
                <div class={copyrightCls}>
                    <div class={`${copyrightCls}-text`}>
                        <Tooltip placement="top" title={$MI_POWERED}>
                            { () => (
                                <a href={$MI_HOME} target="_blank">
                                    <img src={$MI_ARATAR} alt={$MI_POWERED} />
                                </a>
                            ) }
                        </Tooltip>
                        <span>提供技术支持</span>
                    </div>
                </div>
            )
        }
    },
    render() {
        const prefixCls = this.getPrefixCls()
        const style = {top: `${this.position.top}px`, left: `${this.position.left}px`}
        return this.show ? (
            <div class={prefixCls} style={style} ref={prefixCls}>
                { this.getArrowElem() }
                { this.getContentElem() }
            </div>
        ) : null
    }
})