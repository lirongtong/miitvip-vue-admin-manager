import { Transition, defineComponent, reactive, ref, computed } from 'vue'
import { CaptchaModalProps } from './props'
import { useI18n } from 'vue-i18n'
import { getPrefixCls } from '../_utils/props'
import { $tools } from '../../utils/tools'
import applyTheme from '../_utils/theme'
import styled from './style/modal.module.less'

const MiCaptchaModal = defineComponent({
    name: 'MiCaptchaModal',
    inheritAttrs: false,
    props: CaptchaModalProps(),
    emits: ['close'],
    setup(props, { emit }) {
        const { t, te, locale } = useI18n()

        const modalRef = ref(null)
        const maskRef = ref(null)
        const contentRef = ref(null)
        const sliderRef = ref(null)
        const sliderBtnRef = ref(null)
        const imageRef = ref(null)
        const blockRef = ref(null)
        const resultRef = ref(null)

        const open = computed(() => {
            return props.open
        })

        const params = reactive({
            anim: getPrefixCls('anim-scale'),
            loading: true,
            check: {
                tries: props.maxTries || 5,
                num: 0,
                correct: false,
                tip: null,
                show: false,
                being: false,
                value: null
            }
        })
        applyTheme(styled)

        const handleClose = () => {}

        const renderMaks = () => {
            return props.mask && open.value ? (
                <div
                    ref={maskRef}
                    class={styled.mask}
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
            return (
                <div class={styled.arrow}>
                    <div class={styled.arrowOut} style={border}></div>
                    <div class={styled.arrowIn} style={border}></div>
                </div>
            )
        }

        const renderContentLoading = () => {
            return params.loading ? (
                <div class={styled.loading}>
                    <div class={styled.loadingSpinning}>
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

        const renderContentInfo = () => {}

        const renderContent = () => {
            return (
                <div ref={contentRef} class={styled.content}>
                    <div class={styled.contentInner}>
                        <div class={styled.contentEmbed}>
                            {renderContentLoading()}
                            {renderContentInfo()}
                        </div>
                        <div class={styled.contentSlider}></div>
                    </div>
                    <div class={styled.contentPanel}></div>
                </div>
            )
        }

        return () => (
            <>
                {renderMaks()}
                <Transition name={params.anim} appear={true}>
                    <div
                        ref={modalRef}
                        class={`${styled.container} ${styled[locale.value]}${
                            !params.check.correct && params.check.show ? ` ${styled.error}` : ''
                        }`}
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
