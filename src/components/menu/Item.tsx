import { computed, defineComponent, type Plugin } from 'vue'
import { MenuItemProps } from './props'
import { Menu } from 'ant-design-vue'
import { $g } from '../../utils/global'
import { useMenuStore } from '../../stores/menu'
import { useLayoutStore } from '../../stores/layout'
import MiLink from '../link/Link'
import MiMenuItemTitle from './Title'
import applyTheme from '../_utils/theme'
import styled from './style/item.module.less'

const MiMenuItem = defineComponent({
    name: 'MiMenuItem',
    inheritAttrs: false,
    props: MenuItemProps(),
    setup(props) {
        const useLayout = useLayoutStore()
        const useMenu = useMenuStore()
        const collapsed = computed(() => useLayout.collapsed)
        const activeKeys = computed(() => useMenu.activeKeys)
        applyTheme(styled)

        const key = $g.prefix + props?.item?.name
        const classes = computed(() => {
            return [
                styled.container,
                { [styled.collapsed]: collapsed.value },
                { [styled.active]: activeKeys.value.includes(key) }
            ]
        })
        const linkProps = {
            path: props?.item?.path,
            query: props?.item?.query || {}
        }

        return () => (
            <MiLink class={styled.link} key={key} {...linkProps}>
                <Menu.Item class={classes.value} key={key}>
                    <MiMenuItemTitle item={props.item} key={key} />
                </Menu.Item>
            </MiLink>
        )
    }
})

MiMenuItem.Title = MiMenuItemTitle

export default MiMenuItem as typeof MiMenuItem &
    Plugin & {
        readonly Title: typeof MiMenuItemTitle
    }
