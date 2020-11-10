import { defineComponent, Teleport } from 'vue'

const windowIsUndefined = !(
    typeof window !== undefined &&
    window.document &&
    window.document.createElement
)
let openCount = 0

export default defineComponent({
    name: 'MiTeleport',
    props: {
        visible: Boolean,
        container: [String, Object, Function],
        children: Function,
        forceRender: Boolean
    },
    data() {
        const { visible } = this.$props
        openCount = visible ? openCount + 1 : openCount
        return {
            _component: null,
            _container: null
        }
    },
    watch: {
        visible(val) {
            openCount = val ? openCount + 1 : openCount - 1
        }
    },
    mounted() {
        this.createContainer()
    },
    methods: {
        saveTeleport(elem: any) {
            this._component = elem
        },
        getContainer() {
            if (windowIsUndefined) return null
            const { container } = this.$props
            const type = typeof container
            if (type === 'function') return container()
            if (type === 'string') return document.querySelector(container)
            if (
                type === 'object' &&
                container instanceof window.HTMLElement
            ) return container
            return document.body
        },
        createContainer() {
            this._container = this.getContainer()
            this.$forceUpdate()
        }
    },
    render() {
        const { visible, forceRender, children } = this.$props
        const childProps = {container: this.getContainer}
        if (visible || forceRender || this._component) {
            return (
                <Teleport to={this._container} ref={this.saveTeleport}>
                    { children(childProps) }
                </Teleport>
            )
        }
        return null
    }
})