import { defineComponent, Transition, VNode, vShow, withDirectives } from 'vue'
import getModalPropTypes from './props'
import { getSlot } from '../../utils/props'

export default defineComponent({
    name: 'MiPopup',
    inheritAttrs: false,
    props: {...getModalPropTypes()},
    mounted() {
        this.$nextTick(() => {
            if ((this.forceRender || (this.container === false && !this.visible)) && this.$refs.wrap) {
                this.$refs.wrap.style.display = 'none'
            }
        })
    },
    methods: {
        close(e: MouseEvent) {
            this.emit('cancel', e)
        },
        handleAnimAfterLeave() {
            const { afterClose } = this
            if (this.$refs.wrap) this.$refs.wrap.style.display = 'none'
            if (afterClose) afterClose()
        },
        handleWrapClick() {
            if (this.mask && this.maskClosable) this.close()
        },
        getZIndex() {
            const style: any = {}
            const props = this.$props
            if (props.zIndex !== undefined) style.zIndex = props.zIndex
            return style
        },
        getWrapClass() {
            const { prefixCls, placement, wrapClass } = this.$props
            let classes = `${prefixCls}-wrap`
            if (placement !== undefined) classes += ` ${placement}`
            if (wrapClass !== undefined) {
                if (Array.isArray(wrapClass)) classes += ` ${wrapClass.join(' ')}`
                else classes += ` ${wrapClass}`
            }
            return classes
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
                        { withDirectives((
                            <div
                                class={`${this.prefixCls}-mask`}
                                style={this.getMaskStyle()}
                                onClick={this.close}
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
                    { withDirectives((
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
        const { prefixCls } = this.$props
        const style = this.getWrapStyle()
        if (this.visible) style.display = null
        return (
            <div class={`${prefixCls} ${prefixCls}-anim-${this.animation}`} role="modal">
                { this.getMaskElem() }
                <div class={this.getWrapClass()} ref="wrap" style={style} onClick={this.handleWrapClick}>
                    { this.getModalElem() }
                </div>
            </div>
        )
    }
})