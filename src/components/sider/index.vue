<template>
    <a-layout-sider
        class="mi-layout-sider"
        :clooapsible="true"
        theme="light"
        width="256"
        :trigger="null">
        <mi-layout-sider-logo></mi-layout-sider-logo>
    </a-layout-sider>
</template>

<script lang="ts">
    import { defineComponent } from 'vue'
    import MiLayoutSiderLogo from '../logo/index.vue'

    const indexComponent = defineComponent({
        components: {MiLayoutSiderLogo}
    })
    export default indexComponent
</script>