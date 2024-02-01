import { defineComponent } from 'vue'
import { Menu } from 'ant-design-vue'
import { MenuSubProps } from './props'
import { MenuItem } from '../../utils/types'
import { $g } from '../../utils/global'
import MiMenuTitle from './Title'
import MiMenuItem from './Item'

const MiSubMenu = defineComponent({
    name: 'MiSubMenu',
    inheritAttrs: false,
    props: MenuSubProps(),
    setup(props, { attrs }) {
        const children = props?.item?.children
        const hasChildren = children && children.length > 0
        const pk = $g.prefix + props?.item?.name
        const title = <MiMenuTitle item={props?.item} activeKey={hasChildren ? pk : ''} />
        const key = $g.prefix + props?.item?.name

        const getSubmenuItem = (): any[] => {
            const items: any[] = []
            if (hasChildren) {
                children.forEach((child: MenuItem) => {
                    const grandChild = child?.children
                    const k = $g.prefix + child?.name
                    if (grandChild && grandChild.length > 0) {
                        items.push(<MiSubMenu item={child} key={k} />)
                    } else items.push(<MiMenuItem item={child} key={k} />)
                })
            }
            return items
        }

        return () => (
            <Menu.SubMenu title={title} key={key} {...attrs}>
                {...getSubmenuItem()}
            </Menu.SubMenu>
        )
    }
})

export default MiSubMenu
