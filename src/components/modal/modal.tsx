import { defineComponent } from 'vue'

const Modal = defineComponent({
    name: 'MiModal',
    methods: {
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
            const modalElem = (
                <>
                    <div class="mi-modal-header">Header</div>
                    <div class="mi-modal-content">Content</div>
                    <div class="mi-modal-footer">Footer</div>
                </>
            )
            return modalElem
        }
    },
    mounted() {
        this.$nextTick(() => {
            if (!this.visible && this.$refs.wrap) {
                this.$refs.wrap.style.display = 'none'
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
export default Modal