import { defineComponent } from 'vue'
import { BgColorsOutlined } from '@ant-design/icons-vue'

const MiPalette = defineComponent({
    name: 'MiPalette',
    inheritAttrs: false,
    setup() {
        return () => <BgColorsOutlined />
    }
})

export default MiPalette as typeof MiPalette
