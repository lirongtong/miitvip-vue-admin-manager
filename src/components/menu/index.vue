<template>
    <a-menu ref="mi-menus"
        class="mi-layout-sider-menu"
        theme="dark"
        mode="inline"
        :inline-collapsed="!collapsed"
        v-model:openKeys="G.menus.opens"
        v-model:selectedKeys="G.menus.active">
        <slot name="menu">
            <template v-for="item in G.menus.items" :key="G.prefix + item.name">
                <mi-layout-menu :item="item"
                    :key="G.prefix + item.name"
                    v-if="item.children && item.children.length > 0">
                </mi-layout-menu>
                <mi-layout-menu-item :item="item"
                    :key="G.prefix + item.name"
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
        }
    })
</script>