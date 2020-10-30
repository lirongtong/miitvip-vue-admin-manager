<template>
    <component :is="item.icon" v-if="item.icon"></component>
    <span>{{ item.title }}</span>
    <span class="tag" v-if="item.tag && item.tag.content">
        {{ item.tag.content }}
    </span>
    <component :is="item.tag.icon" v-else-if="item.tag && item.tag.icon" :style="{color: item.tag.color ?? '#f6ca9d'}"></component>
</template>

<script lang="ts">
    import { defineComponent } from 'vue'

    export default defineComponent({
        props: {
            item: {
                type: Object,
                default: () => {},
                required: true
            }
        }
    })
</script>