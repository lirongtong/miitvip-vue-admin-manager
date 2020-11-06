<template>
    <mi-layout>Good Job 3</mi-layout>
</template>

<script lang="ts">
    import { defineComponent } from 'vue'
    export default defineComponent({
        mounted() {
            this.$tools.setTitle()
            this.$tools.setKeywords()
            this.$tools.setDescription()
        }
    })
</script>