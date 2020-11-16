import { defineComponent, reactive } from 'vue'
import { Menu } from 'ant-design-vue'
import PropTypes, { getSlotContent } from '../../utils/props'

export default defineComponent({
    name: 'MiMenu',
    props: {
        className: PropTypes.string,
        items: PropTypes.object
    },
    setup() {
        const menus = reactive({})
        const data = reactive([])
        return { menus, data }
    },
    created() {
        this.data = this.items ?? this.$g.menus.items
        const path = this.$route.path
        let find = false
        let relation: string[] = []
        let allChildren: {[index: string]: any} = {}
        const getChildren = (item: any[], parent: string) => {
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
        }
    },
    render() {
        const prefixCls = this.getPrefixCls()
        const cls = prefixCls + (this.className ? ` ${this.className}` : '')
        return (
            <Menu ref={prefixCls} theme="dark" mode="inline" class={cls}>
                <Menu.Item>Nice</Menu.Item>
            </Menu>
        )
    }
})