import { defineComponent } from 'vue'
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
            const style: any = {}
            if (this.visible) style.display = null
            return {...this.getZIndex(), ...style, ...this.maskStyle}
        },
        getMaskElem() {
            const props = this.$props
            let maskElem: any
            if (props.mask) {
                maskElem = (
                    <div class="mi-modal-mask" ref="mask" style={this.getMaskStyle()} key="mi-mask"></div>
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
                <div class={`${prefixCls}-content`} style={style}>
                    { closer }
                    { header }
                    <div class={`${prefixCls}-body`} key="body" ref="body">{ getSlot(this) }</div>
                    { footer }
                </div>
            )
            return modalElem
        }
    },
    mounted() {
        this.$nextTick(() => {
            if (!this.visible) {
                if (this.$refs.wrap) this.$refs.wrap.style.display = 'none'
                if (this.$refs.mask) this.$refs.mask.style.display = 'none'
            }
        })
    },
    render() {
        const style = this.getWrapStyle()
        if (this.visible) style.display = null
        return (
            <>
                <div class="mi-modal" role="modal">
                    { this.getMaskElem() }
                    <div class="mi-modal-wrap" ref="wrap" style={style}>
                        { this.getModalElem() }
                    </div>
                </div>
            </>
        )
    }
})