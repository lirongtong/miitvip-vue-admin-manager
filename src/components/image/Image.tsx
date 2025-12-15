import { defineComponent, ref, onMounted, nextTick, onBeforeUnmount } from 'vue'
import { ImageProps } from './props'
import { $g } from '../../utils/global'
import { $tools } from '../../utils/tools'

const MiImage = defineComponent({
    name: 'MiImage',
    inheritAttrs: false,
    props: ImageProps(),
    emits: ['load'],
    setup(props, { emit, attrs }) {
        const imgRef = ref<any>()
        let temp: any = null
        onMounted(() => {
            nextTick().then(() => {
                temp = new Image()
                temp.src = props.src
                temp.onload = () => {
                    emit('load', imgRef.value)
                    temp.src = ''
                }
            })
        })

        onBeforeUnmount(() => {
            if (temp) {
                temp.onload = null
                temp.onerror = null
                temp = null
            }
        })

        const style = {
            width: $tools.convert2rem($tools.distinguishSize(props?.width)),
            height: $tools.convert2rem($tools.distinguishSize(props?.height)),
            borderRadius: $tools.convert2rem($tools.distinguishSize(props?.radius))
        } as any

        return () => (
            <img
                {...attrs}
                ref={imgRef}
                src={props?.src}
                alt={props?.alt || $g.powered}
                style={{
                    ...style,
                    ...(attrs as any)?.style
                }}
            />
        )
    }
})

export default MiImage
