import { defineComponent, computed } from 'vue'
import { $g } from '../../utils/global'
import PropTypes from '../_utils/props-types'
import { getPrefixCls } from '../_utils/props-tools'
import { Menu } from 'ant-design-vue'
import { MenuItems } from './menu'
import MiSubMenu from './submenu'
import MiMenuItem from './item'
import MiMenuItemLink from './link'

export const subMenuProps = () => ({
    prefixCls: String,
    item: PropTypes.object,
    type: PropTypes.string.def('children'),
    topLevel: PropTypes.bool.def(false)
})

export default defineComponent({
    name: 'MiSubMenu',
    inheritAttrs: false,
    props: subMenuProps(),
    setup(props) {
        const prefixCls = getPrefixCls('menu-items', props.prefixCls)
        const active = computed(() => {
            return $g.menus.relationshipChain.includes(`${$g.prefix}${props.item.name}`)
        })
        const title = (
            <MiMenuItemLink item={props.item} topLevel={props.topLevel} hasTitle={true} />
        )
        const getSubmenuItem = () => {
            const items = []
            const children = props.item.children as MenuItems[]
            children?.forEach((child: MenuItems) => {
                if (child?.children?.length > 0) {
                    items.push(
                        <MiSubMenu item={child} key={`${$g.prefix}${child.name}`}></MiSubMenu>
                    )
                } else {
                    items.push(
                        <MiMenuItem item={child} key={`${$g.prefix}${child.name}`}></MiMenuItem>
                    )
                }
            })
            return [...items]
        }
        return (
            <Menu.SubMenu class={`${prefixCls}${active.value}`} title={title} key={`${prefixCls}${props.item.name}`}>
                { getSubmenuItem }
            </Menu.SubMenu>
        )
    }
})
