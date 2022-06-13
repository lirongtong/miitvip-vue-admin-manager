import { defineComponent, ref, reactive } from 'vue'
import { Tooltip } from 'ant-design-vue'
import { CloseCircleOutlined, ReloadOutlined, QuestionCircleOutlined } from '@ant-design/icons-vue'
import { useI18n } from 'vue-i18n'
import PropTypes from '../_utils/props-types'
import { getPrefixCls } from '../_utils/props-tools'
import { $tools } from '../../utils/tools'

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
    verifyAction: PropTypes.string
})

export default defineComponent({
    name: 'MiCaptchaModal',
    inheritAttrs: false,
    props: captchaModalProps(),
    emits: ['modalClose'],
    setup(props) {
        const { t } = useI18n()
        const prefixCls = getPrefixCls('captcha-modal', props.prefixCls)

        const maskRef = ref<InstanceType<typeof HTMLDivElement>>(null)
        const contentRef = ref<InstanceType<typeof HTMLDivElement>>(null)
        const imageRef = ref<InstanceType<typeof HTMLDivElement>>(null)
        const blockRef = ref<InstanceType<typeof HTMLDivElement>>(null)
        const resultRef = ref<InstanceType<typeof HTMLDivElement>>(null)

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
                block: null,
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
                correct: false,
                show: false,
                tip: null
            }
        })

        const getMask = () => {
            return props.mask && props.show ? (
                <div class={classes.mask}
                    onClick={handleModalClose}
                    ref={maskRef} />
            ) : null
        }

        const getArrow = () => {
            const arrowCls = `${prefixCls}-arrow`
            const inStyle = {
                borderColor: props.bgColor
                    ? `transparent ${props.bgColor} transparent transparent`
                    : null
            }
            const outStyle = {
                borderColor: props.themeColor
                    ? `transparent ${props.themeColor} transparent transparent`
                    : null
            }
            return (
                <div class={arrowCls}>
                    <div class={`${arrowCls}-out`} style={outStyle} />
                    <div class={`${arrowCls}-in`} style={inStyle} />
                </div>
            )
        }

        const getContent = () => {
            const style = {
                borderColor: props.themeColor ?? null,
                background: props.bgColor ?? null,
                boxShadow: props.boxShadow && (props.boxShadowColor || props.themeColor)
                    ? `0 0 ${$tools.convert2Rem(props.boxShadowBlur)} ${props.boxShadowColor || props.themeColor}`
                    : null
            }
            return (
                <div class={classes.content} style={style} ref={contentRef}>
                    <div class={`${prefixCls}-wrap`}>
                        <div class={`${prefixCls}-embed`}>
                            { getContentLoading() }
                            { getContentInfo() }
                            { getContentResult() }
                        </div>
                        <div class={`${classes.slider}${params.drag.moving ? ` ${classes.slider}-moving` : ''}`} ref={classes.slider}>
                            { getSliderTrack() }
                            { getSliderBtn() }
                        </div>
                    </div>
                    <div class={`${prefixCls}-panel`}>
                        { getPanelAction() }
                        { getPanelCopyright() }
                    </div>
                </div>
            )
        }

        const getContentLoading = () => {
            const loadingCls = `${prefixCls}-loading`
            const style1 = {borderColor: props.themeColor ?? null}
            const style2 = {background: props.themeColor ?? null}
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

        const getContentInfo = () => {
            return (
                <div class={`${prefixCls}-info`}>
                    <canvas
                        width={params.size.width}
                        height={params.size.height}
                        ref={imageRef}>
                    </canvas>
                    <canvas
                        width={params.size.width}
                        height={params.size.height}
                        ref={blockRef}>
                    </canvas>
                </div>
            )
        }

        const getContentResult = () => {
            const cls = `${classes.result} ${params.check.correct ? `${classes.result}-success` : `${classes.result}-error`}`
            return (
                <div class={cls} ref={resultRef} innerHTML={params.check.tip}></div>
            )
        }

        const getSliderTrack = () => {
            const sliderTrackCls = `${classes.slider}-track`
            const style = {borderColor: props.themeColor ?? null}
            return (
                <div class={sliderTrackCls} style={style}>
                    <span class={`${sliderTrackCls}-tip${params.drag.moving ? ' hide' : ''}`}>{t('captcha.drag')}</span>
                </div>
            )
        }

        const getSliderBtn = () => {
            const sliderBtnCls = `${classes.slider}-btn`
            const style = {borderColor: props.themeColor ?? null}
            return (
                <div class={sliderBtnCls} style={style} ref={sliderBtnCls}>
                    <div class={`${sliderBtnCls}-icon`} style={style}>
                        <div class={`${sliderBtnCls}-vertical`} />
                        <div class={`${sliderBtnCls}-horizontal`}
                            style={{background: props.themeColor ?? null}} />
                    </div>
                </div>
            )
        }

        const getPanelAction = () => {
            const panelActionCls = `${prefixCls}-panel-action`
            return (
                <div class={panelActionCls}>
                    <Tooltip title={t('captcha.close')}
                        autoAdjustOverflow={false}
                        color={props.themeColor}>
                            <CloseCircleOutlined onClick={handleModalClose} />
                    </Tooltip>

                    <Tooltip title={t('captcha.refresh')}
                        autoAdjustOverflow={false}
                        color={props.themeColor}>
                            <ReloadOutlined onClick={handleModalClose} />
                    </Tooltip>

                    <Tooltip title={t('captcha.feedback')}
                        autoAdjustOverflow={false}
                        color={props.themeColor}>
                            <a href={params.target} target="_blank">
                                <QuestionCircleOutlined />
                            </a>
                    </Tooltip>
                </div>
            )
        }

        const getPanelCopyright = () => {
            const copyrightCls = `${prefixCls}-copyright`
            return (
                <div class={copyrightCls}>
                    <div class={`${copyrightCls}-text`}>
                        <a href={params.target} target="_blank">
                            <img src={params.avatar} alt={params.powered} />
                        </a>
                        <span>{t('captcha.provide')}</span>
                    </div>
                </div>
            )
        }

        const handleModalClose = () => {}

        return props.show ? () => (
            <>
                {getMask()}
                <div class={`${prefixCls}${
                    !params.check.correct && params.check.show
                        ? ` ${prefixCls}-error` : ''
                }`} style={{
                    top: `${$tools.convert2Rem(props.position.top)}`,
                    left: `${$tools.convert2Rem(props.position.left)}`
                }} ref={prefixCls}>
                    { getArrow() }
                    { getContent() }
                </div>
            </>
        ) : null
    }
})