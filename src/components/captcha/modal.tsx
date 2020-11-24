import { defineComponent } from 'vue'
import { Tooltip } from 'ant-design-vue'
import {
    MediumOutlined, CloseCircleOutlined,
    ReloadOutlined, QuestionCircleOutlined
} from '@ant-design/icons-vue'
import PropTypes from '../../utils/props'
import { $MI_HOME, $MI_ARATAR, $MI_POWERED } from '../../utils/config'

export default defineComponent({
    name: 'MiCaptchaModal',
    props: {
        position: PropTypes.object,
        show: PropTypes.bool.def(false)
    },
    emits: ['update:show'],
    data() {
        return {
            prefixCls: null,
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
    created() {
        this.prefixCls = this.getPrefixCls()
    },
    methods: {
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
                    <MediumOutlined />
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

                </div>
            )
        },
        getPanelActionElem() {
            const panelActionCls = `${this.prefixCls}-panel-action`
            return (
                <div class={panelActionCls}>
                    <Tooltip placement="top" title="关闭验证">
                        <CloseCircleOutlined />
                    </Tooltip>
                    <Tooltip placement="top" title="刷新验证">
                        <ReloadOutlined />
                    </Tooltip>
                    <Tooltip placement="top" title="帮助反馈">
                        <QuestionCircleOutlined />
                    </Tooltip>
                </div>
            )
        },
        getPanelCopyrightElem() {
            const copyrightCls = `${this.prefixCls}-copyright`
            return (
                <div class={copyrightCls}>
                    <div class={`${copyrightCls}-text`}>
                        <a href={$MI_HOME} target="_blank">
                            <img src={$MI_ARATAR} alt={$MI_POWERED} />
                        </a>
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