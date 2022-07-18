import { defineComponent } from 'vue'
import { uploadProps } from './props'

export default defineComponent({
    name: 'MiUpload',
    inheritAttrs: false,
    props: uploadProps(),
    setup() {
        return () => <div></div>
    }
})
