import { computed, defineComponent, reactive, watch, onMounted, nextTick, ref } from 'vue'
import { useRoute } from 'vue-router'
import { MenuProps } from './props'
import type { MenuItem } from '../../utils/types'
import { $g } from '../../utils/global'
import { $tools } from '../../utils/tools'
import { Menu } from 'ant-design-vue'
import { useMenuStore } from '../../stores/menu'
import { useLayoutStore } from '../../stores/layout'
import { useWindowResize } from '../../hooks/useWindowResize'
import MiSubMenu from './Submenu'
import MiMenuItem from './Item'
import applyTheme from '../_utils/theme'
import styled from './style/menu.module.less'

const MiMenu = defineComponent({
    name: 'MiMenu',
    inheritAttrs: false,
    props: MenuProps(),
    setup(props) {
        const route = useRoute()
        const menuStore = useMenuStore()
        const layoutStore = useLayoutStore()
        const menuRef = ref<any>(null)
        const { width, height } = useWindowResize()

        const data = computed(() => props.items || [])
        const openKeys = computed(() => menuStore.openKeys)
        const activeKeys = computed(() => menuStore.activeKeys)
        const collapsed = computed(() => layoutStore.collapsed)
        applyTheme(styled)

        const relationship = reactive({
            path: route.path,
            found: false,
            data: [] as string[],
            menus: {} as { [index: string]: any },
            children: {} as { [index: string]: any }
        })

        const setOpenKeys = (openKeys: (string | number)[]) => {
            let opens: (string | number)[] = []
            if (openKeys && openKeys.length > 0) {
                opens = [...openKeys]
                if (menuStore.accordion) {
                    const first = openKeys[0]
                    const last = openKeys[openKeys.length - 1]
                    if (relationship.menus?.[first] && !relationship.menus?.[first]?.[last]) {
                        opens = [last]
                    }
                }
            }
            menuStore.$patch({ openKeys: opens })
        }

        const setRelationshipChain = (data: string[]) => {
            if (data && data.length > 0) {
                menuStore.$patch({ relationshipChain: [...data] })
                menuStore.$patch({ activeKeys: [data[data.length - 1]] })
                if (!collapsed.value && menuStore.accordion) {
                    data.pop()
                    menuStore.$patch({ openKeys: [...data] })
                }
            }
        }

        const getChildrenRelationshipChain = (data: MenuItem[], pKey: string, save = false) => {
            ;(data || []).forEach((item: MenuItem) => {
                const key = $g.prefix + item.name
                if (!relationship.found) {
                    relationship.data.push(key)
                    if (relationship.path === item.path) relationship.found = true
                }
                if (save) relationship.children[key] = { status: true, pKey }
                const children = item?.children
                if (children && children.length > 0) {
                    getChildrenRelationshipChain(children, key, save)
                }
                if (!relationship.found) relationship.data.pop()
            })
        }

        const getRelationshipChain = (parse = true) => {
            relationship.path = route.path
            relationship.found = false
            relationship.data = []
            data.value.forEach((item: MenuItem) => {
                const key = $g.prefix + item.name
                if (!relationship.found) {
                    relationship.data.push(key)
                    if (item.path === relationship.path) relationship.found = true
                }
                if (parse) relationship.menus[key] = {}
                const children = item?.children
                if (children && children.length > 0) {
                    getChildrenRelationshipChain(children, key, parse)
                    if (parse) {
                        relationship.menus[key] = relationship.children
                        relationship.children = {}
                    }
                }
                if (!relationship.found) relationship.data = []
            })
            setRelationshipChain(relationship.data)
        }
        getRelationshipChain()

        const renderMenuItems = () => {
            const items = []
            data.value.forEach((item: MenuItem) => {
                const key = $g.prefix + item.name
                if (item?.children?.length > 0) {
                    items.push(<MiSubMenu item={item} key={key} />)
                } else {
                    items.push(<MiMenuItem item={item} key={key} />)
                }
            })
            return items
        }

        watch(
            () => route,
            () => {
                const active = `${$g.prefix}${route.name as string}`
                menuStore.$patch({ activeKeys: [active] })
                getRelationshipChain(false)
            },
            { immediate: false, deep: true }
        )

        onMounted(() => {
            nextTick().then(() => {
                if (
                    typeof window !== 'undefined' &&
                    width.value > $g.breakpoints.md &&
                    !collapsed.value
                ) {
                    const menuElem = menuRef.value.$el
                    const top = menuElem ? $tools.getElementActualOffsetTopOrLeft(menuElem) : 0
                    const itemElem = document.querySelector(
                        `li[data-menu-id="${activeKeys.value}"]`
                    ) as HTMLElement
                    if (menuElem && itemElem) {
                        const posTop = $tools.getElementActualOffsetTopOrLeft(itemElem)
                        const diff = posTop + top - height.value
                        if (diff > 0) $tools.scrollToPos(menuElem, 0, diff)
                    }
                }
            })
        })

        return () => (
            <Menu
                class={styled.container}
                ref={menuRef}
                mode="inline"
                theme={$g.theme.type}
                inlineIndent={$tools.distinguishSize(props.indent)}
                inlineCollapsed={collapsed.value}
                openKeys={openKeys.value}
                selectedKeys={activeKeys.value}
                onOpenChange={setOpenKeys}>
                {renderMenuItems()}
            </Menu>
        )
    }
})

MiMenu.SubMenu = MiSubMenu
MiMenu.Item = MiMenuItem

export default MiMenu as typeof MiMenu & {
    readonly SubMenu: typeof MiSubMenu
    readonly Item: typeof MiMenuItem
}
