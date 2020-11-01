<template>
    <a-menu ref="mi-menus"
        class="mi-layout-sider-menu"
        theme="dark"
        mode="inline"
        :forceSubMenuRender="true"
        @click="setActive"
        @openChange="setOpenKeys"
        :inline-collapsed="collapsed"
        v-model:openKeys="G.menus.opens"
        v-model:selectedKeys="G.menus.active">
        <slot name="menu">
            <template v-for="item in data" :key="G.prefix + item.name">
                <mi-layout-sider-sub-menu
                    :item="item"
                    :key="G.prefix + item.name"
                    :top="collapsed"
                    v-if="item.children && item.children.length > 0">
                </mi-layout-sider-sub-menu>
                <mi-layout-sider-menu-item
                    :item="item"
                    :key="G.prefix + item.name"
                    :top="collapsed"
                    v-else>
                </mi-layout-sider-menu-item>
            </template>
        </slot>
    </a-menu>
</template>

<script lang="ts">
    import { defineComponent, computed, reactive } from 'vue'
    import { useStore } from 'vuex'
    import { install } from '/@src/_base/type'
    import { mutations } from '/@src/store/types'
    import { MenuItems } from '/@src/utils/config'

    const MiLayoutSiderMenu = defineComponent({
        name: 'MiLayoutSiderMenu',
        props: {
            menuClassName: {
                type: String,
                default: ''
            },
            items: {
                type: Object,
                default: () => {}
            }
        },
        setup() {
            const store = useStore()
            const menus: any = reactive({})
            const data: MenuItems[] = reactive([])
            const collapsed = computed(() => store.getters["layout/collapsed"])
            return { store, collapsed, menus, data }
        },
        created() {
            this.data = (this.items ?? this.G.menus.items) as MenuItems[]
            const path = this.$route.path
            let find = false
            let relation: string[] = []
            let allChildren: {[index: string]: any} = {}
            const getChildren = (item: MenuItems[], parent: string) => {
                for (let k = 0; k < item.length; k++) {
                    const name = this.G.prefix + item[k].name
                    if (!find) {
                        relation.push(name)
                        if (path === item[k].path) find = true
                    }
                    allChildren[name] = {
                        status: true,
                        parent
                    }
                    const child = item[k].children
                    if (child && child.length > 0) getChildren(child, name)
                    if (!find) relation.pop()
                }
            };
            for (let i = 0; i < this.data.length; i++) {
                const name = this.G.prefix + this.data[i].name
                if (!find) {
                    relation.push(name)
                    if (path === this.data[i].path) find = true
                }
                this.menus[name] = {}
                const children = this.data[i].children
                if (children && children.length > 0) {
                    getChildren(children, name)
                    this.menus[name] = allChildren
                    allChildren = {}
                }
                if (!find) relation = []
            }
            /**
             * According to the routing information,
             * the expanded menu items are displayed.
             */
            this.setRelationshipChain(relation)
        },
        watch: {
            $route: function() {
                this.getRelationshipChain()
            }
        },
        methods: {
            setOpenKeys(openKeys: string[]): void {
                let opens: (string | number)[] = []
                if (openKeys.length > 0) {
                    opens = openKeys
                    if (this.G.menus.accordion) {
                        const first = openKeys[0]
                        const last = openKeys[openKeys.length - 1]
                        if (this.menus[first] && !this.menus[first][last]) opens = [last]
                    }
                } else {
                    if (this.G.menus.active.length > 0) {

                    }
                }
                this.store.commit(`layout/${mutations.layout.opens}`, opens)
                this.G.menus.opens = opens
            },
            setActive(item: any): void {
                if (item.keyPath && item.keyPath.length <= 1) {
                    this.G.menus.opens = []
                    this.store.commit(`layout/${mutations.layout.opens}`, [])
                }
                this.store.commit(`layout/${mutations.layout.active}`, [item.key])
            },
            getRelationshipChain() {
                const path = this.$route.path
                let find = false
                let relation: string[] = []
                const getChildren = (item: MenuItems[]) => {
                    for (let k = 0; k < item.length; k++) {
                        const name = this.G.prefix + item[k].name
                        if (!find) {
                            relation.push(name)
                            if (path === item[k].path) find = true
                        }
                        const child = item[k].children
                        if (child && child.length > 0) getChildren(child)
                        if (!find) relation.pop()
                    }
                }
                for (let i = 0; i < this.data.length; i++) {
                    const name = this.G.prefix + this.data[i].name
                    if (!find) {
                        relation.push(name)
                        if (path === this.data[i].path) find = true
                    }
                    const children = this.data[i].children
                    if (children && children.length > 0) getChildren(children)
                    if (!find) relation = []
                }
                this.setRelationshipChain(relation)
            },
            setRelationshipChain(relation: string[] = []) {
                if (relation.length > 0) {
                    this.G.menus.relationshipChain = [...relation]
                    this.G.menus.active = [relation[relation.length - 1]]
                    this.store.commit(`layout/${mutations.layout.active}`, relation[relation.length - 1])
                    if (!this.collapsed) {
                        relation.pop()
                        this.G.menus.opens = [...relation]
                        this.store.commit(`layout/${mutations.layout.opens}`, [...relation])
                    }
                    relation = []
                }
            }
        }
    })
    export default install(MiLayoutSiderMenu)
</script>