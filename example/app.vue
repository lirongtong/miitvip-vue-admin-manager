<template>
    <mi-modal :visible="visible" :title="false" :footer="null" :closable="false">
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
        mounted() {}
    })
</script>