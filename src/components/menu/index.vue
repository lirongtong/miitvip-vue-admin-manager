<template>
    <a-menu ref="mi-menus"
        class="mi-layout-sider-menu"
        theme="dark"
        mode="inline"
        :force-sub-menu-render="true"
        @click="setActive"
        @openChange="setOpenKeys"
        :inline-collapsed="!collapsed"
        v-model:openKeys="G.menus.opens"
        v-model:selectedKeys="G.menus.active">
        <slot name="menu">
            <template v-for="item in G.menus.items" :key="G.prefix + item.name">
                <mi-layout-menu :item="item"
                    :key="G.prefix + item.name"
                    :top="collapsed"
                    v-if="item.children && item.children.length > 0">
                </mi-layout-menu>
                <mi-layout-menu-item :item="item"
                    :key="G.prefix + item.name"
                    :top="collapsed"
                    v-else>
                </mi-layout-menu-item>
            </template>
        </slot>
    </a-menu>
</template>

<script lang="ts">
    import { defineComponent } from 'vue'
    import { useStore } from 'vuex'
    import MiLayoutMenu from './menu.vue'
    import MiLayoutMenuItem from './item.vue'
    import { mutations } from '/@src/store/types'

    export default defineComponent({
        components: {MiLayoutMenu, MiLayoutMenuItem},
        props: {
            menuClassName: {
                type: String,
                default: ''
            }
        },
        setup() {
            const store = useStore()
            return {store}
        },
        computed: {
            collapsed(): boolean {
                return this.store.getters['layout/collapsed']
            }
        },
        methods: {
            setOpenKeys(openKeys: string[]): void {
                let opens: string[] = []
                if (openKeys.length > 0) {
                    opens = openKeys
                    if (this.G.menus.accordion) opens = [openKeys[openKeys.length - 1]]
                }
                this.store.commit(`layout/${mutations.layout.opens}`, opens)
                this.G.menus.opens = opens
            },
            setActive(item: any): void {
                if (item.keyPath && item.keyPath.length <= 1) {
                    this.G.menus.opens = [];
                    this.store.commit(`layout/${mutations.layout.opens}`, [])
                }
                this.store.commit(`layout/${mutations.layout.active}`, [item.key])
            }
        }
    })
</script>