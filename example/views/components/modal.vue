<template>
    <mi-modal v-model:visible="visible">
        Content
    </mi-modal>
    <a-button @click="visible = !visible">Click</a-button>
</template>

<script setup>
import { ref } from 'vue'
const visible = ref(false)
</script>