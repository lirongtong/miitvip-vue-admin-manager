<template>
    <img alt="Vue logo" src="/@images/logo.png" />
    <mi-layout></mi-layout>
</template>

<script lang="ts">
    import { defineComponent } from 'vue'

    const appComponent = defineComponent({
        mounted() {
            this.cookie.set('name', '111')
            this.storage.set('name', '2222')
        }
    })
    export default appComponent
</script>
