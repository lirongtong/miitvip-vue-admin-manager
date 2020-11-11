<template>
    <mi-modal v-model:visible="visible" title="Good Job" @cancel="cancel" @ok="ok" animation="slit">
        <div>Very Good</div>
    </mi-modal>
    <button @click="visible = !visible" style="z-index: 202011111818;position: absolute">Click Me ( Open a Modal )</button>
    <mi-layout></mi-layout>
</template>

<script lang="ts">
    import { defineComponent } from 'vue'
    export default defineComponent({
        data() {
            return {
                visible: false,
                visible1: false
            }
        },
        methods: {
            cancel() {
                this.visible = !this.visible
            },
            ok(e) {
                console.log('ok', e)
            }
        },
        mounted() {}
    })
</script>