import { defineComponent } from 'vue'
import Header from './header'

const Layout = defineComponent({
    name: 'MiLayout',
    render() {
        return <div class="mi-layout">Nice Job.</div>
    }
})
Layout.Header = Header
export default Layout as typeof Layout & {
    readonly Header: typeof Header
}
