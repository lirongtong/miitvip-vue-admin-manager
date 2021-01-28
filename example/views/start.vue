<template>
    <h2>快速上手</h2>
    <mi-search :data="data" search-key="title"></mi-search>
</template>

<script lang="ts">
    import { defineComponent } from 'vue'
    export default defineComponent({
        data() {
            return {
                data: [{title: '1'}]
            }
        }
    })
</script>