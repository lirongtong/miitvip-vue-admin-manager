import { defineComponent } from 'vue'
import styled from './style/history.module.less'

const MiHistory = defineComponent({
    name: 'MiHistory',
    inheritAttrs: false,
    setup() {
        return () => <div class={styled.container}></div>
    }
})

export default MiHistory
