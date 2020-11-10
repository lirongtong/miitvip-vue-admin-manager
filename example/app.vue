<template>
    <mi-modal v-model:visible="visible" title="Good Job" @cancel="cancel" @ok="ok">
        <div>Very Good</div>
    </mi-modal>
    <button @click="visible = !visible">Click Me ( Open a Modal )</button>
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