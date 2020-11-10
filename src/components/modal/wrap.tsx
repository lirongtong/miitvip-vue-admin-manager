import { defineComponent } from 'vue'
import MiModal from './modal'
import MiTeleport from './teleport'

const ModalWrap = defineComponent({
    inheritAttrs: false,
    render() {
        const { visible, container, forceRender } = this.$props
        let props = {
            ...this.$props,
            ...this.$attrs
        }
        if (container === false) {
            return (
                <MiModal {...props}></MiModal>
            )
        }
        return (
            <MiTeleport
                visible={visible}
                forceRender={forceRender}
                container={container}
                children={(child: any) => {
                    props = {...props, ...child}
                }}
            />
        )
    }
})
export default ModalWrap