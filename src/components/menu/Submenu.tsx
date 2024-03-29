import { defineComponent, computed } from 'vue'
import { Menu } from 'ant-design-vue'
import { MenuSubProps } from './props'
import { MenuItem } from '../../utils/types'
import { $g } from '../../utils/global'
import { useLayoutStore } from '../../stores/layout'
import MiMenuItemTitle from './Title'
import MiMenuItem from './Item'
import applyTheme from '../_utils/theme'
import styled from './style/submenu.module.less'

const MiSubMenu = defineComponent({
    name: 'MiSubMenu',
    inheritAttrs: false,
    props: MenuSubProps(),
    setup(props, { attrs }) {
        const useLayout = useLayoutStore()
        const children = props?.item?.children
        const hasChildren = children && children.length > 0
        const pk = $g.prefix + props?.item?.name
        const title = (
            <MiMenuItemTitle item={props?.item} activeKey={hasChildren ? pk : ''} key={pk} />
        )
        const key = $g.prefix + props?.item?.name
        const collapsed = computed(() => useLayout.collapsed)
        applyTheme(styled)

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
            <Menu.SubMenu
                class={`${styled.container}${collapsed.value ? ` ${styled.collapsed}` : ''}`}
                popupClassName={styled.popup}
                popupOffset={[16, 16]}
                title={title}
                key={key}
                {...attrs}>
                {...getSubmenuItem()}
            </Menu.SubMenu>
        )
    }
})

export default MiSubMenu
