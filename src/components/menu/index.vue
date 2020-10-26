<template>
    <a-menu class="mi-layout-sider-menu" ref="mi-menus" theme="dark" mode="inline">
        <slot name="menu">
            <template v-if="collapsed">
                <mi-layout-menu-dropdown></mi-layout-menu-dropdown>
            </template>
            <template v-else>
                <mi-layout-menu-accordion></mi-layout-menu-accordion>
            </template>
        </slot>
    </a-menu>
</template>

<script lang="ts">
    import { defineComponent } from 'vue'
    import { useStore } from 'vuex'
    import MiLayoutMenuAccordion from './accordion.vue'
    import MiLayoutMenuDropdown from './dropdown.vue'

    export default defineComponent({
        components: {MiLayoutMenuDropdown, MiLayoutMenuAccordion},
        props: {
            menuClassName: {
                type: String,
                default: ''
            }
        },
        computed: {
            collapsed(): any {
                console.log(useStore().getters['layout/collapsed'])
                return useStore().getters['layout/collapsed']
            }
        }
    })
</script>