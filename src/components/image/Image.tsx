import { defineComponent, ref, onMounted, nextTick } from 'vue'
import { ImageProps } from './props'
import { $g } from '../../utils/global'
import { $tools } from '../../utils/tools'

const MiImage = defineComponent({
    name: 'MiImage',
    inheritAttrs: false,
    props: ImageProps(),
    setup(props, { emit }) {
        const imgRef = ref<any>()
        onMounted(() => {
            nextTick().then(() => {
                const temp = new Image()
                temp.src = props.src
                temp.onload = () => {
                    emit('load', imgRef.value)
                    temp.src = ''
                }
            })
        })
        return () => (
            <img
                ref={imgRef}
                src={props?.src}
                alt={props?.alt || $g.powered}
                style={{
                    width: $tools.convert2rem($tools.distinguishSize(props?.width)),
                    height: $tools.convert2rem($tools.distinguishSize(props?.height)),
                    borderRadius: $tools.convert2rem($tools.distinguishSize(props?.radius))
                }}
            />
        )
    }
})

export default MiImage
