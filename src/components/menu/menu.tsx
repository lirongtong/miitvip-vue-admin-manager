import { defineComponent, reactive, computed } from 'vue'
import { useStore } from 'vuex'
import { Menu } from 'ant-design-vue'
import PropTypes from '../../utils/props'
import MiSubMenu from './submenu'
import MiMenuItem from './item'
import { MenuItems } from '../../utils/config'

export default defineComponent({
    name: 'MiMenu',
    props: {
        className: PropTypes.string,
        items: PropTypes.object
    },
    setup() {
        const store = useStore()
        const menus: any = reactive({})
        const data: MenuItems[] = reactive([])
        const collapsed = computed(() => store.getters['layout/collapsed'])
        return { store, menus, data, collapsed }
    },
    created() {
        this.data = (this.items ?? this.$g.menus.items) as MenuItems[]
        const path = this.$route.path
        let find = false
        let relation: string[] = []
        let allChildren: {[index: string]: any} = {}
        const getChildren = (item: MenuItems[], parent: string) => {
            for (let k = 0; k < item.length; k++) {
                const name = this.$g.prefix + item[k].name
                if (!find) {
                    relation.push(name)
                    if (path === item[k].path) find = true
                }
                allChildren[name] = {
                    status: true,
                    parent
                }
                const child = item[k].children
                if (child && child.length > 0) getChildren(child, name)
                if (!find) relation.pop()
            }
        }
        for (let i = 0; i < this.data.length; i++) {
            const name = this.$g.prefix + this.data[i].name
            if (!find) {
                relation.push(name)
                if (path === this.data[i].path) find = true
            }
            this.menus[name] = {}
            const children = this.data[i].children
            if (children && children.length > 0) {
                getChildren(children, name)
                this.menus[name] = allChildren
                allChildren = {}
            }
            if (!find) relation = []
        }
    },
    methods: {
        getPrefixCls() {
            return this.$tools.getPrefixCls('menu')
        },
        getItems() {
            const items = []
            for (let i = 0, l = this.data.length; i < l; i++) {
                const item = this.data[i]
                if (item.children && item.children.length > 0) {
                    items.push(
                        <MiSubMenu
                            item={item}
                            key={this.$g.prefix + item.name}
                            top={this.collapsed}>
                        </MiSubMenu>
                    )
                } else {
                    items.push(
                        <MiMenuItem
                            item={item}
                            key={this.$g.prefix + item.name}
                            top={this.collapsed}>
                        </MiMenuItem>
                    )
                }
            }
            return [...items]
        }
    },
    render() {
        const prefixCls = this.getPrefixCls()
        const cls = prefixCls + (this.className ? ` ${this.className}` : '')
        return (
            <Menu ref={prefixCls} theme="dark" mode="inline" class={cls}>
                { () => this.getItems() }
            </Menu>
        )
    }
})