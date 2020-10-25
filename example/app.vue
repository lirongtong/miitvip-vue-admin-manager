<template>
    <img alt="Vue logo" src="/@images/logo.png" />
    <mi-layout></mi-layout>
</template>

<script lang="ts">
    import { defineComponent } from 'vue'

    const appComponent = defineComponent({
        mounted() {
            this.$tools.setTitle()
            this.$tools.setKeywords()
            this.$tools.setDescription()
            console.log(this.api)
        }
    })
    export default appComponent
</script>
