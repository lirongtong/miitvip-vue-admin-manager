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
    children?: MenuItems[] | undefined
}

export const menuProps = () => ({
    prefixCls: String,
    items: PropTypes.array,
    indent: PropTypes.number.def(16),
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
        let data: MenuItems[] = reactive((props.items ?? []) as MenuItems[]) as any
        const prefixCls = getPrefixCls('menu', props.prefixCls)
        const collapsed = computed(() => store.getters['layout/collapsed'])

        let path = route.path
        let find = false
        let relation: string[] = []
        let menuChildrenItems: { [index: string]: any } = {}

        const getChildrenRelationshipChain = (items: MenuItems[], pkey: string, save = false) => {
            items.forEach((item: MenuItems) => {
                const name = $g.prefix + item.name
                if (!find) {
                    relation.push(name)
                    if (path === item.path) find = true
                }
                if (save) {
                    menuChildrenItems[name] = {
                        status: true,
                        pkey
                    }
                }
                const children = item.children as MenuItems[]
                if (children?.length > 0) getChildrenRelationshipChain(children, name, save)
                if (!find) relation.pop()
            })
        }

        const getRelationshipChain = (parse = true) => {
            path = route.path
            find = false
            relation = []
            data.forEach((items: MenuItems) => {
                const name = $g.prefix + items.name
                if (!find) {
                    relation.push(name)
                    if (path === items.path) find = true
                }
                if (parse) menus[name] = {}
                const children = items.children as MenuItems[]
                if (children?.length > 0) {
                    getChildrenRelationshipChain(children, name, parse)
                    if (parse) {
                        menus[name] = menuChildrenItems
                        menuChildrenItems = {}
                    }
                }
                if (!find) relation = []
            })
            setRelationshipChain(relation)
        }

        const setRelationshipChain = (relation: string[] = []) => {
            if (relation.length > 0) {
                $g.menus.relationshipChain = [...relation]
                const active = [relation[relation.length - 1]]
                $g.menus.active = active
                store.commit(`layout/${mutations.layout.active}`, active)
                if (!collapsed.value && $g.menus.accordion) {
                    relation.pop()
                    const opens = [...relation]
                    $g.menus.opens = opens
                    store.commit(`layout/${mutations.layout.opens}`, opens)
                }
                relation = []
            }
        }
        getRelationshipChain()

        watch(route, () => {
            const active = `${$g.prefix}${route.name as string}`
            setActive({ key: active })
            getRelationshipChain(false)
        })
        watch(props.items, () => {
            data = props.items as any
        })

        const getMenuItems = () => {
            const items: any[] = []
            data?.forEach((item: MenuItems | any) => {
                if (item?.children?.length > 0) {
                    items.push(
                        <MiSubMenu
                            item={item}
                            topLevel={collapsed.value}
                            key={$g.prefix + item.name}
                        />
                    )
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

        const setActive = (item: any) => {
            $g.menus.active = [item.key]
            store.commit(`layout/${mutations.layout.active}`, [item.key])
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

        return () => (
            <Menu
                {...attrs}
                class={prefixCls}
                ref={prefixCls}
                theme="dark"
                inlineIndent={props.indent}
                mode={'inline'}
                onOpenChange={setOpenKeys}
                openKeys={$g.menus.opens}
                selectedKeys={$g.menus.active}>
                {getMenuItems()}
            </Menu>
        )
    }
})
