<template>
    <a-sub-menu
        class="mi-layout-sider-menu-items"
        :class="active"
        :key="G.prefix + item.name"
        v-if="item">
            <template v-slot:title>
                <component :is="item.meta.icon" v-if="item.meta.icon" />
                <TagsFilled v-else />
                <div class="mi-layout-sider-menu-title" v-if="!top">
                    <span>{{ item.meta.title ?? null }}</span>
                    <span class="sub"
                        v-html="item.meta.subTitle"
                        v-if="item.meta.subTitle">
                    </span>
                </div>
                <a-tag
                    class="mi-layout-sider-menu-tag"
                    :color="item.meta.tag.color ?? '#f6ca9d'"
                    v-if="item.meta.tag && item.meta.tag.content && !top">
                    {{ item.meta.tag.content }}
                </a-tag>
                <component
                    :is="item.meta.tag.icon"
                    class="mi-layout-sider-menu-icon"
                    :style="{
                        color: item.meta.tag.color ?? '#f6ca9d',
                        marginRight: 0,
                        fontSize: `${item.meta.tag.size ?? 14}px`,
                    }"
                    v-if="item.meta.tag &&
                        item.meta.tag.icon &&
                        !item.meta.tag.content &&
                        !top">
                </component>
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

    export default defineComponent({
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
</script>