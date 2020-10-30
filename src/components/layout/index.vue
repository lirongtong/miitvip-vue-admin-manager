<template>
    <a-layout class="mi-layout" :hasSider="G.mobile ? false : true" :class="layoutClass">
        <slot name="layout">
            <mi-layout-sider v-if="!G.mobile"></mi-layout-sider>
            <a-layout class="mi-layout-container">
                <mi-layout-header></mi-layout-header>
                <mi-layout-content></mi-layout-content>
                <mi-layout-footer></mi-layout-footer>
            </a-layout>
        </slot>
    </a-layout>
    <mi-layout-sider-menu-drawer v-if="G.mobile"></mi-layout-sider-menu-drawer>
</template>

<script lang="ts">
    import { defineComponent } from 'vue'
    import { useStore } from 'vuex'
    import { mutations } from '/@src/store/types'
    import MiLayoutSiderMenuDrawer from '../menu/drawer.vue'

    export default defineComponent({
        components: {MiLayoutSiderMenuDrawer},
        props: {
			embed: {
				type: Boolean,
                default: false
            },
            siderClassName: {
				type: String,
                default: ''
            },
            menuClassName: {
				type: String,
                default: ''
            }
        },
        setup() {
            const store = useStore()
            return { store }
        },
        computed: {
            layoutClass(): any {
                const embed = this.G.embed ? `mi-layout-embed `: ''
                const mobile = this.G.mobile ? `mi-layout-mobile ` : ''
				return mobile + embed
            }
        },
        created() {
            this.$tools.setTitle()
            this.$tools.setKeywords()
            this.$tools.setDescription()
            this.G.mobile = this.$tools.isMobile()
            this.G.menus.collapsed = this.store.getters['layout/collapsed']
            if (this.G.mobile) {
                this.G.menus.collapsed = false
                this.store.commit(`layout/${mutations.layout.collapsed}`, false)
            }
        }
    })
</script>