import { defineComponent, Teleport } from 'vue'
import axios from 'axios'
import { VerifiedOutlined } from '@ant-design/icons-vue'
import CaptchaModal from './modal'
import PropTypes from '../../utils/props'

export default defineComponent({
    name: 'MiCaptcha',
    props: {
        width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).def(320),
        height: PropTypes.number,
        radius: PropTypes.number.def(4),
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
        onSuccess: PropTypes.func,
        onInit: PropTypes.func,
        onChecked: PropTypes.func
    },
    computed: {
        getThemeColorStyle() {
            return this.themeColor ? {
                backgroundColor: this.themeColor,
                boxShadow: `inset 0 0 0 1px ${this.themeColor}`
            } : null;
        }
    },
    data() {
        return {
            prefixCls: 'mi-captcha',
            target: 'https://admin.makeit.vip/components/captcha',
            avatar: 'https://file.makeit.vip/MIIT/M00/00/00/ajRkHV_pUyOALE2LAAAtlj6Tt_s370.png',
            powered: 'Powered By makeit.vip',
            init: false,
            failed: false,
            pass: false,
            tip: this.initAction ? '正在初始化验证码 ...' : '点击按钮进行验证',
            msgTimer: null,
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
                position: {},
                _instance: null
            }
        }
    },
    beforeUnmount() {
        this.$tools.off(window, 'resize', this.resize)
        this.closeCaptchaModal({status: 'close'})
    },
    mounted() {
        this.initCaptcha()
        this.$tools.on(window, 'resize', this.resize)
    },
    methods: {
        initCaptcha() {
            if (this.initAction) {
                this.tip = '正在初始化验证码 ...'
                axios.get(this.initAction, this.initParams).then((res: any) => {
                    this.failed = false
                    this.init = true
                    this.tip = '点击按钮进行验证'
                    this.$emit('init', res.data)
                }).catch(() => {
                    this.init = false
                    this.failed = true
                    this.tip = '初始化接口有误，请稍候再试'
                })
            } else {
                this.failed = false
                this.init = true
                this.tip = '点击按钮进行验证'
            }
        },
        showCaptchaModal() {
            if (!this.init || this.status.success) return
            this.tip = '智能检测中 ...'
            this.status.ready = false
            this.status.scanning = true
            if (this.checkAction) {
                axios.post(this.checkAction, this.checkParams).then((res: any) => {
                    if (res.data.pass) this.pass = true
                    else this.initCaptchaModal()
                    this.$emit('checked', res.data)
                }).catch(() => {
                    this.pass = false
                    this.initCaptchaModal()
                })
            } else this.initCaptchaModal()
        },
        closeCaptchaModal(data: any) {
            if (data) {
                if (data.status === 'close') this.reset()
                if (data.status === 'success') this.success()
                if (data.status === 'frequently') {
                    this.reset()
                    this.showMessage(`已连续错误达 ${this.maxTries} 次，请稍候再试`, 5)
                }
            }
        },
        initCaptchaModal(image?: string) {
            image = image ?? this.image
            this.status.scanning = false
            this.status.being = true
            this.modal.position = this.getCaptchaModalPosition()
            this.modal.show = true
            this.tip = '请移动滑块，完成验证'
        },
        showMessage(msg = '错误提示', duration = 3) {
            const name = 'mi-captcha-message'
            const exist = document.getElementById(name)
            if (exist) exist.remove()
            const elem = document.createElement('div')
            elem.id = name
            elem.className = name
            elem.innerHTML = `<div class="${name}-content"><i class="mi-icon icon-close"></i><span>${msg}</span></div>`
            document.body.appendChild(elem)
            if (this.msgTimer) clearTimeout(this.msgTimer)
            this.msgTimer = setTimeout(() => {
                elem.remove()
            }, duration * 1000)
        },
        success(data: any) {
            this.tip = '通过验证'
            this.$emit('success', data)
            setTimeout(() => {
                this.modal.show = false
                this.status.being = false
                this.status.success = true
            })
        },
        reset() {
            this.modal.show = false
            this.status.being = false
            this.status.success = false
            this.status.scanning = false
            this.status.ready = true
            this.tip = '点击按钮进行验证'
        },
        resize() {
            this.modal.position = this.getCaptchaModalPosition()
        },
        getCaptchaModalPosition() {
            const elem = this.$refs[this.prefixCls]
            const rect = elem.getBoundingClientRect()
            const top = Math.round(rect.top * 1000) / 1000 + this.offset.top
            const left = Math.round(rect.left * 1000) / 1000 + this.offset.left
            return { top, left }
        },
        saveCaptchaModal(elem: any) {
            this.modal._instance = elem
        },
        getRadarReadyElem() {
            return this.status.ready ? (
                <div class={`${this.prefixCls}-radar-ready`}>
                    <div
                        class={`${this.prefixCls}-radar-ring`}
                        style={this.getThemeColorStyle}>
                    </div>
                    <div
                        class={`${this.prefixCls}-radar-dot`}
                        style={this.getThemeColorStyle}
                        ref={`${this.prefixCls}-radar-dot`}>
                    </div>
                </div>
            ) : null
        },
        getRadarScanElem() {
            const borderColor = this.themeColor ? `${this.themeColor} transparent ${this.themeColor} transparent` : null
            const borderColor2 = this.themeColor ? `transparent ${this.themeColor} transparent ${this.themeColor}` : null
            return this.status.scanning ? (
                <div class={`${this.prefixCls}-radar-scan`}>
                    <div class="double-ring">
                        <div style={{borderColor}}></div>
                        <div style={{borderColor: borderColor2}}></div>
                    </div>
                </div>
            ) : null
        },
        getRadarBeingElem() {
            return this.status.being ? (
                <div class={`${this.prefixCls}-radar-being`}>...</div>
            ) : null
        },
        getRadarSuccessElem() {
            const iconStyle = {
                fontSize: `${this.$tools.pxToRem(20)}rem`,
                color: this.themeColor ?? null
            }
            return this.status.success ? (
                <div class={`${this.prefixCls}-radar-success ${this.prefixCls}-radar-success-icon`}>
                    <VerifiedOutlined style={iconStyle} />
                </div>
            ) : null
        },
        getRadarTipElem() {
            const error = this.failed ? ` ${this.prefixCls}-radar-tip-error` : ''
            const cls =  `${this.prefixCls}-radar-tip${error}`
            const style = {
                height: this.height ? `${this.$tools.pxToRem(this.height)}rem` : null,
                color: this.status.success && this.themeColor ? this.themeColor : null
            }
            return <div class={cls} style={style} innerHTML={this.tip}></div>
        },
        getRadarLogoElem() {
            const height = this.height && this.height > 40 ? this.height : null
            const top = Math.round((height - 20) / 2 * 100) / 100 - 1
            const style = {top: height ? `${this.$tools.pxToRem(top)}rem` : null}
            return (
                <div class={`${this.prefixCls}-radar-logo`} style={style}>
                    <a href={this.target} target="_blank">
                        <img src={this.logo ?? this.avatar} alt={this.powered} />
                    </a>
                </div>
            )
        },
        getRadarElem() {
            const cls = `${this.prefixCls}-radar${this.status.success
                ? ` ${this.prefixCls}-radar-pass`
                : ''}`
            const style = {
                borderRadius: this.radius
                    ? `${this.$tools.pxToRem(this.radius)}rem`
                    : null,
                borderColor: this.borderColor ?? this.themeColor ?? null,
                backgroundColor: this.bgColor ?? null,
                boxShadow: this.boxShadow
                    ? this.boxShadowColor || this.themeColor
                        ? `0 0 ${this.$tools.pxToRem(this.boxShadowBlur)}rem ${this.boxShadowColor || this.themeColor}`
                        : 'none'
                    : 'none'
            }
            return (
                <div class={cls} style={style}>
                    { this.getRadarReadyElem() }
                    { this.getRadarScanElem() }
                    { this.getRadarBeingElem() }
                    { this.getRadarSuccessElem() }
                    { this.getRadarTipElem() }
                    { this.getRadarLogoElem() }
                </div>
            )
        },
        getSuccessShowElem() {
            const hex = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/
            const rgb = /^(rgb|RGB)/
            const cls = `${this.prefixCls}-success${this.status.success ? ` ${this.prefixCls}-success-show` : ''}`
            let backgroundColor = this.themeColor ? (
                hex.test(this.themeColor)
                    ? this.$tools.colorHexToRgba(this.themeColor, 0.2)
                    : (rgb.test(this.themeColor) ? (
                        this.$tools.colorHexToRgba(this.$tools.colorRgbToHex(this.themeColor), 0.2)
                    ) : this.themeColor)
            ) : null
            const style = {
                borderRadius: this.radius ? `${this.radius}px` : null,
                background: backgroundColor,
                borderColor: this.themeColor ?? null
            }
            return (<div class={cls} style={style}></div>)
        },
        resetStatus() {
            this.status.being = false
            this.status.success = false
            this.status.scanning = false
            this.status.ready = true
        }
    },
    render() {
        const cls = `${this.prefixCls}${this.$tools.isMobile() ? ` ${this.prefixCls}-mobile` : ''}`
        const width = this.$tools.isNumber(this.width)
            ? `${this.$tools.pxToRem(this.width)}rem`
            : this.width ? (/%/g.test(this.width)
                ? this.width
                : `${this.$tools.pxToRem(parseInt(this.width))}rem`) : null
        const height = this.$tools.isNumber(this.height)
            ? `${this.$tools.pxToRem(this.height)}rem`
            : this.height ? (/%/g.test(this.height)
                ? this.height : `${this.$tools.pxToRem(this.height)}rem`)
                : null
        const style = {width, height}
        const modal = this.modal.show || this.modal._instance ? (
            <Teleport to={document.body} ref={this.saveCaptchaModal}>
                <CaptchaModal
                    position={this.modal.position}
                    maxTries={this.maxTries}
                    show={this.modal.show}
                    mask={this.mask}
                    maskClosable={this.maskClosable}
                    boxShadow={this.modalBoxShadow}
                    boxShadowBlur={this.modalBoxShadowBlur}
                    boxShadowColor={this.modalBoxShadowColor}
                    themeColor={this.themeColor}
                    bgColor={this.modalBgColor}
                    verifyParams={this.verifyParams}
                    verifyAction={this.verifyAction}
                    onModalClose={this.closeCaptchaModal}
                    image={this.image}>
                </CaptchaModal>
            </Teleport>
        ) : null
        return (
            <div class={cls} onClick={this.showCaptchaModal} ref={this.prefixCls} key={this.prefixCls}>
                <div class={`${this.prefixCls}-content`} style={style}>
                    { this.getRadarElem() }
                    { this.getSuccessShowElem() }
                </div>
                { modal }
            </div>
        )
    }
})