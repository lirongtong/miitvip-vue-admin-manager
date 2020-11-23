import { defineComponent } from 'vue'
import { MediumOutlined } from '@ant-design/icons-vue'
import PropTypes from '../../utils/props'

export default defineComponent({
    name: 'MiCaptchaModal',
    props: {
        position: PropTypes.object,
        show: PropTypes.bool.def(false)
    },
    emits: ['update:show'],
    data() {
        return {
            loading: false,
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
            check: {}
        }
    },
    methods: {
        getPrefixCls() {
            return this.$tools.getPrefixCls('captcha-modal')
        },
        getArrowElem() {
            const prefixCls = this.getPrefixCls()
            return !this.$g.mobile ? (
                <div class={`${prefixCls}-arrow`}>
                    <div class={`${prefixCls}-arrow-out`}></div>
                    <div class={`${prefixCls}-arrow-in`}></div>
                </div>
            ) : null
        },
        getContentElem() {
            const prefixCls = this.getPrefixCls()
            return (
                <div class={`${prefixCls}-content`} ref={`${prefixCls}-content`}>
                    <div class={`${prefixCls}-wrap`}>
                        <div class={`${prefixCls}-embed`}>
                            { this.getContentLoadingElem() }
                            { this.getContentInfoElem() }
                            { this.getContentResultElem() }
                        </div>
                        <div class={`${prefixCls}-slider`}>
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
            const prefixCls = this.getPrefixCls()
            return this.loading ? (
                <div class={`${prefixCls}-loading`}>
                    <MediumOutlined />
                    <div class={`${prefixCls}-loading-tip`}>正在加载 ...</div>
                </div>
            ) : null
        },
        getContentInfoElem() {
            const prefixCls = this.getPrefixCls()
            return (
                <div class={`${prefixCls}-info`}>
                    <canvas width={this.size.width} height={this.size.height} ref={`${prefixCls}-image`}></canvas>
                    <canvas width={this.size.width} height={this.size.height} ref={`${prefixCls}-block`}></canvas>
                </div>
            )
        },
        getContentResultElem() {
            const prefixCls = this.getPrefixCls()
            const cls = `${prefixCls}-result ${this.check.correct ? `${prefixCls}-result-success` : `${prefixCls}-result-error`}`
            return (<div class={cls} ref={`${prefixCls}-result`} innerHTML={this.check.tip}></div>)
        },
        getSliderTrackElem() {},
        getSliderBtnElem() {},
        getPanelActionElem() {},
        getPanelCopyrightElem() {}
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