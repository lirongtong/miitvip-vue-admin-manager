<template>
    <mi-layout></mi-layout>
</template>

<script lang="ts">
    import { defineComponent } from 'vue'
    export default defineComponent({
        created() {
            this.$g.menus.items = [{
                name: 'start',
                path: '/start',
                meta: {
                    title: '快速上手',
                    subTitle: 'Getting Start',
                    icon: 'ThunderboltOutlined',
                    tag: {color: '#f50', content: 'Hot'}
                }
            }]
        }
    })
</script>