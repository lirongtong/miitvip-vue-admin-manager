import { defineComponent, ref, Teleport, watch, onMounted, onBeforeMount } from 'vue'
import { TeleportProps } from './props'

const windowIsUndefined = !(
    typeof window !== undefined &&
    window.document &&
    window.document.createElement
)

const MiModalTeleport = defineComponent({
    name: 'MiModalTeleport',
    inheritAttrs: false,
    props: TeleportProps(),
    setup(props) {
        const teleportRef = ref(null)
        const openCount = ref<number>(props.open ? 1 : 0)
        const _container = ref(null)

        const createContainer = () => {
            if (windowIsUndefined) return null
            const type = typeof props.container
            if (type === 'function') return props.container()
            if (type === 'string') {
                let temp = props.container
                const firstLetter = temp.chartAt(0)
                if (!(firstLetter === '#' || firstLetter === '.')) temp = `#${temp}`
                return document.querySelector(temp)
            }
            if (type === 'object' && props.container instanceof window.HTMLElement) {
                return props.container
            }
            return document.body
        }

        const removeContainer = () => {
            _container.value = null
        }

        watch(
            () => props.open,
            (n) => (openCount.value = n ? openCount.value + 1 : openCount.value - 1)
        )

        watch(
            () => props.container,
            (curr, prev) => {
                const containerIsFunc = typeof curr === 'function' && typeof prev === 'function'
                if (containerIsFunc ? curr.toString() !== prev.toString() : curr !== prev)
                    removeContainer()
            }
        )

        onBeforeMount(() => removeContainer())
        onMounted(() => (_container.value = createContainer()))

        return () => {
            const childProps = { container: createContainer() }
            return (props.open || props.forceRender || teleportRef.value) && _container.value ? (
                <Teleport ref={teleportRef} to={_container.value}>
                    {props.children && props.children(childProps)}
                </Teleport>
            ) : null
        }
    }
})

export default MiModalTeleport
