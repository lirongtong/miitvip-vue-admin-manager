import { defineComponent } from 'vue'
import { Menu } from 'ant-design-vue'
import PropTypes from '../../utils/props'
import MiMenuItem from './item'
import MiMenuItemLink from './link'
import MiSubMenu from './submenu'
import { MenuItems } from '../../utils/config'

export default defineComponent({
    name: 'MiSubMenu',
    props: {
        item: PropTypes.object.isRequired,
        type: PropTypes.string.def('children'),
        top: PropTypes.bool.def(false)
    },
    computed: {
        active(): string | null {
            const prefixCls = this.getPrefixCls()
            return this.$g.menus.relationshipChain.includes(this.$g.prefix + this.item.name)
                ? ` ${prefixCls}-active`
                : ''
        }
    },
    methods: {
        getPrefixCls() {
            return this.$tools.getPrefixCls('menu-items')
        },
        getSubmenuItem() {
            const items = []
            const children = this.item.children as MenuItems[]
            for (let i = 0, l = children.length; i < l; i++) {
                const child = children[i]
                if (child.children && child.children.length > 0) {
                    items.push(
                        <MiSubMenu
                            item={child}
                            key={this.$g.prefix + child.name}>
                        </MiSubMenu>
                    )
                } else {
                    items.push(
                        <MiMenuItem
                            item={child}
                            key={this.$g.prefix + child.name}>
                        </MiMenuItem>
                    )
                }
            }
            return [...items]
        }
    },
    render() {
        const prefixCls = this.getPrefixCls()
        const title = (
            <MiMenuItemLink
                item={this.item}
                top={this.top}
                title={true}>
            </MiMenuItemLink>
        )
        const cls = prefixCls + this.active
        return (
            <Menu.SubMenu
                class={cls}
                title={title}
                key={this.$g.prefix + this.item.name}>
                { this.getSubmenuItem() }
            </Menu.SubMenu>
        )
    }
})