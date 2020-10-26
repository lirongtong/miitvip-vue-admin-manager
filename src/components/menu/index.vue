<template>
    <a-menu class="mi-layout-sider-menu">
        <slot name="menu">
            <a-menu-item>Nice</a-menu-item>
        </slot>
    </a-menu>
</template>

<script lang="ts">
    import { defineComponent } from 'vue'
    import { useStore } from 'vuex'

    export default defineComponent({
        props: {
            menuClassName: {
                type: String,
                default: ''
            }
        },
        computed: {
            collapsed() {
                return useStore().getters['layout/collapsed']
            }
        }
    })
</script>