<template>
    <router-view />
</template>

<script setup>
    import { nextTick } from 'vue'

    nextTick().then(() => {
        const _loading = document.getElementById('mi-loading-before-init')
        if (_loading) _loading.remove()
    })
</script>