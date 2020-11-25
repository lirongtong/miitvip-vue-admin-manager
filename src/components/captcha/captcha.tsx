import { defineComponent, Teleport } from 'vue'
import { message } from 'ant-design-vue'
import { AimOutlined, MoreOutlined } from '@ant-design/icons-vue'
import PropTypes from '../../utils/props'
import { $MI_HOME, $MI_POWERED, $MI_ARATAR } from '../../utils/config'
import CaptchaModal from './modal'

export default defineComponent({
    name: 'MiCaptcha',
    emits: ['onSuccess'],
    props: {
        width: PropTypes.number,
        height: PropTypes.number,
        radius: PropTypes.number,
        themeColor: PropTypes.string,
        logo: PropTypes.string,
        text: PropTypes.string,
        background: PropTypes.string,
        image: PropTypes.string,
        getImageAction: PropTypes.string,
        maxTries: PropTypes.number.def(5),
        initAction: PropTypes.string,
        verifyAction: PropTypes.string,
        onSuccess: PropTypes.func
    },
    data() {
        return {
            init: false,
            failed: false,
            tip: this.text ? JSON.parse(JSON.stringify(this.text)) : '正在初始化验证码 ...',
            status: {
                ready: true,
                scanning: false,
                being: false,
                success: false
            },
            offset: {
                top: 20,
                left: 38
            },
            modal: {
                show: false,
                _temp: null,
                position: {}
            }
        }
    },
    computed: {
        getThemeStyle() {
            return this.themeColor ? {
                backgroundColor: this.themeColor,
                boxShadow: `inset 0 0 0 1px ${this.themeColor}`
            } : null;
        }
    },
    methods: {
        initCaptcha() {
            // this.$http.get(this.initAction ?? this.api.captcha.init).then((res: any) => {
            //     if (res.ret.code === 1) {
            //         this.failed = false
            //         this.init = true
            //         this.tip = '点击按钮进行验证'
            //         this.$storage.set(this.$g.caches.storages.captcha.login, res.data.key)
            //     } else {
            //         this.init = false
            //         this.failed = true
            //         this.tip = '验证码初始化失败，请刷新后再试'
            //     }
            // }).catch(() => {
            //     this.failed = true
            //     this.init = false
            //     this.tip = '初始化接口有误，请稍候再试'
            // })
            this.failed = false
            this.init = true
            this.tip = '点击按钮进行验证'
        },
        showCaptcha() {
            if (!this.init || this.status.success) return
            this.tip = '智能检测中 ...'
            this.status.ready = false
            this.status.scanning = true
            if (
                this.getImageAction &&
                this.$g.regExp.url.test(this.getImageAction)
            ) {
                this.$http.get(this.getImageAction).then((res: any) => {
                    this.initCaptchaModal(res.data)
                }).catch((err: any) => {
                    message.destroy()
                    message.warn({
                        content: `图片获取失败 ( ${err.message} )`,
                        duration: 3
                    })
                    this.initCaptchaModal()
                })
            } else this.initCaptchaModal()
        },
        initCaptchaModal(background?: string) {
            background = background ?? this.$g.background.captcha
            this.status.scanning = false
            this.status.being = true
            this.modal.position = this.getCaptchaModalPosition()
            this.modal.show = true
            this.tip = '请完成验证'
        },
        handleCaptchaModalClose(data: any) {
            switch (data.status) {
                case 'success':
                    this.success(data.data)
                    break
                case 'close':
                    this.reset()
                    break
                case 'frequently':
                    this.reset()
                    message.destroy()
                    message.warning({
                        content: '错误次数太过频繁，请稍候再试',
                        duration: 3
                    })
                    break
            }
        },
        saveCaptchaModal(elem: any) {
            this.modal._temp = elem
        },
        getCaptchaModalPosition() {
            const elem = this.$refs['mi-captcha']
            const rect = elem.getBoundingClientRect()
            const top = Math.round(rect.top * 1000) / 1000 + this.offset.top
            const left = Math.round(rect.left * 1000) / 1000 + this.offset.left
            return { top, left }
        },
        success(data: any) {
            this.tip = '通过验证'
            this.$emit('onSuccess', data)
            setTimeout(() => {
                this.modal.show = false
                this.status.being = false
                this.status.success = true
            }, 500)
        },
        reset() {
            this.modal.show = false
            this.status.being = false
            this.status.success = false
            this.status.scanning = false
            this.status.ready = true
            this.tip = '点击按钮进行验证'
        },
        windowResize() {
            const position = this.getCaptchaModalPosition()
            this.modal.position = position
        },
        getPrefixCls() {
            return this.$tools.getPrefixCls('captcha')
        },
        getRadarElem() {
            const prefixCls = this.getPrefixCls()
            const cls = `${prefixCls}-radar${this.status.success ? ` ${prefixCls}-radar-pass` : ''}`
            const style = {
                borderRadius: this.radius ? `${this.radius}px` : null,
                background: this.background
            }
            return (
                <div class={cls} style={style}>
                    { this.getRadarReadyElem() }
                    { this.getRadarScanElem() }
                    { this.getRadarBeingElem() }
                    { this.getRadarTipElem() }
                    { this.getRadarLogoElem() }
                </div>
            )
        },
        getRadarReadyElem() {
            const prefixCls = this.getPrefixCls()
            return this.status.ready ? (
                <div class={`${prefixCls}-radar-ready`}>
                    <div class={`${prefixCls}-radar-ring`} style={this.getThemeStyle}></div>
                    <div class={`${prefixCls}-radar-dot`} style={this.getThemeStyle} ref={`${prefixCls}-radar-dot`}></div>
                </div>
            ) : null
        },
        getRadarScanElem() {
            const prefixCls = this.getPrefixCls()
            return this.status.scanning ? (
                <div class={`${prefixCls}-radar-scan`}>
                    <AimOutlined />
                </div>
            ) : null
        },
        getRadarBeingElem() {
            const prefixCls = this.getPrefixCls()
            return this.status.being ? (
                <div class={`${prefixCls}-radar-being`}>
                    <MoreOutlined />
                </div>
            ) : null
        },
        getRadarTipElem() {
            const prefixCls = this.getPrefixCls()
            const cls =  `${prefixCls}-radar-tip${this.failed ? ` ${prefixCls}-radar-tip-error` : ''}`
            return (<div class={cls} innerHTML={this.tip}></div>)
        },
        getRadarLogoElem() {
            const prefixCls = this.getPrefixCls()
            return (
                <div class={`${prefixCls}-radar-logo`}>
                    <a href={$MI_HOME} target="_blank">
                        <img src={this.logo ?? $MI_ARATAR} alt={$MI_POWERED} />
                    </a>
                </div>
            )
        }
    },
    beforeUnmount() {
        this.$tools.off(window, 'resize', this.windowResize)
    },
    mounted() {
        this.initCaptcha()
        this.$tools.on(window, 'resize', this.windowResize)
    },
    render() {
        const prefixCls = this.getPrefixCls()
        const cls = `${prefixCls}${this.$g.mobile ? ` ${prefixCls}-mobile` : ''}`
        const modal = this.modal.show || this.modal._temp ? (
            <Teleport to={document.body} ref={this.saveCaptchaModal}>
                <CaptchaModal
                    position={this.modal.position}
                    tries={this.maxTries}
                    background={this.background ?? this.$g.background.captcha}
                    onModalClose={this.handleCaptchaModalClose}
                    show={this.modal.show}>
                </CaptchaModal>
            </Teleport>
        ) : null
        const style = {width: `${this.width}px`, height: `${this.height}px`}
        return (
            <div class={cls} onClick={this.showCaptcha} ref={prefixCls}>
                <div class={`${prefixCls}-form`}></div>
                <div class={`${prefixCls}-content`} style={style}>
                    { this.getRadarElem() }
                </div>
                { modal }
            </div>
        )
    }
})