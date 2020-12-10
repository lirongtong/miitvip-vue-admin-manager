<template>
    Getting Started
    <button @click="handleVisible">test</button>
    <mi-modal v-model:visible="visible" title="Title" animation="shake">Content</mi-modal>
</template>

<script lang="ts">
    import { defineComponent } from 'vue'
    export default defineComponent({
        data() {
            return {
                visible: false
            }
        },
        methods: {
            handleVisible() {
                this.visible = !this.visible
            }
        }
    })
</script>