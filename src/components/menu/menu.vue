<template>
    <a-sub-menu class="mi-layout-sider-menu-items" :key="G.prefix + item.name">
        <template v-slot:title>
            <component :is="item.meta.icon" v-if="item.meta.icon" />
            <TagsFilled v-else />
            <span>{{ item.meta.title ?? null }}</span>
        </template>
        <template v-for="(child, i) in item.children" :key="i">
            <mi-layout-menu :item="child.children"
                :key="G.prefix + child.name"
                v-if="child.children && child.children.length > 0">
            </mi-layout-menu>
            <mi-layout-menu-item :item="child"
                :key="G.prefix + child.name"
                v-else>
            </mi-layout-menu-item>
        </template>
    </a-sub-menu>
</template>

<script lang="ts">
    import { defineComponent } from 'vue'
    import MiLayoutMenuItem from './item.vue'

    export default defineComponent({
        name: 'MiLayoutMenu',
        components: {MiLayoutMenuItem},
        props: {
			item: {
				type: Object,
				default: () => {},
                required: true
            },
            type: {
                type: String,
                default: 'children'
            }
        }
    })
</script>