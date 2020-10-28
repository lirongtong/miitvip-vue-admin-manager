<template>
    <a-layout-sider
        class="mi-layout-sider"
        :class="collapsed ? 'mi-layout-sider-collapsed' : null"
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
    import { defineComponent, computed } from 'vue'
    import { useStore } from 'vuex'
    import { mutations } from '/@src/store/types'

    export default defineComponent({
        setup() {
            const store = useStore()
            const collapsed = computed(() => store.getters['layout/collapsed'])
            return {store, collapsed}
        },

        methods: {
            setCollapsed(collapse: boolean) {
                this.store.commit(`layout/${mutations.layout.collapsed}`, collapse)
            }
        }
    })
</script>