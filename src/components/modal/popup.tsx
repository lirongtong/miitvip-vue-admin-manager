import { defineComponent, Transition, VNode, vShow, withDirectives } from 'vue'
import getModalPropTypes from './props'
import { getSlot } from '../../utils/props'

export default defineComponent({
    name: 'MiPopup',
    inheritAttrs: false,
    props: {...getModalPropTypes()},
    methods: {
        close(e: MouseEvent) {
            this.emit('cancel', e)
        },
        handleAnimAfterLeave() {
            if (this.$refs.wrap) {
                this.$refs.wrap.style.display = 'none'
            }
        },
        getZIndex() {
            const style: any = {}
            const props = this.$props
            if (props.zIndex !== undefined) style.zIndex = props.zIndex
            return style
        },
        getWrapStyle() {
            return {...this.getZIndex()}
        },
        getMaskStyle() {
            return {...this.getZIndex(), ...this.maskStyle}
        },
        getMaskElem() {
            let maskElem: any = null
            if (this.mask) {
                maskElem = (
                    <Transition key="mask" name="mi-fade" appear>
                        { () => withDirectives((
                            <div
                                class={`${this.prefixCls}-mask`}
                                style={this.getMaskStyle()}
                                key="mask">
                            </div>
                        ) as VNode, [[vShow, this.visible]]) }
                    </Transition>
                )
            }
            return maskElem
        },
        getModalElem() {
            const {
                prefixCls,
                title,
                footer: footerProp,
                width,
                height,
                closable,
                closeIcon
            } = this.$props

            const style: any = {}
            if (width !== undefined) {
                style.width = typeof width === 'number'
                    ? `${Math.round(width / 16)}rem`
                    : width
            }
            if (height !== undefined) {
                style.height = typeof height === 'number'
                    ? `${Math.round(height / 16)}rem`
                    : height
            }

            let header: any
            if (title) {
                header = (
                    <div
                        class={`${prefixCls}-header`}
                        key="heaader"
                        ref="header">{ title }
                    </div>
                )
            }

            let footer: any
            if (footerProp) {
                footer = (
                    <div
                        class={`${prefixCls}-footer`}
                        key="footer"
                        ref="footer">{ footerProp }
                    </div>
                )
            }

            let closer: any
            if (closable) {
                closer = (
                    <button
                        type="button"
                        onClick={this.close}
                        key="close"
                        aria-label="close"
                        class={`${prefixCls}-close`}>
                        { closeIcon || <span class={`${prefixCls}-close-x`}></span> }
                    </button>
                )
            }

            const modalElem = (
                <Transition
                    key="content"
                    name={`mi-${this.animation}`}
                    onAfterLeave={this.handleAnimAfterLeave}
                    appear>
                    { () => withDirectives((
                        <div class={`${prefixCls}-content`} style={style}>
                            { closer }
                            { header }
                            <div class={`${prefixCls}-body`} key="body" ref="body">{ getSlot(this) }</div>
                            { footer }
                        </div>
                    ) as VNode, [[vShow, this.visible]]) }
                </Transition>
            )
            return modalElem
        }
    },
    render() {
        const { prefixCls, position } = this.$props
        const style = this.getWrapStyle()
        if (this.visible) style.display = null
        return (
            <>
                <div class={`${prefixCls} ${prefixCls}-anim-${this.animation}`} role="modal">
                    { this.getMaskElem() }
                    <div class={`${prefixCls}-wrap ${position}`} ref="wrap" style={style}>
                        { this.getModalElem() }
                    </div>
                </div>
            </>
        )
    }
})