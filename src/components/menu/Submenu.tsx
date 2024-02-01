import { defineComponent } from 'vue'
import { Menu } from 'ant-design-vue'
import { MenuSubProps } from './props'
import MiMenuTitle from './Title'

const MiSubMenu = defineComponent({
    name: 'MiSubMenu',
    inheritAttrs: false,
    props: MenuSubProps(),
    setup(props, { attrs }) {
        const title = <MiMenuTitle item={props?.item} />
        const getSubmenuItem = () => {}
        return () => (
            <Menu.SubMenu title={title} {...attrs}>
                {getSubmenuItem()}
            </Menu.SubMenu>
        )
    }
})

export default MiSubMenu
