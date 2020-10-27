<template>
    <a-layout class="mi-layout" :class="layoutClass">
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
    import { defineComponent, computed, getCurrentInstance } from 'vue'
    import MiLayoutHeader from '../header/index.vue'
    import MiLayoutSider from '../sider/index.vue'
    import MiLayoutContent from '../content/index.vue'
    import MiLayoutFooter from '../footer/index.vue'

    export default defineComponent({
        components: {
            MiLayoutHeader, MiLayoutSider,
            MiLayoutContent, MiLayoutFooter
        },

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

        methods: {
            resize() {
                console.log('resize')
            }
        },

        mounted() {
            this.$tools.setTitle()
            this.$tools.setKeywords()
            this.$tools.setDescription()
        }
    })
</script>