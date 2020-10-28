<template>
    <a-sub-menu class="mi-layout-sider-menu-items" :key="G.prefix + item.name">
        <template v-slot:title>
            <component :is="item.meta.icon" v-if="item.meta.icon" />
            <TagsFilled v-else />
            <div class="mi-layout-sider-menu-title">
                <span>{{ item.meta.title ?? null }}</span>
                <span class="sub" v-html="item.meta.subTitle" v-if="item.meta.subTitle"></span>
            </div>
            <a-tag class="mi-layout-sider-menu-tag" :color="item.meta.tag.color ?? '#f6ca9d'" v-if="item.meta.tag">{{ item.meta.tag.content }}</a-tag>
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
    import { useStore } from 'vuex'
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