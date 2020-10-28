<template>
    <a-menu-item class="mi-layout-sider-menu-item" :title="item.meta.title" :key="G.prefix + item.name">
        <router-link class="mi-layout-sider-menu-link" :to="{path: item.path}" v-if="!G.regExp.url.test(item.path)">
            <component :is="item.meta.icon" v-if="item.meta.icon" />
            <TagsFilled v-else />
            <div class="mi-layout-sider-menu-title">
                <span>{{ title ? item.meta.title : null }}</span>
                <span class="sub" v-html="item.meta.subTitle" v-if="item.meta.subTitle"></span>
            </div>
            <a-tag class="mi-layout-sider-menu-tag" :color="item.meta.tag.color ?? '#f6ca9d'" v-if="item.meta.tag">{{ item.meta.tag.content }}</a-tag>
        </router-link>
        <a :href="item.path"
            class="mi-layout-sider-menu-link"
            :target="item.meta.target ?? '_blank'"
            v-else>
            <component :is="item.meta.icon" v-if="item.meta.icon" />
            <TagsFilled v-else />
            <span>{{ title ? item.meta.title : null }}</span>
        </a>
    </a-menu-item>
</template>

<script lang="ts">
    import { defineComponent } from 'vue'

    export default defineComponent({
        props: {
			item: {
				type: Object,
				required: true,
                default: () => {}
			},
			title: {
				type: Boolean,
				default: true
			}
		}
    })
</script>