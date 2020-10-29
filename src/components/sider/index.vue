<template>
    <a-layout-sider
        class="mi-layout-sider"
        :collapsible="true"
        theme="light"
        width="256"
        breakpoint="lg"
        v-model:collapsed="collapsed"
        :trigger="null"
        v-if="!G.mobile">
        <slot name="sider">
            <mi-layout-sider-logo></mi-layout-sider-logo>
            <mi-layout-sider-menu></mi-layout-sider-menu>
        </slot>
    </a-layout-sider>
</template>

<script lang="ts">
    import { defineComponent, computed, ref, watch } from 'vue'
    import { useStore } from 'vuex'
    import { mutations } from '/@src/store/types'

    export default defineComponent({
        setup() {
            const store = useStore()
            return {store}
        },
        computed: {
            collapsed(): boolean {
                return this.store.getters['layout/collapsed']
            }
        },
        methods: {
            setCollapsed(collapse: boolean) {
                this.store.commit(`layout/${mutations.layout.collapsed}`, collapse)
            }
        }
    })
</script>