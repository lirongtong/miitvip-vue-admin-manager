<template>
    <a-layout-footer class="mi-layout-footer">
        <div class="mi-layout-footer-content" v-html="copyright"></div>
    </a-layout-footer>
</template>

<script lang="ts">
    import {defineComponent, computed} from 'vue'

    const footerComponent = defineComponent({
        computed: {
            copyright() {
                return this.G.mobile ? this.G.copyright : this.G.footer
            }
        }
    })
    export default footerComponent
</script>