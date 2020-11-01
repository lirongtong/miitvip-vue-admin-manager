<template>
    <a-sub-menu
        class="mi-layout-sider-menu-items"
        :class="active"
        :key="G.prefix + item.name"
        v-if="item">
            <template v-slot:title>
                <mi-layout-menu-item-link :item="item" :top="top" :title="true"></mi-layout-menu-item-link>
            </template>
            <slot name="sub-menu">
                <template v-for="child in item.children">
                    <mi-layout-sider-sub-menu
                        :item="child"
                        :key="G.prefix + child.name"
                        v-if="child.children && child.children.length > 0">
                    </mi-layout-sider-sub-menu>
                    <mi-layout-sider-menu-item
                        :item="child"
                        :key="G.prefix + child.name"
                        v-else>
                    </mi-layout-sider-menu-item>
                </template>
            </slot>
    </a-sub-menu>
</template>

<script lang="ts">
    import { defineComponent } from 'vue'
    import { useStore } from 'vuex'
    import { install } from '/@src/_base/type'
    import MiLayoutMenuItemLink from './item-link.vue'

    const MiLayoutSiderSubMenu = defineComponent({
        name: 'MiLayoutSiderSubMenu',
        components: { MiLayoutMenuItemLink },
        props: {
            item: {
                type: Object,
                default: () => {}
            },
            type: {
                type: String,
                default: 'children'
            },
            top: {
                type: Boolean,
                default: false
            }
        },
        computed: {
            active(): string | null {
                return this.G.menus.relationshipChain.includes(this.G.prefix + this.item.name) ? 'mi-layout-sider-menu-items-active' : null
            }
        }
    })
    export default install(MiLayoutSiderSubMenu)
</script>