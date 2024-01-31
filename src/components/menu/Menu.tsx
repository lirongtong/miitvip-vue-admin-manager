import { computed, defineComponent } from 'vue'
import { MenuProps } from './props'
import type { MenuItem } from '../../utils/types'
import { $g } from '../../utils/global'
import { Menu } from 'ant-design-vue'
import MiSubMenu from './Submenu'
import MiMenuItem from './Item'
import MiMenuTitle from './Title'
import applyTheme from '../_utils/theme'
import styled from './style/menu.module.less'

const MiMenu = defineComponent({
    name: 'MiMenu',
    inheritAttrs: false,
    props: MenuProps(),
    setup(props) {
        const data = computed(() => props.items || [])
        applyTheme(styled)

        const getMenuItems = () => {
            const items = []
            data.value.forEach((item: MenuItem) => {
                if (item?.children?.length > 0) {
                    items.push(<MiSubMenu item={item} />)
                } else {
                    items.push(<MiMenuItem item={item} />)
                }
            })
            return items
        }

        return () => (
            <Menu mode="inline" theme={$g.theme.type}>
                {getMenuItems()}
            </Menu>
        )
    }
})

MiMenu.SubMenu = MiSubMenu
MiMenu.Item = MiMenuItem
MiMenu.Title = MiMenuTitle

export default MiMenu as typeof MiMenu & {
    readonly SubMenu: typeof MiSubMenu
    readonly Item: typeof MiMenuItem
    readonly Title: typeof MiMenuTitle
}
