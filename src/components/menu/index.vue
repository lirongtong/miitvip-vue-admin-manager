<template>
    <a-menu ref="mi-menus"
        class="mi-layout-sider-menu"
        theme="dark"
        mode="inline"
        :inlineCollapsed="true"
        v-model:openKeys="G.menus.opens"
        v-model:selectedKeys="G.menus.active">
        <slot name="menu">
            <template v-for="item in G.menus.items" :key="G.prefix + item.name">
                <mi-layout-menu :item="item"
                    :key="G.prefix + item.name"
                    v-if="item.children && item.children.length > 0">
                </mi-layout-menu>
                <mi-layout-menu :item="item"
                    :key="G.prefix + item.name"
                    type="group"
                    v-else-if="item.group && item.group.length > 0">
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
    import { defineComponent, reactive, getCurrentInstance } from 'vue'
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
        }
    })
</script>