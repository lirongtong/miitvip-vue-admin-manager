import { computed, defineComponent } from 'vue'
import { MenuItemProps } from './props'
import { Menu } from 'ant-design-vue'
import { $g } from '../../utils/global'
import { useMenuStore } from '../../stores/menu'
import { useLayoutStore } from '../../stores/layout'
import MiLink from '../link'
import MiMenuTitle from './Title'
import applyTheme from '../_utils/theme'
import styled from './style/item.module.less'

const MiMenuItem = defineComponent({
    name: 'MiMenuItem',
    inheritAttrs: false,
    props: MenuItemProps(),
    setup(props) {
        const layoutStore = useLayoutStore()
        const menuStore = useMenuStore()
        const collapsed = computed(() => layoutStore.collapsed)
        const activeKeys = computed(() => menuStore.activeKeys)
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
            <Menu.Item class={classes.value} key={key}>
                <MiLink class={styled.link} {...linkProps}>
                    <MiMenuTitle item={props.item} />
                </MiLink>
            </Menu.Item>
        )
    }
})

export default MiMenuItem
