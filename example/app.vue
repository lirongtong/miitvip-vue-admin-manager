<template>
    <mi-modal v-model:visible="visible"></mi-modal>
</template>

<script lang="ts">
    import { defineComponent } from 'vue'
    export default defineComponent({
        data() {
            return {
                visible: false
            }
        },
        mounted() {}
    })
</script>