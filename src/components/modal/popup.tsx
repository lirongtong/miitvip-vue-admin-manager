import { defineComponent, Transition, ref } from 'vue'
import { $tools } from '../../utils/tools'
import { getPrefixCls, getPropSlot } from '../_utils/props-tools'
import { modalProps } from './props'

export default defineComponent({
    name: 'MiPopup',
    inheritAttrs: false,
    props: modalProps(),
    emits: ['cancel'],
    setup(props, {slots, emit}) {
        const modalAnim = getPrefixCls(`anim-${props.animation}`)
        const maskAnim = getPrefixCls('anim-fade')
        const wrapRef = ref(null)
        const headerRef = ref(null)
        const footerRef = ref(null)

        const handleCloseClick = (evt?: Event) => {
            emit('cancel', evt)
        }
        
        const handleWrapClick = () => {
            if (props.mask && props.maskClosable) handleCloseClick()
        }

        const handleAnimAfterLeave = () => {
            if (props.afterClose) props.afterClose()
        }

        const getWrapClass = () => {
            let cls = `${props.prefixCls}-wrap`
            if (props.placement !== undefined) cls += ` ${props.placement}`
            if (props.wrapClass !== undefined) {
                if (Array.isArray(props.wrapClass)) cls += ` ${props.wrapClass.join(' ')}`
                else cls += ` ${props.wrapClass}`
            }
            return cls
        }

        const renderMask = () => {
            return props.mask ? (
                <Transition name={maskAnim} appear={true}>
                    <div class={`${props.prefixCls}-mask`}
                        style={{zIndex: props.zIndex ?? null, ...props.maskStyle}}
                        onClick={handleCloseClick}
                        v-show={props.visible} />
                </Transition>
            ) : null
        }

        const renderModal = () => {
            const style = {
                width: props.width ? $tools.convert2Rem(props.width) : null,
                height: props.height ? $tools.convert2Rem(props.height) : null
            }
            const header = props.title ? (
                <div class={`${props.prefixCls}-header`}
                    key={`${props.prefixCls}-header`}
                    ref={headerRef}>
                    {props.title}
                </div>
            ) : null
            const footers = props.footer ? (
                <div class={`${props.prefixCls}-footer`}
                    key={`${props.prefixCls}-footer`}
                    ref={footerRef}>
                    {props.footer}
                </div>
            ) : null
            const closer = props.closable ? (
                <button type="button"
                    onClick={handleCloseClick}
                    key={`${props.prefixCls}-close`}
                    class={`${props.prefixCls}-close`}>
                    {props.closeIcon}
                </button>
            ) : null
            return (
                <div class={`${props.prefixCls}-content`}
                    style={style}>
                    {closer}
                    {header}
                    <div class={`${props.prefixCls}-body`}>
                        {getPropSlot(slots, props)}
                    </div>
                    {footers}
                </div>
            )
        }

        return () => (
            <div class={`${props.prefixCls}`}>
                {renderMask()}
                <Transition name={modalAnim} onAfterLeave={handleAnimAfterLeave} appear>
                    <div class={getWrapClass()}
                        ref={wrapRef}
                        style={{zIndex: props.zIndex ?? null}}
                        onClick={handleWrapClick}
                        v-show={props.visible}>
                        {renderModal()}
                    </div>
                </Transition>
            </div>
        )
    }
})