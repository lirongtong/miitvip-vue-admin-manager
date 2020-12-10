import { defineComponent, Teleport } from 'vue'
import PropTypes from '../../utils/props'

const windowIsUndefined = !(
    typeof window !== undefined &&
    window.document &&
    window.document.createElement
)
let openCount = 0

export default defineComponent({
    name: 'MiTeleport',
    props: {
        visible: PropTypes.bool,
        container: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
        children: PropTypes.func,
        forceRender: PropTypes.bool
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
        },
        container(curr, prev) {
            const containerIsFunc = typeof curr === 'function' && typeof prev === 'function'
            if (
                containerIsFunc
                    ? curr.toString() !== prev.toString()
                    : curr !== prev
            ) {
                this.removeContainer();
            }
        }
    },
    beforeUnmount() {
        this.removeContainer();
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
            const type = typeof this.container
            if (type === 'function') return this.container()
            if (type === 'string') {
                let temp = this.container
                if (temp.indexOf('#') === -1) temp = `#${temp}`
                return document.querySelector(temp)
            }
            if (
                type === 'object' &&
                this.container instanceof window.HTMLElement
            ) return this.container
            return document.body
        },
        createContainer() {
            this._container = this.getContainer()
            this.$forceUpdate()
        },
        removeContainer() {
            this._container = null
            this._component = null
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