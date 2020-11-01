<template>
    <a-drawer
        class="mi-layout-sider-menu-drawer"
        width="256"
        placement="left"
        :closable="false"
        :visible="G.menus.drawer" @close="() => {G.menus.drawer = !G.menus.drawer}">
        <slot name="darwer">
            <a-layout class="mi-layout mi-layout-mobile" :hasSider="true">
                <a-layout-sider width="256">
                    <mi-layout-sider-logo></mi-layout-sider-logo>
                    <mi-layout-sider-menu></mi-layout-sider-menu>
                </a-layout-sider>
            </a-layout>
        </slot>
    </a-drawer>
</template>

<script lang="ts">
    import { defineComponent, ref } from 'vue'
    import { install } from '/@src/_base/type'

    const MiLayoutSiderMenuDrawer = defineComponent({
        name: 'MiLayoutSiderMenuDrawer',
        setup() {
            const visible = ref(false)
            return { visible }
        }
    })
    export default install(MiLayoutSiderMenuDrawer)
</script>