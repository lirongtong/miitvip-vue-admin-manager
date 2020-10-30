<template>
    <a-menu-item
        class="mi-layout-sider-menu-item"
        :key="G.prefix + (item ? item.name : $tools.uid())">
        <slot name="menu-item">
            <router-link
                class="mi-layout-sider-menu-link"
                :to="{ path: item.path }"
                v-if="!G.regExp.url.test(item.path)">
                <mi-layout-menu-item-link :item="item" :top="top" :title="title"></mi-layout-menu-item-link>
            </router-link>
            <a :href="item.path"
                class="mi-layout-sider-menu-link"
                :target="item.meta.target ?? '_blank'"
                v-else>
                <mi-layout-menu-item-link :item="item" :top="top" :title="title"></mi-layout-menu-item-link>
            </a>
        </slot>
    </a-menu-item>
</template>

<script lang="ts">
    import { defineComponent } from 'vue';
    import MiLayoutMenuItemLink from './item-link.vue'

    export default defineComponent({
        components: { MiLayoutMenuItemLink },
        props: {
            item: {
                type: Object,
                default: () => {}
            },
            title: {
                type: Boolean,
                default: true
            },
            top: {
                type: Boolean,
                default: false
            }
        }
    })
</script>