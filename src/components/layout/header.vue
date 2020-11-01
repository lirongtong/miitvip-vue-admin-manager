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
            <div class="mi-layout-header-right">
                <div class="mi-layout-header-trigger mi-layout-header-trigger-min" v-if="!G.mobile">
                    <ExpandOutlined />
                </div>
                <div class="mi-layout-header-trigger mi-layout-header-trigger-min">
                    <mi-layout-header-notice></mi-layout-header-notice>
                </div>
                <div class="mi-layout-header-trigger mi-layout-header-trigger-min">
                    <mi-layout-header-dropdown></mi-layout-header-dropdown>
                </div>
            </div>
        </slot>
    </a-layout-header>
</template>

<script lang="ts">
    import { defineComponent, computed, ref } from 'vue'
    import { useStore } from 'vuex'
    import { install } from '/@src/_base/type'
    import { mutations } from '/@src/store/types'

    const MiLayoutHeader = defineComponent({
        name: 'MiLayoutHeader',
        setup() {
            const store = useStore()
            const collapsed = computed(() => store.getters['layout/collapsed'])
            const menuVisible = ref(false)
            return {collapsed, store, menuVisible}
        },
        methods: {
            setCollapsed() {
                if (this.G.mobile) {
                    this.G.menus.drawer = !this.G.menus.drawer
                } else {
                    const collapse = !this.collapsed
                    this.G.menus.collapsed = collapse
                    this.store.commit(`layout/${mutations.layout.collapsed}`, collapse)
                }
            }
        }
    })
    export default install(MiLayoutHeader)
</script>