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
                    <a-badge :count="1" dot><BellOutlined /></a-badge>
                </div>
                <div class="mi-layout-header-trigger mi-layout-header-trigger-min">
                    <a-dropdown :trigger="['click']" placement="bottomCenter" v-model:visible="menuVisible">
                        <div class="mi-layout-header-dropdown-title">
                            <a-avatar class="avatar" :src="G.avatar" :alt="G.powered" size="small"></a-avatar>
                            <span class="name">{{ G.userInfo.nickname ?? G.author }}</span>
                        </div>
                        <template v-slot:overlay>
                            <mi-layout-header-dropdown></mi-layout-header-dropdown>
                        </template>
                    </a-dropdown>
                </div>
            </div>
        </slot>
    </a-layout-header>
</template>

<script lang="ts">
    import { defineComponent, computed, ref } from 'vue'
    import { useStore } from 'vuex'
    import { mutations } from '/@src/store/types'

    export default defineComponent({
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
</script>