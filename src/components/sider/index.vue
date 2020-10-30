<template>
    <a-layout-sider
        class="mi-layout-sider"
        width="256"
        breakpoint="lg"
        v-model:collapsed="G.menus.collapsed"
        @collapse="setCollapsed"
        :trigger="null"
        collapsible
        v-if="!G.mobile">
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
            return { store }
        },
        methods: {
            setCollapsed(collapse: boolean): void {
                this.G.menus.collapsed = collapse
                this.store.commit(`layout/${mutations.layout.collapsed}`, collapse)
            }
        }
    })
</script>