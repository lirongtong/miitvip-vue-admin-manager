<template>
    <a-layout-footer class="mi-layout-footer">
        <slot name="footer">
            <div class="mi-layout-footer-content" v-html="copyright"></div>
        </slot>
    </a-layout-footer>
</template>

<script lang="ts">
    import {defineComponent, computed} from 'vue'
    import { install } from '/@src/_base/type'

    const MiLayoutFooter = defineComponent({
        name: 'MiLayoutFooter',
        computed: {
            copyright() {
                return this.G.mobile ? this.G.copyright : this.G.footer
            }
        }
    })
    export default install(MiLayoutFooter)
</script>