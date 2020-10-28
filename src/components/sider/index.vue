<template>
    <a-layout-sider
        class="mi-layout-sider"
        :clooapsible="true"
        theme="light"
        width="256"
        breakpoint="lg"
        @collapse="setCollapsed"
        :trigger="null">
        <slot name="sider">
            <mi-layout-sider-logo></mi-layout-sider-logo>
            <mi-layout-sider-menu></mi-layout-sider-menu>
        </slot>
    </a-layout-sider>
</template>

<script lang="ts">
    import { defineComponent } from 'vue'
    import { useStore } from 'vuex'
    import { mutations } from '/@src/store/types'

    export default defineComponent({
        setup() {
            const store = useStore()
            return {store}
        },
        methods: {
            setCollapsed(collapse: boolean) {
                this.store.commit(`layout/${mutations.layout.collapsed}`, collapse)
            }
        }
    })
</script>