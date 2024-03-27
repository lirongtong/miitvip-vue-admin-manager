import { defineComponent, reactive, Transition, computed, ref } from 'vue'
import { ModalProps } from './props'
import { getPrefixCls, getPropSlot } from '../_utils/props'
import { $tools } from '../../utils/tools'
import { useWindowResize } from '../../hooks/useWindowResize'
import applyTheme from '../_utils/theme'
import styled from './style/popup.module.less'

const MiModalPopup = defineComponent({
    name: 'MiModalPopup',
    inheritAttrs: false,
    props: ModalProps(),
    emits: ['cancel', 'afterClose'],
    setup(props, { slots, emit }) {
        const prefixCls = getPrefixCls('modal')
        const wrapRef = ref(null)
        const headerRef = ref(null)
        const footerRef = ref(null)
        const { width } = useWindowResize()
        const size = computed(() => {
            return {
                width: $tools.convert2rem($tools.distinguishSize(props.width, width.value)),
                height: $tools.convert2rem($tools.distinguishSize(props.height, width.value))
            }
        })
        const params = reactive({
            key: getPrefixCls(`modal-${$tools.uid()}`),
            anim: getPrefixCls(`anim-${props.animation}`),
            fade: getPrefixCls(`anim-fade`)
        })
        applyTheme(styled)

        const innerClasses = computed(() => {
            let cls = styled.inner
            if (props.placement !== undefined) cls += ` ${styled[props.placement]}`
            if (props.wrapClass !== undefined) {
                if (Array.isArray(props.wrapClass)) cls += ` ${props.wrapClass.join(' ')}`
                else cls += ` ${props.wrapClass}`
            }
            return cls
        })

        const handleAnimAfterLeave = () => {
            emit('afterClose')
        }

        const handleWrapClick = (evt?: Event) => {
            if (!props.maskClosable || !props.closable) return null
            if (wrapRef.value && wrapRef.value === evt?.target) handleCloseClick(evt)
        }

        const handleCloseClick = (evt?: Event) => {
            emit('cancel', evt)
        }

        const renderMask = () => {
            return props.mask ? (
                <Transition name={params.fade} appear={true}>
                    <div
                        class={styled.mask}
                        style={{ zIndex: props.zIndex ?? null, ...props.maskStyle }}
                        v-show={props.open}
                    />
                </Transition>
            ) : null
        }

        const renderModal = () => {
            const header = props.title ? (
                <div ref={headerRef} class={styled.header} key={`${prefixCls}-header`}>
                    {getPropSlot(slots, props, 'title')}
                </div>
            ) : null
            const footer = props.footer ? (
                <div
                    ref={footerRef}
                    class={`${styled.footer} ${styled[props.footerBtnPosition]}`}
                    key={`${prefixCls}-footer`}>
                    {getPropSlot(slots, props, 'footer')}
                </div>
            ) : null
            const closer = props.closable ? (
                <button onClick={handleCloseClick} class={styled.close} key={`${prefixCls}-close`}>
                    {getPropSlot(slots, props, 'closeIcon')}
                </button>
            ) : null
            return (
                <div class={styled.content} style={size.value}>
                    {props.closable ? closer : null}
                    {header}
                    <div class={styled.body}>{getPropSlot(slots, props)}</div>
                    {footer}
                </div>
            )
        }

        return () => (
            <div class={styled.container} key={params.key}>
                {renderMask()}
                <Transition name={params.anim} onAfterLeave={handleAnimAfterLeave} appear={true}>
                    <div
                        ref={wrapRef}
                        class={innerClasses.value}
                        style={{ zIndex: props.zIndex ?? null }}
                        onClick={handleWrapClick}
                        v-show={props.open}>
                        {renderModal()}
                    </div>
                </Transition>
            </div>
        )
    }
})

export default MiModalPopup
