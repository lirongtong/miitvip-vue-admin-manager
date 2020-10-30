<template>
    <a-layout-header class="mi-layout-header">
        <slot name="header">
            <div class="mi-layout-header-left">
                <div class="mi-layout-header-trigger" @click="setCollapsed">
                    <MenuUnfoldOutlined v-if="G.mobile" />
                    <MenuFoldOutlined v-else-if="!collapsed" />
                    <MenuUnfoldOutlined v-else />
                </div>
            </div>
            <div class="mi-layout-header-right"></div>
        </slot>
    </a-layout-header>
</template>

<script lang="ts">
    import { defineComponent, computed } from 'vue'
    import { useStore } from 'vuex'
    import { mutations } from '/@src/store/types'

    export default defineComponent({
        setup() {
            const store = useStore()
            const collapsed = computed(() => store.getters['layout/collapsed'])
            return {collapsed, store}
        },
        methods: {
            setCollapsed() {
                const collapse = !this.collapsed
                this.G.menus.collapsed = collapse
                this.store.commit(`layout/${mutations.layout.collapsed}`, collapse)
            }
        }
    })
</script>