import { defineComponent, reactive, computed, watch } from 'vue'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
import PropTypes from '../_utils/props-types'
import { tuple, getPrefixCls } from '../_utils/props-tools'
import { $g } from '../../utils/global'
import { mutations } from '../../store/types'
import { Menu } from 'ant-design-vue'
import MiMenuItem from './item'
import MiSubMenu from './submenu'

export declare interface MenuItems {
    /**
     * Path of the record. Should start with `/` unless
     * the record is the child of another record.
     *
     * @example `/users/:id` matches `/users/1` as well as `/users/posva`.
     */
    path: string

    // Name for the item.
    name: string

    // Interface to type `meta` fields in items records.
    meta?: Record<string | number, any>

    // Array of nested menu items.
    children?: MenuItems[]
}

export const menuProps = () => ({
    prefixCls: String,
    items: PropTypes.object,
    mode: PropTypes.oneOf(tuple('vertical', 'inline')).def('inline')
})

export default defineComponent({
    name: 'MiMenu',
    inheritAttrs: false,
    props: menuProps(),
    setup(props, { attrs }) {
        const store = useStore()
        const route = useRoute()
        const menus: any = reactive({})
        const data: MenuItems[] = reactive((props.items ?? []) as MenuItems[])
        const prefixCls = getPrefixCls('menu', props.prefixCls)
        const collapsed = computed(() => store.getters['layout/collapsed'])

        const path = route.path
        let find = false
        let relation: string[] = []
        let menuChildrenItems: { [index: string]: any } = {}
        const parseMenuChildren = (items: MenuItems[], pkey: string) => {
            items.forEach((item: MenuItems) => {
                const name = $g.prefix + item.name
                if (!find) {
                    relation.push(name)
                    if (path === item.path) find = true
                }
                menuChildrenItems[name] = {
                    status: true,
                    pkey
                }
                const children = item.children as MenuItems[]
                if (children && children.length > 0) parseMenuChildren(children, name)
                if (!find) relation.pop()
            })
        }
        const setRelationshipChain = (relation: string[] = []) => {
            if (relation.length > 0) {
                $g.menus.relationshipChain = [...relation]
                const active = [relation[relation.length - 1]]
                $g.menus.active = active
                store.commit(`layout/${mutations.layout.active}`, active)
                if (!collapsed.value && $g.menus.accordion) {
                    relation.pop()
                    $g.menus.opens = [...relation]
                    store.commit(`layout/${mutations.layout.opens}`, [...relation])
                }
                relation = []
            }
        }
        const parseMenu = () => {
            data.forEach((items: MenuItems) => {
                const name = $g.prefix + items.name
                if (!find) {
                    relation.push(name)
                    if (path === items.path) find = true
                }
                menus[name] = {}
                const children = items.children as MenuItems[]
                if (children && children.length > 0) {
                    parseMenuChildren(children, name)
                    menus[name] = menuChildrenItems
                    menuChildrenItems = {}
                }
                if (!find) relation = []
            })
            setRelationshipChain(relation)
        }
        parseMenu()

        watch(route, () => {})

        const getMenuItems = () => {
            const items = []
            data.forEach((item: MenuItems) => {
                if (item.children && item.children.length > 0) {
                    items.push(<MiSubMenu></MiSubMenu>)
                } else {
                    items.push(
                        <MiMenuItem
                            item={item}
                            topLevel={collapsed.value}
                            key={$g.prefix + item.name}
                        />
                    )
                }
            })
            return [...items]
        }

        const setOpenKeys = (openKeys: (string | number)[]) => {
            let opens: (string | number)[] = []
            if (openKeys.length > 0) {
                opens = openKeys
                if ($g.menus.accordion) {
                    const first = openKeys[0]
                    const last = openKeys[openKeys.length - 1]
                    if (menus[first] && !menus[first][last]) opens = [last]
                }
            }
            $g.menus.opens = opens
            store.commit(`layout/${mutations.layout.opens}`, opens)
        }

        return (
            <Menu
                class={prefixCls}
                ref={prefixCls}
                theme="dark"
                mode={props.mode}
                onOpenChange={setOpenKeys}
                openKeys={$g.menus.opens}
                selectedKeys={$g.menus.active}
                {...attrs}
            >
                {getMenuItems}
            </Menu>
        )
    }
})
