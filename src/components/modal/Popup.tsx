import { defineComponent, reactive } from 'vue'
import { ModalProps } from './props'
import { getPrefixCls } from '../_utils/props'
import { $tools } from '../../utils/tools'
import applyTheme from '../_utils/theme'
import styled from './style/popup.module.less'

const MiModalPopup = defineComponent({
    name: 'MiModalPopup',
    inheritAttrs: false,
    props: ModalProps(),
    emits: ['cancel'],
    setup(props) {
        applyTheme(styled)

        const renderMask = () => {}

        const params = reactive({
            key: getPrefixCls(`modal-${$tools.uid()}`),
            anim: getPrefixCls(`anim-${props.animation}`)
        })

        return () => (
            <div class={styled.container} key={params.key}>
                {renderMask()}
            </div>
        )
    }
})

export default MiModalPopup
