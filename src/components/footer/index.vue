<template>
    <a-layout-footer class="mi-layout-footer">
        <slot name="footer">
            <div class="mi-layout-footer-content" v-html="copyright"></div>
        </slot>
    </a-layout-footer>
</template>

<script lang="ts">
    import {defineComponent, computed} from 'vue'

    export default defineComponent({
        computed: {
            copyright() {
                return this.G.mobile ? this.G.copyright : this.G.footer
            }
        }
    })
</script>