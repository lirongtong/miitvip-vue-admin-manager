<template>
    <a-layout-content class="mi-layout-content">
        <router-view></router-view>
    </a-layout-content>
</template>

<script lang="ts">
    import { defineComponent } from 'vue'
    import { install } from '/@src/_base/type'
    
    const MiLayoutContent = defineComponent({
        name: 'MiLayoutContent'
    })
    export default install(MiLayoutContent)
</script>