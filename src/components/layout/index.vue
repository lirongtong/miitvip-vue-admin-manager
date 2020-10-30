<template>
    <a-layout class="mi-layout" :hasSider="true" :class="layoutClass">
        <slot name="layout">
            <mi-layout-sider></mi-layout-sider>
            <a-layout class="mi-layout-container">
                <mi-layout-header></mi-layout-header>
                <mi-layout-content></mi-layout-content>
                <mi-layout-footer></mi-layout-footer>
            </a-layout>
        </slot>
    </a-layout>
</template>

<script lang="ts">
    import { defineComponent } from 'vue'
    import { useStore } from 'vuex'
    import { mutations } from '/@src/store/types'

    export default defineComponent({
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
        }
    })
</script>