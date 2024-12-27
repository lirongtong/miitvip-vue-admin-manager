import { defineComponent } from 'vue'
import { ItemsDetailProps } from './props'
import applyTheme from '../../_utils/theme'
import styled from './style/detail.module.less'

const MiItemsDetail = defineComponent({
    name: 'MiItemsDetail',
    inheritAttrs: false,
    props: ItemsDetailProps(),
    setup(props) {
        applyTheme(styled)

        const renderScreenDetail = () => {}

        const renderBlockDetail = () => {}

        const renderNormalDetail = () => {}

        return () => (
            <div class={styled.container}>
                {props?.fullScreen
                    ? renderScreenDetail()
                    : props?.fullBlock
                      ? renderBlockDetail()
                      : renderNormalDetail()}
            </div>
        )
    }
})

export default MiItemsDetail
