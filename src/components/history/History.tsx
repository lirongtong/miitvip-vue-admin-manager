import { defineComponent } from 'vue'
import styled from './style/history.module.less'

export default defineComponent({
    name: 'MiHistory',
    inheritAttrs: false,
    setup() {
        return () => <div class={styled.container}></div>
    }
})
