import { defineComponent, ref, onMounted, onBeforeMount, Teleport, watch } from 'vue'
import PropTypes from '../_utils/props-types'

const windowIsUndefined = !(
    typeof window !== undefined &&
    window.document &&
    window.document.createElement
)

export const teleportProps = () => ({
    prefixCls: PropTypes.string,
    visible: PropTypes.bool,
    container: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
    children: PropTypes.func,
    forceRender: PropTypes.bool
})

export default defineComponent({
    name: 'MiTeleport',
    inheritAttrs: false,
    props: teleportProps(),
    setup(props) {
        const teleportRef = ref(null)
        const openCount = ref<number>(props.visible ? 1 : 0)
        const _container = ref(null)

        onBeforeMount(() => removeContainer())
        onMounted(() => _container.value = createContainer())

        watch(() => props.visible, (n) => {
            openCount.value = n ? openCount.value + 1 : openCount.value - 1
        })
        watch(() => props.container, (curr, prev) => {
            const containerIsFunc = typeof curr === 'function' && typeof prev === 'function'
            if (
                containerIsFunc
                    ? curr.toString() !== prev.toString()
                    : curr !== prev
            ) removeContainer()
        })

        const createContainer = () => {
            if (windowIsUndefined) return null
            const type = typeof props.container
            if (type === 'function') return props.container()
            if (type === 'string') {
                let temp = props.container
                if (temp.indexOf('#') === -1) temp = `#${temp}`
                return document.querySelector(temp)
            }
            if (
                type === 'object' &&
                props.container instanceof window.HTMLElement
            ) return props.container
            return document.body
        }

        const removeContainer = () => {
            _container.value = null
        }

        return () => {
            const childProps = {container: createContainer()}
            return (
                (
                    props.visible ||
                    props.forceRender ||
                    teleportRef.value
                ) && _container.value
            ) ? (
                <Teleport to={_container.value} ref={teleportRef}>
                    {props.children(childProps)}
                </Teleport>
            ) : null
        }
    }
})